export default ({search, onChange, keyPress}) => {
  return (
    <div className="level-item">
      <p className="control has-icons-left">
        <input type="search" className="input" onChange={onChange} onKeyPress={keyPress} value={search} />
        <span className="icon is-small is-left">
          <i className="fa fa-search"></i>
        </span>
      </p>      
    </div>

  )
}
  
