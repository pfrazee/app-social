import * as yo from 'yo-yo'
import {getFeedUsers} from '../model/users'

export default function ({loading, error} = {}) {
  var suggestions = getFeedUsers()
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

function userCom (user) {
  var url = user.url
  if (!url.startsWith('dat://')) {
    url = `dat://${url}`
  }
  return yo`<div>
    <a href=${url}>${user.name || user.profile.name}</a>
  </div>`
}