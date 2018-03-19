import Link from 'next/link'
import Head from 'next/head'

import bulma from 'bulma/css/bulma.css'
import css from 'styles/index.sass'

export default ({ children, title = 'This is the default title' }) => (
  <div>
    <Head>
      <title>{ title }</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      
      <style dangerouslySetInnerHTML={{ __html: bulma }} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      <link rel="stylesheet" href="/static/css/nprogress.css" />
      
    </Head>
    <style dangerouslySetInnerHTML={{ __html: css }} />
    
    <div className='container hero'> 
      
      { children }
    </div>
  </div>
)