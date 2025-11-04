import request from '@/utils/request'

// 查询排班列表
export function listSchedules(query) {
  return request({
    url: '/schedules/schedules/list',
    method: 'get',
    params: query
  })
}

// 查询排班详细
export function getSchedules(id) {
  return request({
    url: '/schedules/schedules/' + id,
    method: 'get'
  })
}

// 新增排班
export function addSchedules(data) {
  return request({
    url: '/schedules/schedules',
    method: 'post',
    data: data
  })
}

// 修改排班
export function updateSchedules(data) {
  return request({
    url: '/schedulesschedules',
    method: 'put',
    data: data
  })
}

// 删除排班
export function delSchedules(id) {
  return request({
    url: '/schedules/schedules/' + id,
    method: 'delete'
  })
}
