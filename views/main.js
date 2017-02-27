import * as yo from 'yo-yo'
import {register} from '../lib/bus'
import {feed, feedItem} from '../com/feed'
import profile from '../com/profile'
import follows from '../com/follows'
import feedModel from '../model/feed'

const byId = document.getElementById.bind(document)

register('main', update, {
  feed: () => {
    yo.update(byId('feed'), feed())
  },
  post: (id, data) => {
    yo.update(byId(id), feedItem(data))
  },
  follows: (opts) => {
    yo.update(byId('follows'), follows(opts))
  }
})

function update () {
  yo.update(document.querySelector('#main-layout'), yo`
    <div id="main-layout" class="layout">
      <div class="layout--side">
        ${profile()}
      </div>
      <div class="layout--main">
        ${feed()}
      </div>
      <div class="layout--side">
        ${follows()}
      </div>
    </div>
  `)
}