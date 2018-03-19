const Router = require('koa-router')
const auth = require('./actions/auth')
const api = require('./actions/api')

const router = new Router()


router.get('/instagram-login', auth.authorizeUser)
router.get('/api/access-token/:code', auth.handleAuth)

router.get('/api/tag/search', api.searchTags)
router.get('/api/users/search', api.searchRelatedUsers)
router.get('/api/tags/:tagname/media/recent', api.mediaTags)
router.get('/api/media/:mediaid/comments', api.mediaComments)
router.get('/api/media/:mediaid/likes', api.mediaInsertLike)
router.get('/api/media/:mediaid/docomment', api.mediaInsertComment)
router.get('/api/media/:mediaid/deletelikes', api.mediaDeleteLike)

module.exports = router
