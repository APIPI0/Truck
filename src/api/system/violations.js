import request from '@/utils/request'

// 查询货车历史违规记录列表
export function listViolations(query) {
  return request({
    url: '/violations/violations/list',
    method: 'get',
    params: query
  })
}

// 查询货车历史违规记录详细
export function getViolations(id) {
  return request({
    url: '/violations/violations/' + id,
    method: 'get'
  })
}

// 新增货车历史违规记录
export function addViolations(data) {
  return request({
    url: '/violations/violations',
    method: 'post',
    data: data
  })
}

// 修改货车历史违规记录
export function updateViolations(data) {
  return request({
    url: '/violations/violations',
    method: 'put',
    data: data
  })
}

// 删除货车历史违规记录
export function delViolations(id) {
  return request({
    url: '/violations/violations/' + id,
    method: 'delete'
  })
}
