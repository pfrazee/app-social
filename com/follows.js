import * as yo from 'yo-yo'
import {getLocalUser, addFollow, removeFollow, getFeedUsers} from '../model/users'

export default function ({loading, error} = {}) {
  var user = getLocalUser()
  if (!user) return defaultFollows()
  return yo`
    <div id="follows" class="follows card">
      <div class="follows__list">
        <div><strong>Following</strong></div>
        ${user.profile.follows.map(u => userCom(u, true))}
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

function defaultFollows () {
  return yo`
    <div id="follows" class="follows card">
      <div class="follows__list">
        <div>Some users you might want to follow:</div>
        ${getFeedUsers().map(u => userCom(u))}
        <br>
      </div>
    </div>
  `
}

function userCom (user, canDelete) {
  var url = user.url
  if (!url.startsWith('dat://')) {
    url = `dat://${url}`
  }
  return yo`<div>
    <a href=${url}>${user.name || user.profile.name}</a>
    ${canDelete ? yo`<button onclick=${() => removeFollow(user.url)}>Remove</button>` : ''}
  </div>`
}

function onClickAdd (e) {
  var input = document.getElementById('follows__adder-url')
  addFollow(input.value)
}