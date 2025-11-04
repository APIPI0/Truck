import request from '@/utils/request'

// 查询司机列表
export function listDrivers(query) {
  return request({
    url: '/drivers/drivers/list',
    method: 'get',
    params: query
  })
}

// 查询司机详细
export function getDrivers(driverId) {
  return request({
    url: '/drivers/drivers/' + driverId,
    method: 'get'
  })
}

// 新增司机
export function addDrivers(data) {
  return request({
    url: '/drivers/drivers',
    method: 'post',
    data: data
  })
}

// 修改司机
export function updateDrivers(data) {
  return request({
    url: '/drivers/drivers',
    method: 'put',
    data: data
  })
}

// 删除司机
export function delDrivers(driverId) {
  return request({
    url: '/drivers/drivers/' + driverId,
    method: 'delete'
  })
}
