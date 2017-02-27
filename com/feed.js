const yo = require('yo-yo')
const LightElement = require('../lib/light-element.js')

window.customElements.define('hw-feed', class extends LightElement {
  render() {
    return yo`
      <div class="feed">
        todo feed
      </div>
    `
  }
})