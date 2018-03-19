/**
 * For Instagram API Endpoint types
 */

module.exports = {
  tag: {
    search: '/tags/search',
    relateduser: '/users/search'
  },
  media: {
    search: '/tags/{tagname}/media/recent'
  },
  comments: {
    search: '/media/{mediaid}/comments',
    insert: '/media/{mediaid}/comments'
  },
  like: {
    insert: '/media/{mediaid}/likes',
    delete: '/media/{mediaid}/likes'
  }
}
