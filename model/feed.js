import {getLocalUser, getFeedUsers} from './users'
import {render} from '../lib/bus'

// globals
// =

var posts = []

// exported api
// =

// read and merge all of the post entries of users in the feed
export async function load () {
  // get all users and their entries
  var users = getFeedUsers()
  if (!users.length) return

  // merge the entries
  posts = users.map(u => u.posts)
  posts = posts[0].concat(...posts.slice(1))
  posts.sort((a, b) => {
    // sort by creation time
    // sometimes creatime time is missing, so fallback to modified time
    // TODO add receive time
    var atime = a.ctime || a.mtime
    var btime = b.ctime || b.mtime
    return btime - atime
  })
}

export function getPosts({start, end} = {}) {
  start = start || 0
  end = end || 20
  var postsSlice = posts.slice(start, end)
  ensurePostsAreLoaded(postsSlice)
  return postsSlice
}

export async function publish(body) {
  var localUser = getLocalUser() 
  body = body.trim()
  if (!body || !localUser) return

  // write the file
  var path = `/social/posts/${Date.now()}.json`
  await localUser.writeFile(path, JSON.stringify({body}, null, 2), 'utf8')

  // read back
  var post = await localUser.stat(path)
  post.id = `${localUser.url}-${post.name}`
  post.author = localUser
  posts.unshift(post)
  render('feed')
  loadPost(post)
}

// internal api
// =

function ensurePostsAreLoaded (postsSlice) {
  postsSlice.forEach(post => {
    if (!post.data) {
      loadPost(post)
    }
  })
}

async function loadPost (post) {
  try {
    // read file
    var json = await post.author.readFile(post.name)
    post.data = JSON.parse(json)
    // render
    render('post', post.id, post)
  } catch (e) {
    // render error
    console.error('Error while loading post', e)
    render('post', post.id, {error: e})
  }
}