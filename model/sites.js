window.model = window.model || {}
{
  const {render} = window.bus
  const {DEFAULT_FOLLOWS} = window

  // state
  // =

  var selfSite = null
  var feedSites = []

  // exported api
  // =

  window.model.sites = {
    getSelfSite () { return selfSite },
    getFeedSites () { return feedSites },

    getSelfURL () {
      return window.location.origin
    },

    async load () {
      // load self
      selfSite = await loadSite(model.sites.getSelfURL())
      selfSite.isSelf = true
      document.title = selfSite.title

      // debugging tool
      if (localStorage.debugMode === 'loggedin') {
        selfSite.isOwner = true
        selfSite.isFork = true
        selfSite.isTemplate = false
      } else if (localStorage.debugMode === 'loggedout') {
        selfSite.isOwner = false
        selfSite.isTemplate = false
      } else if (localStorage.debugMode === 'template') {
        selfSite.isFork = false
        selfSite.isTemplate = true
      }

      // load self's follows
      var followedSites = []
      try {
        for (var i=0; i < selfSite.follows.length; i++) {
          try {
            // load the site and attach info
            let follow = selfSite.follows[i]
            let site = await loadSite(follow.url)
            site.givenTitle = follow.title
            followedSites.push(site)
          } catch (e) {
            console.error('Failed to fetch a followed site', follow, e)
          }
        }
      } catch (e) {
        console.error('Failed to fetch all followed sites', e)
      }
      feedSites = [selfSite].concat(followedSites)
      return true
    },

    async addFollow (url) {
      if (!selfSite) return

      // make sure it doesn't already exist
      if (selfSite.follows.find(f => f.url === url)) {
        return
      }

      try {
        render('follows', {loading: true})

        // lookup site
        var site = await loadSite(url)

        // add
        selfSite.follows.push({
          title: site.title,
          url
        })
        await saveMicroBlogSettings(selfSite)
        render('follows')
      } catch (e) {
        console.error(e)
        render('follows', {error: e})
      }
    },

    async removeFollow (url) {
      if (!selfSite) return
      var i = selfSite.follows.findIndex(f => f.url === url)
      selfSite.follows.splice(i, 1)
      await saveMicroBlogSettings(selfSite)
      render('follows')
    }
  }

  // internal methods
  // =

  async function loadSite (url) {
    // read info
    var site = new DatArchive(url)
    var [info, microBlogJson, postEntries] = await Promise.all([
      site.getInfo(),
      loadJson(site, '/microblog.json'),
      site.listFiles('/microblog')
    ])

    // turn postEntries into an array with a ref back to the site
    postEntries = map(postEntries, entry => {
      entry.id = `${site.url}-${entry.name}`
      entry.author = site
      return entry
    })

    // attach to site object
    site.isOwner = info.isOwner
    site.isFork = !!info.forkOf[0]
    site.isTemplate = (!site.isOwner && !site.isFork)
    site.title = info.title
    site.description = info.description
    site.follows = microBlogJson.follows || []
    site.posts = postEntries.filter(entry => entry.name.endsWith('.json'))
    return site
  }

  async function loadJson (site, path) {
    try {
      var json = await site.readFile(path, { encoding: 'utf8', timeout: 10e3 })
      return JSON.parse(json)
    } catch (e) {
      console.log('Failed to load', site.url, path, e)
      return {}
    }
  }

  async function saveMicroBlogSettings (site) {
    var settings = { follows: site.follows }
    await site.writeFile('/microblog.json', JSON.stringify(settings, null, 2), 'utf8')
  }

  function map (obj, fn) {
    return Object.keys(obj).map(key => fn(obj[key], key))
  }
}