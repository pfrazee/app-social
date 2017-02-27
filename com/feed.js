import * as yo from 'yo-yo'
import publisher from './publisher'
import date from './date'
import {getPosts} from '../model/feed'

export function feed () {
  return yo`
    <div class="feed card">
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
      <div class="feed-item__header">
        <a href="#" class="feed-item__author">${post.author.profile.name}</a>
        <a href="#" class="feed-item__time">${date(post.ctime || post.mtime)}</a>          
      </div>
      <div class="feed-item__content">
        ${post.data && post.data.body ? post.data.body : 'Loading...'}
      </div>
    </div>
  `
}