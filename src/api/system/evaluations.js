import request from '@/utils/request'

// 查询司机评议报告列表
export function listEvaluations(query) {
  return request({
    url: '/drivers/evaluations/list',
    method: 'get',
    params: query
  })
}

// 查询司机评议报告详细
export function getEvaluations(id) {
  return request({
    url: '/drivers/evaluations/' + id,
    method: 'get'
  })
}

// 新增司机评议报告
export function addEvaluations(data) {
  return request({
    url: '/drivers/evaluations',
    method: 'post',
    data: data
  })
}

// 修改司机评议报告
export function updateEvaluations(data) {
  return request({
    url: '/drivers/evaluations',
    method: 'put',
    data: data
  })
}

// 删除司机评议报告
export function delEvaluations(id) {
  return request({
    url: '/drivers/evaluations/' + id,
    method: 'delete'
  })
}
