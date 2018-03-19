import React from 'react'

// import Header from '../components/Header'
// import Layout from '../components/Layout'

export default class Counter extends React.Component {
  static getInitialProps ({ isServer }) {
    return { isServer }
  }
  render () {
    return (
      <div>
        #some text
      </div>
      // <Layout>
      //   <Header title='About Page' linkTo='/' />
      // </Layout>
      
    )
  }
}
