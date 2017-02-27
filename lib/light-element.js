const yo = require('yo-yo')

module.exports = class LightElement extends HTMLElement {
  constructor() {
    super()
    this.baseEl = null

    // props is a proxy to the Element attribute methods
    // ...with JSON serialization for object types
    this.props = new Proxy({}, {
      has: (target, name) => this.hasAttribute(name),
      get: (target, name) => {
        try {
          return JSON.parse(this.getAttribute(name))
        } catch (e) {
          return undefined
        }
      },
      set: (target, name, value) => {
        this.setAttribute(name, JSON.stringify(value))
        return true
      }
    })

    // state is an internal object that causes renders on changes
    this.state = {}
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // when a watched attribute changes, render
    this.updateDOM()
  }

  connectedCallback() {
    // in case the subclass doesnt override, default to rendering
    this.updateDOM()
  }

  updateDOM() {
    if (!this.baseEl) {
      this.baseEl = yo`<div></div>`
      this.appendChild(this.baseEl)
    }
    yo.update(this.baseEl, this.render())
  }

  // subclass apis
  // =

  setState(obj) {
    this.state = obj
    this.updateDOM()
  }

  // should be overriden by subclasses
  // =

  render() {
    return yo`<div></div>`
  }
}