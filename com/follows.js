import * as yo from 'yo-yo'
import {getLocalUser, addFollow, removeFollow} from '../model/users'

export default function ({loading, error} = {}) {
  var user = getLocalUser()
  if (!user) return yo`<div></div>`
  return yo`
    <div id="follows" class="follows card">
      <div class="follows__list">
        <div><strong>Following</strong></div>
        ${user.profile.follows.map(u => userCom(u))}
        ${loading ? yo`<div>Loading...</div>` : ''}
        ${error ? yo`<div class="error">${error.toString()}</div>` : ''}
      </div>
      <div class="follows__adder">
        <input id="follows__adder-url" placeholder="URL of new user">
        <button onclick=${onClickAdd}>Add</button>
      </div>
    </div>
  `
}

function userCom (user) {
  var url = user.url
  if (!url.startsWith('dat://')) {
    url = `dat://${url}`
  }
  return yo`<div>
    <a href=${url}>${user.name}</a>
    <button onclick=${() => removeFollow(user.url)}>Remove</button>
  </div>`
}

function onClickAdd (e) {
  var input = document.getElementById('follows__adder-url')
  addFollow(input.value)
}