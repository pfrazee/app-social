window.com = {}

// feed
// =

{
  const {render} = window.bus
  const {getPosts, getNumPosts} = window.model.feed

  var currentMax = 20

  window.com.feed = () => `
    <div id="feed" class="feed card">
      ${com.publisher()}
      ${getPosts({ end: currentMax }).map(post => {
        return feedItem(post)
      }).join('')}
      ${currentMax < getNumPosts() ? `
        <div class="feed-item">
          <div class="feed-item__content"><a href="#" onclick="onClickLoadMore(event)">Load more</a></div>
        </div>` : ''}
    </div>
  `

  window.onClickLoadMore = (e) => {
    e.preventDefault()
    currentMax += 20
    render('feed')
  }

  const feedItem =
  window.com.feedItem = (post) => `
    <div class="feed-item" id=${makeSafe(post.url)}>
      <div class="feed-item__header">
        <img class="feed-item__favicon" src="${makeSafe(post.author.url)}/favicon.png" />
        <a href="${makeSafe(post.author.url)}" class="feed-item__author">${makeSafe(post.author.title)}</a>
        <a href="${makeSafe(post.url)}" class="feed-item__time">${makeSafe(timeSince(post.ctime || post.mtime))} ago</a>          
      </div>
      <div class="feed-item__content">${makeSafe(typeof post.text === 'string' ? post.text : 'Loading...')}</div>
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
          ${error ? `<div class="error">${makeSafe(error.toString())}</div>` : ''}
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
      <a href="${makeSafe(url)}">${makeSafe(site.givenTitle || site.title)}</a>
      ${canDelete ? `<button onclick="onClickRemoveFollow('${makeSafe(site.url)}')">Remove</button>` : ''}
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
            <a href="${makeSafe(site.url)}">
              <img class="profile__favicon" src=${makeSafe(site.url) + '/favicon.png'} />
              ${makeSafe(site.title)}
            </a>
          </h3>
          <div class="profile__bio">${makeSafe(site.description)}</div>
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
