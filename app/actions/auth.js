const Instagram = require('../util/instagram')
const ig = new Instagram({
      clientId: 'caecd34647614b55a3aab33a959284f8',
      clientSecret: 'd611ad411a6d43c0b07ec9020e5d1511',
      redirectUri: 'http://localhost:3000/login'
    })

exports.authorizeUser = (ctx, next) => {
  const url = ig.getAuthUrl()
  ctx.redirect(url)
}

exports.handleAuth = async (ctx, next) => {
  const result = await ig.getAccessToken(ctx.params.code)
  ctx.body = result
}
