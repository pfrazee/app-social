// core event bus

// globals
// =

var currentView // currently active view
var registeredViews = {}

// exported api
// =

export function setView (view) {
  currentView = registeredViews[view]
  if (!currentView) throw new Error(`Invalid view "${view}"`)
  currentView.update()
}

export function register (name, update, events) {
  registeredViews[name] = {update, events}
}

export function render (event, ...args) {
  if (event === 'view') {
    currentView.update()
  } else {
    var handler = currentView.events[event]
    if (!handler) throw new Error(`Invalid event "${event}"`)
    handler(...args)
  }
}