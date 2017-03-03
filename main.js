{
  async function setup () {
    bus.setView('main')
    await model.sites.load()
    await model.feed.load()
    bus.render('view')
  }
  setup()
}