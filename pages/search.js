import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { initStore, serverUser, addSearchTag } from '../stores'
import withRedux from 'next-redux-wrapper'
import Header from '../components/Header'
import SearchBox from '../components/SearchBox'
import Layout from '../components/Layout'
import ImageBlock from '../components/ImageBlock'
import fetch from 'isomorphic-fetch'
import Router from 'next/router'

class Search extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: false,
      searchTag: '',
      totalCount: '',
      modalStandardImage:'',
      modalLikes:'',
      itemCountSlide:'',
      previousBtnShow:true,
      nextBtnShow:true,
      isActive: false,
      data: [],
      relatedUser: [],
      commentText:'',
      index: '',//i used it for like dislike item track
      firstItemMedia: [],
      pagination: {},
      item: {user: {}, images: { standard_resolution: {} }, commentsInfo: [],type:'', likes: {}, videos: { standard_resolution: {} }, user_has_liked: false, created_time:'' }
    }
  }
  static getInitialProps ({ req, store, isServer, query }) {
    store.dispatch(serverUser(req, isServer))
    const code = query.q
    store.dispatch(addSearchTag(code))
    return { isServer, code }
  }


  async componentDidMount () {
   await this.search()
  }
 handleComments = (event) => {
    this.setState({
      commentText: event.target.value
    })
  }
  likeToggle = async(id,actionType,index) => {
    if(actionType){
      this.state.firstItemMedia[index].user_has_liked = false
      this.state.firstItemMedia[index].likes.count -= 1
      const del = await fetch(`/api/media/${id}/deletelikes?token=${this.props.access_token}`)
    }else{
      const likeToggle = await fetch(`/api/media/${id}/likes?token=${this.props.access_token}`)
      this.state.firstItemMedia[index].user_has_liked = true
      this.state.firstItemMedia[index].likes.count += 1
    }
    this.setState({
      firstItemMedia:this.state.firstItemMedia
    })
     
  }
  postComments = async() => {
    if(this.state.commentText){
        const getComments = await fetch(`/api/media/${this.state.item.id}/docomment?token=${this.props.access_token}&text=${this.state.commentText}`)
        const commentsInfo = await getComments.json()
          this.state.firstItemMedia[this.state.index].commentsInfo.push(commentsInfo.data)
          this.state.firstItemMedia[this.state.index].comments.count +=1
          this.refs.commentField.value = "";
          this.setState({
            firstItemMedia:this.state.firstItemMedia,
            commentText:''
          })
         
      }
  }
  eachModalShow = async(item, index) => {
    item.commentsInfo = []
    const commentsInfo = await this.getCommentsByMedia(item.id)
     if(commentsInfo){
          await Promise.all(commentsInfo.data.map(async (element) => {
           item.commentsInfo.push(element)
          }))
        }
    this.setState({
      isActive:!this.state.isActive,
      item,
      itemCountSlide: index,
      index: index,
      previousBtnShow: index <= 0?false:true,
      nextBtnShow: index < this.state.firstItemMedia.length -1?true:false
    })
  }
  toggleModal = () => {
    this.setState({
      isActive:!this.state.isActive
    })
  }
  getCommentsByMedia = async(itemId) =>{
    const getComments =  await fetch(`/api/media/${itemId}/comments?token=${this.props.access_token}`)
    const commentsInfo =  await getComments.json()
    return commentsInfo
  }
  setSearchTagName = async(tag, mediaCount) =>{
    await this.setState({
      searchTag: tag,
      totalCount: mediaCount
    })
    await this.searchResult()
  }
  handleChange = (event) => {
    this.props.addSearchTag(event.target.value)
  }
  previousMedia = async(count) =>{
    let item = this.state.firstItemMedia[count]
    item.commentsInfo = []
    const commentsInfo = await this.getCommentsByMedia(item.id)
    if (commentsInfo) {
      await Promise.all(commentsInfo.data.map(async (element) => {
        item.commentsInfo.push(element)
      }))
    }
    this.setState({
      itemCountSlide: count,
      index: count,
      item,
      previousBtnShow: count <= 0 ? false : true,
      nextBtnShow: count < this.state.firstItemMedia.length - 1 ? true : false
    })
  }
  nextLoadMore = async (count) => {
    let loadHit = true
    if(typeof count ==='number' && count % 12 != 0){
        loadHit = false
      }
    if (this.state.pagination.next_url && loadHit) {
      
      const resFirstTag = await fetch(`/api/tags/${this.state.data[0].name}/media/recent?token=${this.props.access_token}&count=12&max_tag_id=${this.state.pagination.next_max_id}`)
      const resultFirstTag = await resFirstTag.json()
      if (resultFirstTag.data) {
        let newResult = this.state.firstItemMedia
        await Promise.all(resultFirstTag.data.map(async (element) => {
          newResult.push(element)
        }))
        this.setState({
          firstItemMedia: newResult,
          pagination: resultFirstTag.pagination
        })
      }
      if (this.state.isActive) {
        let item = this.state.firstItemMedia[count]
        item.commentsInfo = []
        const commentsInfo = await this.getCommentsByMedia(item.id)
        if (commentsInfo) {
          await Promise.all(commentsInfo.data.map(async (element) => {
            item.commentsInfo.push(element)
          }))
        }
        this.setState({
          itemCountSlide: count,
          index: count,
          item,
          nextBtnShow: count < this.state.firstItemMedia.length - 1 ? true : false,
          previousBtnShow: count <= 0 ? false : true,
        })
      }
    } else {
       let item = this.state.firstItemMedia[count]
        item.commentsInfo = []
        const commentsInfo = await this.getCommentsByMedia(item.id)
        if (commentsInfo) {
          await Promise.all(commentsInfo.data.map(async (element) => {
            item.commentsInfo.push(element)
          }))
        }
      this.setState({
        itemCountSlide: count,
        index: count,
        item,
        nextBtnShow: count < this.state.firstItemMedia.length - 1 ? true : false,
        previousBtnShow: count <= 0 ? false : true,
      })
    }
  }
  search = async (event) => {
    if (!event || event.key === 'Enter') {
      if (!this.props.search) {
        return
      }
      const res = await fetch(`/api/tag/search?q=${this.props.search}&token=${this.props.access_token}&count=10`)
      const result = await res.json()
      this.setState({
        data: result.data
      })
      const relatedUser = await fetch(`/api/users/search?q=${this.props.search}&token=${this.props.access_token}&count=10`)
      const relatedUserData = await relatedUser.json()
      this.setState({
        relatedUser: relatedUserData.data
      })
      if (this.state.data.length) {
        this.setState({
          searchTag: this.state.data[0].name,
          totalCount: this.state.data[0].media_count
        })
       
        await this.searchResult() 
      }
    }
  }
   searchResult = async() =>{
     const resFirstTag = await fetch(`/api/tags/${this.state.searchTag}/media/recent?token=${this.props.access_token}&count=12&max_tag_id=`)
        const resultFirstTag = await resFirstTag.json()
        this.setState({
          firstItemMedia: resultFirstTag.data,
          pagination: resultFirstTag.pagination
        })
  }

  render () {
    let nextbtn
    let loadMoreBtn
    let imageOrVideo
    let createdDateTime
    let created_time = parseInt(this.state.item.created_time+'000')
     createdDateTime = moment(moment(created_time).format('YYYYMMDDHIS'), "YYYYMMDDHIS").fromNow()
    if (this.state.pagination.next_url || this.state.nextBtnShow) {
      nextbtn = (
         <a className="icon is-medium right" onClick={() => { this.nextLoadMore(this.state.itemCountSlide+1) }}><i className="fa fa-chevron-right" aria-hidden="true"></i></a>
      )
    } 
    if (this.state.pagination.next_url) {
      loadMoreBtn = (
         <div className="columns load-more">
          <div className="column is-12">
            <a className="button is-info"  onClick={this.nextLoadMore}>Load More</a>
          </div>
        </div>
      )
    }
   
    if (this.state.item.type === 'image') {
      imageOrVideo = (
        <p className="image is-square">
          <img className="" src={this.state.item.images.standard_resolution.url} />
        </p>

      )
    } else{
       imageOrVideo = (
      <div className="video is-square">
      <video controls playsInline poster={this.state.item.images.standard_resolution.url} src={this.state.item.videos.standard_resolution.url} />
        {/*<video className="_c8hkj" playsInline=""  poster={this.state.item.images.standard_resolution.url} preload="none" src={this.state.item.videos.standard_resolution.url} type="video/mp4"></video>*/}
      </div>

    )
    }
    return (
      <Layout title='Search'>
        <Header title='Search' linkTo='/search' showSearch={true}>
          <SearchBox search={this.props.search} onChange={this.handleChange}  keyPress={this.search} />
        </Header>
        <div className="columns date-margin">
          <div className="column is-12 is-offset-1">
            Date <i className="fa fa-angle-down date-arrow" aria-hidden="true"></i>
          </div>
        </div>
        <div className="columns">
          <div className="column is-12 is-offset-1">
            <p><a>Any Time</a> <a className="date-space">Last 15 days</a> <a className="date-space">Last 90 days</a></p>
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            Related Hashtags
          </div>
          <div className="block is-10">
             {this.state.data.map(m => (              
              <a className="button is-light button-space" onClick={() => { this.setSearchTagName(m.name, m.media_count) }} key={m.name}><span>#{m.name}</span> &nbsp; <span className="media-count is-blue">{m.media_count}</span></a>
            ))} 
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            Related Users
          </div>
          <div className="block is-10">
             {this.state.relatedUser.map(m => (              
              <a className="button is-light button-space" onClick={() => { this.setSearchTagName(m.username) }} key={m.username}><span>#{m.username}</span></a>
            ))} 
          </div>
        </div>
        <div className="columns">
          <div className="column is-12">
            <p>Total {this.state.totalCount} results found for #{this.state.searchTag}.</p>
          </div>
        </div> 
        <div className="columns img-column">
          {this.state.firstItemMedia.map((item, index) => (
          <ImageBlock name={item.user.full_name} profile={item.user.profile_picture} imgSrc={item.images.low_resolution.url} like={item.likes.count} comment={item.comments.count} onclick={() => { this.eachModalShow(item, index) }} likeclick={() => { this.likeToggle(item.id,item.user_has_liked,index) }} mediatype={item.type} isliked={item.user_has_liked} key={item.id}/>
          ))}
        </div>
        
        <div className={`modal image-box ${this.state.isActive ? 'is-active' : ''}`}>
          
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="navigation-arrow">
              {this.state.previousBtnShow &&
                <a className="icon is-medium left" onClick={() => { this.previousMedia(this.state.itemCountSlide-1) }}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
              }
             { nextbtn }
            </div>
            <div className="columns search">
              <div className="column is-two-thirds">
                {imageOrVideo}
              </div>
              <div className="column comment-side">
                <div className="user-profile">
                  <img src={this.state.item.user.profile_picture} />
                  <h2 className="label">{this.state.item.user.full_name}</h2>
                </div>
                <hr/>
                <div className="like-cmt">
                  <a className="icon is-small" onClick={() => { this.likeToggle(this.state.item.id,this.state.item.user_has_liked,this.state.index) }}><i className={`fa fa-heart${(this.state.item.user_has_liked ? '' : '-o')}`} aria-hidden="true"></i></a>
                  <strong>{this.state.item.likes.count} likes</strong>
                  <p>{createdDateTime}</p>
                </div>
                <hr/>
                <div className="comment-area">
                  { this.state.item.commentsInfo.map(comments => (
                  <div className="card" key={comments.id}>
                    <div className="column is-fullwidth">
                      <nav className="level">
                        <div className="level-left">
                          <p className="level-item"><a className="is-medium"><img className="image is-rounded profileImg" src={comments.from.profile_picture} /> <span >{comments.from.full_name}</span></a></p>
                        </div>
                        <div className="level-right">
                          <p className="level-item"><a className="icon is-small"><i className="fa fa-reply" aria-hidden="true"></i></a></p>
                        </div>
                      </nav>
                      <p>
                        { comments.text}
                      </p>
                    </div>  
                  </div>
                    ))}
                </div>
               
                 <nav className="level custom-commentbox">
                  <div className="level-left">
                    <div className="comment-box level-item">
                      <p className="control">
                        <textarea className="textarea" ref="commentField" placeholder="Add a comment" onChange={this.handleComments} onKeyPress={this._handleKeyPress}></textarea>
                      </p>
                    </div>
                  </div>
                  <div className="level-right">
                    <p className="level-item"><a className="button" onClick={() => { this.postComments() }}><i className="fa fa-paper-plane" aria-hidden="true"></i></a></p>
                  </div>
                </nav>
                
              </div>              
            </div>
          </div>         
          
          <button className="modal-close is-large" onClick={this.toggleModal}></button>
        </div>
         
       {loadMoreBtn}

        <div className="columns lolobyte">
          <div className="column is-12">
            <a>LOLOBYTE</a>
          </div>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = ({ user, search }) => ({ user_id: user.user_id , access_token: user.access_token, search: search.searchTag })
const mapDispatchToProps = (dispatch) => {
  return {
    addSearchTag: bindActionCreators(addSearchTag, dispatch)
  }
}
export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Search)

