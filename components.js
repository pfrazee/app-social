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
          ${site.follows.map(u => userCom(u, site.isOwner && !site.isTemplate))}
          ${loading ? `<div>Loading...</div>` : ''}
          ${error ? `<div class="error">${error.toString()}</div>` : ''}
        </div>
        ${site.isOwner ? `
          <div class="follows__adder">
            <input id="follows__adder-url" placeholder="URL of new site">
            <button onclick="onClickAddFollow()">Add</button>
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
      ${canDelete ? `<button onclick="onClickRemoveFollow('${site.url}')">Remove</button>` : ''}
    </div>`
  }

  window.onClickAddFollow = () => {
    var input = document.getElementById('follows__adder-url')
    addFollow(input.value)
  }

  window.onClickRemoveFollow = (url) => {
    removeFollow(url)
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
                <button onclick="onClickFork()">Fork this site</button> to create a profile.
              </div>
            </div>
          ` : site.isSelf ? `
            <div class="profile__fork">
              <hr>
              <div>
                <button onclick="onClickEditProfile()">Edit your profile</button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `
  }

  window.onClickFork = () => {
    DatArchive.fork(window.location.toString(), {
      title: 'Your Name',
      description: 'Your bio'
    }).then(archive => {
      window.location = archive.url
    })
  }

  window.onClickEditProfile = () => {
    getSelfSite().updateManifest().then(() => window.location.reload())
  }
}

// publisher
// =

{
  const {publish} = window.model.feed
  const {getSelfSite} = window.model.sites

  window.com.publisher = () => {
    var selfSite = getSelfSite()
    if (!selfSite || !selfSite.isOwner) return ''
    return `
      <div class="publisher">
        <div class="publisher__input">
          <textarea placeholder="What's happenin?"></textarea>
        </div>
        <div class="publisher__controls">
          <button onclick="onClickPublish()">Publish</button>
        </div>
      </div>
    `
  }

  window.onClickPublish = () => {
    var textarea = document.querySelector('.publisher__input textarea')
    publish(textarea.value)
  }
}

// user tools
// =

{
  const {getSelfSite} = window.model.sites

  window.com.userTools = () => {
    var selfSite = getSelfSite()
    if (!selfSite) return ''
    if (selfSite.isOwner) {
      return `<div class="user-tools">
        <button onclick="setDebugMode('loggedout')">View as visitor</button>
      </div>`
    } else if (!selfSite.isTemplate) {
      return `<div class="user-tools">
        <button onclick="setDebugMode(false)">Return to owner view</button>
      </div>`
    }
    return ''
  }

  window.setDebugMode = (mode) => {
    if (!mode) delete localStorage.debugMode
    else localStorage.debugMode = mode
    window.location.reload()
  }
}
