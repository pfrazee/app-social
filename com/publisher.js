import * as yo from 'yo-yo'

export default function () {
  return yo`
    <div class="publisher">
      <div class="publisher__input">
        <textarea placeholder="What's happenin?"></textarea>
      </div>
      <div class="publisher__controls">
        <button>Publish</button>
      </div>
    </div>
  `
}