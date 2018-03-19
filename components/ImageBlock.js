export default ({ name, profile, imgSrc, like, comment, onclick, likeclick, isliked, mediatype }) => {
  if (mediatype === 'image') {
  return (
    
    <div className="column is-3 image-block">
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <p className="level-item"><a className="icon is-medium"><img className="image is-rounded" src={profile} /></a></p>
            <p className="level-item"><a>{name}</a></p>
          </div>
        </div>
      </nav>
      <img className="search-img" src={imgSrc}  onClick={onclick} />
      <nav className="level image-block-stat">
        <div className="level-left">
          <div className="level-item">
            <p className="level-item">
              <a onClick={likeclick}><i className={`fa fa-heart${(isliked ? '' : '-o')}`} aria-hidden="true"></i><span>{like}</span></a>
            </p>
          </div>
        </div>
        <div className="level-right">
          <p className="level-item">
            <a><i className="fa fa-comments" aria-hidden="true"></i>  <span>{comment}</span></a>
          </p>
        </div>
      </nav>
    </div>
  )
  } else {
    return (
    
    <div className="column is-3 image-block">
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <p className="level-item"><a className="icon is-medium"><img className="image is-rounded" src={profile} /></a></p>
            <p className="level-item"><a>{name}</a></p>
          </div>
        </div>
        <div className="level-right">
          <i className="fa fa-video-camera" aria-hidden="true"></i>
        </div>
      </nav>
      <img className="search-img" src={imgSrc}  onClick={onclick} />
      <nav className="level image-block-stat">
        <div className="level-left">
          <div className="level-item">
            <p className="level-item">
              <a onClick={likeclick}><i className={`fa fa-heart${(isliked ? '' : '-o')}`} aria-hidden="true"></i><span>{like}</span></a>
            </p>
          </div>
        </div>
        <div className="level-right">
          <p className="level-item">
            <a><i className="fa fa-comments" aria-hidden="true"></i>  <span>{comment}</span></a>
          </p>
        </div>
      </nav>
    </div>
  )
  }
}
