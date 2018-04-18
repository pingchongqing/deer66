const {mysql} = require('../qcloud')
// 创建邀请接口
module.exports = async ctx => {
  let rbd = ctx.request.body
  if (rbd && Object.keys(rbd).length) {
    //地址，发起人，人数，时间都有值
    if (rbd.address && rbd.idcreatby && rbd.people && rbd.time) {
      let subquery = await mysql('creatby').select('created').where({idcreatby:rbd.idcreatby}).orderBy('created', 'desc')
      //限制相同ID3秒内只能创建一次
      let bp = {msg:'创建失败'}
      if ((subquery.length && parseInt(subquery[0].created) < Date.now()-3*1000) || !subquery.length) {
          bp = await mysql('creatby').insert({created:Date.now(),updated:Date.now(),...rbd})
      }
      //console.log(bp);
      ctx.body = {code:'ok', data: bp}
      // mysql('cappinfo').select('*').then(res => {
      //   console.log(res)
      //   ctx.body = res
      // })
    } else {
      ctx.body = {code:'含有空值', errMsg: '地址，发起人，人数，时间含有空值'}
    }
  } else {
    ctx.body = {code:'空值', errMsg: '不能传递空值'}
  }
}
