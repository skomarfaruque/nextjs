import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import cookie from 'js-cookie'
import parser from 'cookie'

const userState = {
  access_token: '0',
  user_id: 0,
  profile: '',
  fullName: '',
  userName: ''
}
const searchState = {
  searchTag:''
}
// Combined State
export const initialState = {
  user: userState,
  search: searchState
}


export const actionTypes = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

// REDUCERS
export const userReducer = (state = userState, action) => {
  switch (action.type) {
    case 'REMOVE':
      cookie.remove('insta-app')
      return Object.assign({}, state, {
        access_token: '0',
        user_id: 0,
        profile: '',
        fullName: '',
        userName: ''
      })
    case 'ADD':
      const newState = Object.assign({}, state, {
        access_token: action.user.access_token,
        user_id: action.user.user.id,
        profile: action.user.user.profile_picture,
        fullName: action.user.user.full_name,
        userName: action.user.user.username
      })
      cookie.set('insta-app', newState)
      return newState
    case 'ADDSERVERUSER':
      return Object.assign({}, state, { ...action.user })

    default: return state
  }
}
export const searchReducer = (state = searchState, action) => {
  switch (action.type) {
    case 'SEARCH':
      return Object.assign({}, state, {
        searchTag: action.tag
      })
    default: return state
  }
}
const reducer = combineReducers({user: userReducer, search: searchReducer})
// ACTIONS

export const serverUser = (req, isServer) => dispatch => {
  let user = userState
  if (isServer) {
    if(req.headers.cookie) {
      const c = parser.parse(req.headers.cookie)
      user = c['insta-app'] ? JSON.parse(c['insta-app']) : userState
    }
  } else {
    const cuser = cookie.get('insta-app')
    if (cuser) {
      user = JSON.parse(cuser)
    }
  }
  return dispatch({ type: 'ADDSERVERUSER', user })
}
export const addUser = (user) => dispatch => {
  return dispatch({ type: actionTypes.ADD, user })
}

export const removeUser = () => dispatch => {
  return dispatch({ type: actionTypes.REMOVE })
}

export const addSearchTag = (tag) => dispatch => {
  return dispatch({ type: 'SEARCH', tag })
}

export const initStore = (initialState = initialState, req) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
