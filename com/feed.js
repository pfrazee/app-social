import * as yo from 'yo-yo'
import publisher from './publisher'
import date from './date'
import {getPosts} from '../model/feed'

export function feed () {
  return yo`
    <div id="feed" class="feed card">
      ${publisher()}
      ${getPosts().map(post => {
        return feedItem(post)
      })}
    </div>
  `
}

export function feedItem (post) {
  return yo`
    <div class="feed-item" id=${post.id}>
      <div class="feed-item__layout-side">
        <img class="feed-item__avi" src=${post.author.aviUrl} />
      </div>
      <div class="feed-item__layout-main">
        <div class="feed-item__header">
          <a href="#" class="feed-item__author">${post.author.profile.name}</a>
          <a href="#" class="feed-item__time">${date(post.ctime || post.mtime)}</a>          
        </div>
        <div class="feed-item__content">
          ${post.data && post.data.body ? post.data.body : 'Loading...'}
        </div>
      </div>
    </div>
  `
}