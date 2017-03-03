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
      <div class="feed-item__header">
        <img class="feed-item__favicon" src="${post.author.url}/favicon.png" />
        <a href="#" class="feed-item__author">${post.author.title}</a>
        <a href="#" class="feed-item__time">${timeSince(post.ctime || post.mtime)}</a>          
      </div>
      <div class="feed-item__content">
        ${post.data && post.data.body ? post.data.body : 'Loading...'}
      </div>
    </div>
  `
}

// follows
// =

{
  const {getSelfSite, addFollow, removeFollow} = window.model.sites

  window.com.follows = ({loading, error} = {}) => {
    var site = getSelfSite()
    if (!site) return ''
    return `
      <div id="follows" class="follows card">
        <div class="follows__list">
          <div><strong>Following</strong></div>
          ${site.follows.map(u => userCom(u, true))}
          ${loading ? `<div>Loading...</div>` : ''}
          ${error ? `<div class="error">${error.toString()}</div>` : ''}
        </div>
        ${site.isOwner ? `
          <div class="follows__adder">
            <input id="follows__adder-url" placeholder="URL of new site">
            <button onclick=${onClickAdd}>Add</button>
          </div>
        ` : ''}
      </div>
    `
  }

  function userCom (site, canDelete) {
    var url = site.url
    if (!url.startsWith('dat://')) {
      url = `dat://${url}`
    }
    return `<div>
      <a href=${url}>${site.givenTitle || site.title}</a>
      ${canDelete ? `<button onclick=${() => removeFollow(site.url)}>Remove</button>` : ''}
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
  const {getSelfSite} = window.model.sites

  window.com.profile = () => {
    const site = getSelfSite()
    if (!site) return ''
    return `
      <div class="profile">
        <div class="card">
          <h3 class="profile__name">
            <a href="${site.url}">
              <img class="profile__favicon" src=${site.url + '/favicon.png'} />
              ${site.title}
            </a>
          </h3>
          <div class="profile__bio">${site.description}</div>
          ${site.isTemplate ? `
            <div class="profile__fork">
              <hr>
              <div>
                <button>Fork this site</button> to create a profile.                
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }
}

// publisher
// =

{
  const {publish} = window.model.feed
  const {getSelfSite} = window.model.sites

  window.com.publisher = () => {
    if (!getSelfSite()/*TODO*/) return ''
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
