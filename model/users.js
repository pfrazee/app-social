import filter from 'lodash.filter'
import map from 'lodash.map'

// globals
// =

var localUser = null
var feedUsers = []

// exported api
// =

export function getLocalUser () { return localUser }
export function getFeedUsers () { return feedUsers }

export function getLocalUserUrl () {
  return localStorage.localUserUrl || false
}

export async function load () {
  var url = getLocalUserUrl()
  if (!url) return false

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
}

// internal methods
// =

async function loadUser (url) {
  // read info
  var user = new DatArchive(url)
  var profileJsonRead = user.readFile('/social/profile.json', {
    encoding: 'utf8',
    timeout: 10e3
  })
  var [profileJson, postEntries] = await Promise.all([
    profileJsonRead.catch(err => false), // suppress a failed read
    user.listFiles('/social/posts')
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
  user.profile = profileJson
  user.posts = filter(postEntries, entry => entry.name.endsWith('.json'))
  user.isLocalUser = false
  return user
}
