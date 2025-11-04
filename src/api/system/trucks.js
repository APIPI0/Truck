import request from '@/utils/request'

// 查询货车信息列表
export function listTrucks(query) {
  return request({
    url: '/trucks/trucks/list',
    method: 'get',
    params: query
  })
}

// 查询货车信息详细
export function getTrucks(truckId) {
  return request({
    url: '/trucks/trucks/' + truckId,
    method: 'get'
  })
}

// 新增货车信息
export function addTrucks(data) {
  return request({
    url: '/trucks/trucks',
    method: 'post',
    data: data
  })
}

// 修改货车信息
export function updateTrucks(data) {
  return request({
    url: '/trucks/trucks',
    method: 'put',
    data: data
  })
}

// 删除货车信息
export function delTrucks(truckId) {
  return request({
    url: '/trucks/trucks/' + truckId,
    method: 'delete'
  })
}
