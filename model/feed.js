window.model = window.model || {}
{
  const {getSelfSite, getFeedSites} = window.model.sites
  const {render} = window.bus

  // state
  // =

  var posts = []

  // exported api
  // =

  window.model.feed = {
    // read and merge all of the post entries of sites in the feed
    async load () {
      // get all sites and their entries
      var sites = getFeedSites()
      if (!sites.length) return

      // merge the entries
      posts = sites.map(u => u.posts)
      posts = posts[0].concat(...posts.slice(1))
      posts.sort((a, b) => {
        // sort by creation time
        // sometimes creatime time is missing, so fallback to modified time
        // TODO add receive time
        var atime = a.ctime || a.mtime
        var btime = b.ctime || b.mtime
        return btime - atime
      })
    },

    getPosts({start, end} = {}) {
      start = start || 0
      end = end || 20
      var postsSlice = posts.slice(start, end)
      ensurePostsAreLoaded(postsSlice)
      return postsSlice
    },

    async publish(text) {
      var selfSite = getSelfSite() 
      text = text.trim()
      if (!text || !selfSite) return

      // write the file
      var path = `/microblog/${Date.now()}.txt`
      try {
        await selfSite.createDirectory('/microblog')
      } catch (e) {
        // ignore, just needed to make sure the folder exists
      }
      await selfSite.writeFile(path, text, 'utf8')

      // read back
      var post = await selfSite.stat(path)
      post.id = `${selfSite.url}-${post.name}`
      post.author = selfSite
      post.text = text
      posts.unshift(post)
      render('feed')
    }
  }

  // internal api
  // =

  function ensurePostsAreLoaded (postsSlice) {
    postsSlice.forEach(post => {
      if (!post.text) {
        loadPost(post)
      }
    })
  }

  async function loadPost (post) {
    try {
      // read file
      post.text = await post.author.readFile(post.name, 'utf8')
      // render
      render('post', post.id, post)
    } catch (e) {
      // render error
      console.error('Error while loading post', e)
      render('post', post.id, {error: e})
    }
  }
}