import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { initStore, addUser } from '../stores'
import withRedux from 'next-redux-wrapper'
import Header from '../components/Header'
import Layout from '../components/Layout'
import fetch from 'isomorphic-fetch'
import Router from 'next/router'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false
    }
  }
  static getInitialProps ({ store, isServer, query }) {
    const code = query.code
    return { isServer, code }
  }

  async componentDidMount () {
    if (this.props.code) {
      this.setState({ isLoading: true })
      const res = await fetch(`/api/access-token/${this.props.code}`)
      const result = await res.json()
      if (result.access_token) {
        this.props.addUser(result)
        Router.push('/')
      }
      
    }
  }

  render () {
    return (
      <Layout>
        <Header title='Login' linkTo='/about' />
        <div className="columns login-page">
          <div className="column is-4">
          </div>
          <div className="column is-2">
            <span className="icon instagram-large">
                <i className="fa fa-instagram"></i>
              </span>
          </div>
          <div className="column is-2 login-border">
            <strong className="login-title" >Sign In</strong>
            <h5>Sign in using your instagram account</h5>
            <div className="block login-button">
              <a className={ `button is-light ${( this.state.isLoading ? 'is-loading' : '' )}` } href="/instagram-login">Sign in</a>
            </div>
          </div>
          <div className="column is-4">
          </div>
        </div>
        <footer></footer>
      </Layout>
    )
  }
}

const mapStateToProps = ({ count }) => ({ count })
const mapDispatchToProps = (dispatch) => {
  return {
    addUser: bindActionCreators(addUser, dispatch)
  }
}

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Login)
