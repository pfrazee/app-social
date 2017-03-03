window.model = window.model || {}
{
  const {render} = window.bus
  const {DEFAULT_FOLLOWS} = window

  // state
  // =

  var localUser = null
  var feedUsers = []

  // exported api
  // =

  window.model.users = {
    getLocalUser () { return localUser },
    getFeedUsers () { return feedUsers },

    getLocalUserUrl () {
      return localStorage.localUserUrl || false
    },

    async load () {
      var url = model.users.getLocalUserUrl()
      if (!url) return loadDefaults()

      // load the local user
      localUser = await loadUser(url)
      localUser.isLocalUser = true

      // load the local user's follows
      var followedUsers = []
      try {
        for (var i=0; i < localUser.profile.follows.length; i++) {
          try {
            // load the user and attach info from the local user
            let follow = localUser.profile.follows[i]
            let user = await loadUser(follow.url)
            user.givenName = follow.name
            followedUsers.push(user)
          } catch (e) {
            console.error('Failed to fetch a followed user', e)
          }
        }
      } catch (e) {
        console.error('Failed to fetch all followed users', e)
      }
      feedUsers = [localUser].concat(followedUsers)
      return true
    },

    async addFollow (url) {
      if (!localUser) return

      // make sure it doesn't already exist
      if (localUser.profile.follows.find(f => f.url === url)) {
        return
      }

      try {
        render('follows', {loading: true})

        // lookup user
        var user = await loadUser(url)

        // add
        localUser.profile.follows.push({
          name: user.profile.name,
          url
        })
        await saveUserProfile(localUser)
        render('follows')
      } catch (e) {
        console.error(e)
        render('follows', {error: e})
        console.log('did it')
      }
    },

    async removeFollow (url) {
      if (!localUser) return
      var i = localUser.profile.follows.findIndex(f => f.url === url)
      localUser.profile.follows.splice(i, 1)
      await saveUserProfile(localUser)
      render('follows')
    }
  }

  // internal methods
  // =

  async function loadDefaults () {
    console.log(DEFAULT_FOLLOWS)
    feedUsers = await Promise.all(DEFAULT_FOLLOWS.map(url => {
      return loadUser(url).catch(err => { console.log(err); return null })
    }))
    feedUsers = feedUsers.filter(Boolean)
    console.log(feedUsers)
  }

  async function loadUser (url) {
    // read info
    var user = new DatArchive(url)
    var profileJsonRead = user.readFile('/social/profile.json', {
      encoding: 'utf8',
      timeout: 10e3
    })
    var [profileJson, postEntries, avatar] = await Promise.all([
      profileJsonRead.catch(err => false), // suppress a failed read
      user.listFiles('/social/posts'),
      user.stat('/social/avatar.png').catch(() => false)
    ])

    // parse profile
    if (profileJson) {
      try {
        profileJson = JSON.parse(profileJson)
      } catch (e) {
        console.error('Failed to read profile.json for', url, e)
        profileJson = false
      }
    }

    // turn postEntries into an array with a ref back to the user
    postEntries = map(postEntries, entry => {
      entry.id = `${user.url}-${entry.name}`
      entry.author = user
      return entry
    })

    // attach to user object
    user.aviUrl = (!!avatar) ? `${user.url}/social/avatar.png` : '/default_avi.png'
    user.profile = profileJson
    user.posts = postEntries.filter(entry => entry.name.endsWith('.json'))
    user.isLocalUser = false
    return user
  }

  async function saveUserProfile (user) {
    await user.writeFile('/social/profile.json', JSON.stringify(user.profile, null, 2), 'utf8')
  }

  function map (obj, fn) {
    return Object.keys(obj).map(key => fn(obj[key], key))
  }
}