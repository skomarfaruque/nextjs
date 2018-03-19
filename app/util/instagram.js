const fetch = require('isomorphic-fetch')

const protocol = 'https'
const host = 'api.instagram.com'
const apiVersion = 'v1'


class Instagram {

  constructor (options = {}) {
    this.accessToken = options.accessToken
    this.clientId = options.clientId
    this.clientSecret = options.clientSecret
    this.redirectUri = options.redirectUri
  }

  async get(endpoint, opts) {
    const path = `/${apiVersion}${endpoint}`
    const url = this.buildUrl(path, opts)
    const res = await fetch(url)
    return await res.json()
  } 
  async post(endpoint, query, post) {
    const path = `/${apiVersion}${endpoint}`
    const url = this.buildUrl(path, query)
    console.log(url)
    const postParams = this.buildEncodedForm(post)
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: postParams 
    })
    return await res.json()
  } 
  async del(endpoint, query, post) {
    const path = `/${apiVersion}${endpoint}`
    const url = this.buildUrl(path, query)
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: '' 
    })
    return await res.json()
  } 

  getAuthUrl () {
    return this.buildUrl('/oauth/authorize', {
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'public_content+likes+comments+follower_list+relationships',
      response_type: 'code'
    })
  }

  async getAccessToken (code) {
    const url = this.buildUrl('/oauth/access_token')
    const opts = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code: code,
      grant_type: 'authorization_code'
    }
    const searchParams = this.buildEncodedForm(opts)
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: searchParams 
    })
    return res.json()
  }

  buildUrl (path, options) {
    var newPath = this.buildPath(path, options)
    var queryParams = this.buildQueryParams(newPath.options)
    var url = protocol + '://' + host + newPath.path + queryParams

    return url
  }
  buildQueryParams(options) {
    let query = []

    if (this.accessToken) {
      options.access_token = this.accessToken
    }

    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        query.push(prop + '=' + options[prop])
      }
    }

    if (query.length) {
      return '?' + query.join('&')
    }

    return ''
  }

  buildPath(path, options) {
    let optionsLeft = {}
    for (let prop in options) {
      let bracedProp = `{${prop}}`
      if (options.hasOwnProperty(prop) && path.indexOf(bracedProp) > -1) {
        path = path.replace(bracedProp, options[prop])
      } else if (prop.indexOf('{') < 0) {
        optionsLeft[prop] = options[prop]
      }
    }

    return {
      path: path,
      options: optionsLeft
    }
  }
  
  buildEncodedForm (data) {
    return Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&')
  }
}

module.exports = Instagram
