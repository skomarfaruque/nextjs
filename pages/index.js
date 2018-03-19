import React, { Component } from 'react'
import withRedux from 'next-redux-wrapper'
import Header from '../components/Header'
import Layout from '../components/Layout'
import Router from 'next/router'
import { bindActionCreators } from 'redux'
import { initStore, serverUser, addSearchTag } from '../stores'
import css from 'static/css/index.sass'
import cookie from 'cookie'

class Index extends Component {
  static getInitialProps ({ store, isServer, req }) {

      store.dispatch(serverUser(req, isServer))
    return { isServer }
  }
  
  componentDidMount () {
    // this.props.serverUser(null, false)
    // console.log(this.props)
  }

  componentWillUnmount () {
  }
  handleChange = (event) => {
    this.props.addSearchTag(event.target.value)    
  }
  search = async (event) => {
    if(!event.key || event.key === 'Enter') {
      if (!this.props.search) {
        return 
      }
      if (this.props.user_id === 0) {
        Router.push(`/login`)

      } else {
        Router.push(`/search?q=${this.props.search}`)
      }
    }
  }

  render () {
    return (
      <Layout title='Home'>
        <Header title='Home' linkTo='/about'/>
        <div className="columns has-text-centered home-page">
          <div className="column is-half is-offset-3 has-text-centered">
            <div className="field has-addons">
              <p className="control flex-fix">
                <input className="input" value={this.props.search} type="search" onChange={this.handleChange} onKeyPress={this.search} />
              </p>
              <p className="control">
                <button className="button" onClick={this.search}>
                  <i className="fa fa-search"></i>
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className="container has-text-centered home-mid">
          <h2 className="subtitle home-title">
            Search for image by hashtag or any keyword<br/><br/>
            <strong>Popular hashtags</strong><br/><br/>
            #love #instagram #me #celebrity #picoftheday #love #instagram #me #celebrity #picoftheday
          </h2>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = ({ user, search }) => ({ user_id: user.user_id, search: search.searchTag })

const mapDispatchToProps = (dispatch) => {
  return {
    addSearchTag: bindActionCreators(addSearchTag, dispatch),
    serverUser: bindActionCreators(serverUser, dispatch)
  }
}
export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Index)
