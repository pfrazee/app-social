const yo = require('yo-yo')
const LightElement = require('../lib/light-element.js')

window.customElements.define('hw-publisher', class extends LightElement {
  render() {
    return yo`
      <div class="publisher">
        todo publisher
      </div>
    `
  }
})