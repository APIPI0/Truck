<template></template>
<script>
import mqtt from 'mqtt';

export default {
  data() {
    return {
      client: null,
      uid: 'your_uid', // 替换为巴法云UID
      topic: 'your_topic', // 替换为自定义主题
      key: 'xx' // 替换为巴法云密钥
    };
  },
  mounted() {
    this.connectBemfa();
  },
  methods: {
    connectBemfa() {
      // 连接配置（巴法云要求携带UID和Key）
      const options = {
        clientId: `vue_${Date.now()}`, // 自定义客户端ID
        username: this.uid,
        password: this.key,
        clean: true // 清除历史会话
      };
      
      // 连接巴法云MQTT（WebSocket）
      this.client = mqtt.connect(`ws://bemfa.com:9501/mqtt`, options);

      this.client.on('connect', () => {
        console.log('巴法云MQTT连接成功');
        this.subscribeTopic(); // 订阅主题
      });

      this.client.on('message', (topic, message) => {
        // 消息处理（巴法云默认返回JSON格式，需根据实际协议解析）
        const payload = message.toString();
        console.log(`[${topic}] 接收消息：`, payload);
        this.$emit('mqtt-data', payload); // 触发父组件更新
      });

      this.client.on('error', (err) => {
        console.error('巴法云连接失败：', err);
      });
    },
    subscribeTopic() {
      this.client.subscribe(this.topic, { qos: 0 }, (err) => {
        if (!err) console.log(`已订阅主题：${this.topic}`);
        else console.error('订阅失败：', err);
      });
    },
    publishMessage(data) {
      // 发布消息（示例：温度数据）
      const payload = JSON.stringify({ temp: data, time: new Date().getTime() });
      this.client.publish(this.topic, payload, (err) => {
        if (!err) console.log(`已发布消息：${payload}`);
      });
    },
    disconnect() {
      if (this.client) {
        this.client.end();
        this.client = null;
      }
    }
  },
  beforeDestroy() {
    this.disconnect(); // 组件销毁时断开连接
  }
};
</script>