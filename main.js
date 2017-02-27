import './views/main'
import {render, setView} from './lib/bus'
import {load as loadUsers} from './model/users'
import {load as loadFeed} from './model/feed'

async function setup () {
  setView('main')
  await loadUsers()
  await loadFeed()
  render('view')
}
setup()