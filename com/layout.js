const yo = require('yo-yo')
const LightElement = require('../lib/light-element.js')

window.customElements.define('hw-layout', class extends LightElement {
  render() {
    return yo`
      <div class="layout">
        <div class="layout--main">
          <hw-publisher></hw-publisher>
          <hw-feed></hw-feed>
        </div>
        <div class="layout--side">
          <hw-sources></hw-sources>
        </div>
      </div>
    `
  }
})