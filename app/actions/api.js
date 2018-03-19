const Endpoint = require('../util/endpoints')
const Instagram = require('../util/instagram')

const ig = new Instagram()

exports.searchTags = async ctx => {
  const access_token = ctx.query.token
  const q = ctx.query.q
  const count = ctx.query.count
  ctx.body = await ig.get(Endpoint.tag.search, { q, access_token, count })
}
exports.searchRelatedUsers = async ctx => {
  const access_token = ctx.query.token
  const q = ctx.query.q
  const count = ctx.query.count
  ctx.body = await ig.get(Endpoint.tag.relateduser, { q, access_token, count })
}
exports.mediaTags = async ctx => {
  const access_token = ctx.query.token
  const max_tag_id = ctx.query.max_tag_id
  const tagname = ctx.params.tagname
  const count = ctx.query.count
  ctx.body = await ig.get(Endpoint.media.search, { access_token, count, tagname, max_tag_id })
}
exports.mediaComments = async ctx => {
  const access_token = ctx.query.token
  const mediaid = ctx.params.mediaid
  ctx.body = await ig.get(Endpoint.comments.search, { access_token, mediaid })
}
exports.mediaInsertLike = async ctx => {
  const access_token = ctx.query.token
  const mediaid = ctx.params.mediaid
  ctx.body = await ig.post(Endpoint.like.insert, {mediaid }, {access_token: access_token})
}
exports.mediaInsertComment = async ctx => {
  const access_token = ctx.query.token
  const text = ctx.query.text
  const mediaid = ctx.params.mediaid
  ctx.body = await ig.post(Endpoint.comments.insert, {mediaid }, {access_token: access_token, text: text})
}
exports.mediaDeleteLike = async ctx => {
  const access_token = ctx.query.token
  const mediaid = ctx.params.mediaid
  ctx.body = await ig.del(Endpoint.like.delete, {mediaid, access_token }, {})
}
