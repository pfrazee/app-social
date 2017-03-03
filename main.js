{
  async function setup () {
    bus.setView('main')
    await model.users.load()
    await model.feed.load()
    bus.render('view')
  }
  setup()
}