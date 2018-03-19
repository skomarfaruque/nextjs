import React, {Component} from 'react'
import Link from 'next/link'
import NProgress from 'nprogress'
import { connect } from 'react-redux'
import Router from 'next/router'
import cookie from 'js-cookie'
import { bindActionCreators } from 'redux'
import { removeUser } from '../stores'

import SearchBox from './SearchBox'

Router.onRouteChangeStart = (url) => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const mapStatetoProps = ({ user, search }) => ( { ...user, search: search.searchTag })
const mapDispatchToProps = (dispatch) => {
  return {
    removeUser: bindActionCreators(removeUser, dispatch)
  }
}
export default connect(mapStatetoProps, mapDispatchToProps)(({ children, title = 'Company', showSearch, user_id, fullName, profile, search, removeUser }) => {
  let headerTag
  if (showSearch) {
    headerTag = children
    
  } else {
    headerTag = <a className="navbar-item">{title}</a>
  }
  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item icon is-large is-black"><i className="fa fa-css3" aria-hidden="true"></i></a>
        </Link>
        {headerTag}
        <div className="navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

      <div className="navbar-menu">
        <div className="navbar-start"></div>
        <div className="navbar-end">
          <a className="navbar-item">About</a>
          <Link href="/login">
            <a className={`navbar-item ${(user_id !== 0 ? 'is-hidden' : '')}`}>Log in</a>
          </Link>
          <div className={`navbar-item has-dropdown is-hoverable ${(user_id === 0 ? 'is-hidden': '')}`}>
            <a className="navbar-item is-active">
              <img className="is-rounded" src={profile} alt=""/>
            </a>
            <div className="navbar-dropdown">
              <div className="navbar-item">
                <div>
                  {fullName}
                </div>
              </div>
              <hr className="navbar-divider"/>
              <a className="navbar-item" onClick={removeUser}>Log out</a>
            </div>
          </div>
        </div>
      </div>
      </nav>
  )
})

