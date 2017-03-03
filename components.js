window.com = {}

// feed
// =

{
  const {getPosts} = window.model.feed

  window.com.feed = () => `
    <div id="feed" class="feed card">
      ${com.publisher()}
      ${getPosts().map(post => {
        return feedItem(post)
      }).join('')}
    </div>
  `

  const feedItem =
  window.com.feedItem = (post) => `
    <div class="feed-item" id=${post.id}>
      <div class="feed-item__layout-side">
        <img class="feed-item__avi" src=${post.author.aviUrl} />
      </div>
      <div class="feed-item__layout-main">
        <div class="feed-item__header">
          <a href="#" class="feed-item__author">${post.author.profile.name}</a>
          <a href="#" class="feed-item__time">${timeSince(post.ctime || post.mtime)}</a>          
        </div>
        <div class="feed-item__content">
          ${post.data && post.data.body ? post.data.body : 'Loading...'}
        </div>
      </div>
    </div>
  `
}

// follows
// =

{
  const {getLocalUser, addFollow, removeFollow} = window.model.users

  window.com.follows = ({loading, error} = {}) => {
    var user = getLocalUser()
    if (!user) return ''
    return `
      <div id="follows" class="follows card">
        <div class="follows__list">
          <div><strong>Following</strong></div>
          ${user.profile.follows.map(u => userCom(u, true))}
          ${loading ? `<div>Loading...</div>` : ''}
          ${error ? `<div class="error">${error.toString()}</div>` : ''}
        </div>
        <div class="follows__adder">
          <input id="follows__adder-url" placeholder="URL of new user">
          <button onclick=${onClickAdd}>Add</button>
        </div>
      </div>
    `
  }

  function userCom (user, canDelete) {
    var url = user.url
    if (!url.startsWith('dat://')) {
      url = `dat://${url}`
    }
    return `<div>
      <a href=${url}>${user.name || user.profile.name}</a>
      ${canDelete ? `<button onclick=${() => removeFollow(user.url)}>Remove</button>` : ''}
    </div>`
  }

  function onClickAdd (e) {
    var input = document.getElementById('follows__adder-url')
    addFollow(input.value)
  }
}

// profile
// =

{
  const {getLocalUser} = window.model.users

  window.com.profile = () => {
    const user = getLocalUser()
    if (!user || !user.profile) {
      return `
        <div class="profile">
          <div class="card">
            <h3 class="profile__name">Welcome to app-social</h3>
            <div class="profile__bio">
              A simple p2p alternative to Twitter.<br>
              <br>
              <button>Fork this site</button> to get started
            </div>
          </div>
        </div>
      `
    }
    return `
      <div class="profile">
        <div class="card">
          <img class="profile__avi" src=${user.aviUrl} />
          <h3 class="profile__name"><a href="${user.url}">${user.profile.name}</a></h3>
          <div class="profile__bio">${user.profile.bio}</div>
          <div class="profile__stats">Following: ${user.profile.follows.length}</h3>
        </div>
      </div>
    `
  }
}

// publisher
// =

{
  const {publish} = window.model.feed
  const {getLocalUser} = window.model.users

  window.com.publisher = () => {
    if (!getLocalUser()) return ''
    return `
      <div class="publisher">
        <div class="publisher__input">
          <textarea placeholder="What's happenin?"></textarea>
        </div>
        <div class="publisher__controls">
          <button onclick=${onPublish}>Publish</button>
        </div>
      </div>
    `
  }

  function onPublish () {
    var textarea = document.querySelector('.publisher__input textarea')
    publish(textarea.value)
  }
}

// suggested follows
// =

{
  const {getFeedUsers} = window.model.users

  window.com.suggestedFollows = ({loading, error} = {}) => {
    var suggestions = getFeedUsers()
    return `
      <div id="follows" class="follows card">
        <div class="follows__list">
          <div>Some users you might want to follow:</div>
          ${getFeedUsers().map(u => userCom(u)).join('')}
        </div>
      </div>
    `
  }

  function userCom (user) {
    var url = user.url
    if (!url.startsWith('dat://')) {
      url = `dat://${url}`
    }
    return `<div>
      <a href=${url}>${user.name || user.profile.name}</a>
    </div>`
  }
}