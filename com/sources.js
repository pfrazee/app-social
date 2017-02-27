const yo = require('yo-yo')
const LightElement = require('../lib/light-element.js')

window.customElements.define('hw-sources', class extends LightElement {
  render() {
    return yo`
      <div class="sources">
        todo sources
      </div>
    `
  }
})