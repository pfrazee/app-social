import * as yo from 'yo-yo'
import {publish} from '../model/feed'
import {getLocalUser} from '../model/users'

export default function () {
  if (!getLocalUser()) return ''
  return yo`
    <div class="publisher">
      <div class="publisher__input">
        <textarea placeholder="What's happenin?"></textarea>
      </div>
      <div class="publisher__controls">
        <button onclick=${onPublish}>Publish</button>
      </div>
    </div>
  `
}

function onPublish () {
  var textarea = document.querySelector('.publisher__input textarea')
  publish(textarea.value)
}