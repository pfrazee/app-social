window.DEFAULT_FOLLOWS = [
  'dat://bb04d9a09b473d2e223b1d8444a01bab02af5667c009f0f67b75ca1f34973a7c',
  'dat://2cc9baca0e176bb8a3cfa3ab2e5b47f5d6ac8449e5a1fec783126d224127a100'
]

// event bus module
// - use register() to setup new views
// - use setView() to set the current view
// - use render() to trigger render events inside the current view
//   - use render('view') to render the entire view
//   - all other render-events are custom to the view

{
  // state
  // =

  let currentView // currently active view
  let registeredViews = {}

  // exported api
  // =

  window.bus = {
    setView (view) {
      currentView = registeredViews[view]
      if (!currentView) throw new Error(`Invalid view "${view}"`)
      currentView.update()
    },

    register (name, update, events) {
      registeredViews[name] = {update, events}
    },

    render (event, ...args) {
      if (event === 'view') {
        currentView.update()
      } else {
        var handler = currentView.events[event]
        if (!handler) throw new Error(`Invalid event "${event}"`)
        handler(...args)
      }
    }
  }

  window.byId = document.getElementById.bind(document)

  window.updateNode = (targetId, newHTML) => {
    // find the target
    var targetEl = byId(targetId)
    if (!targetEl) throw new Error(`Element #${targetId} not found`)

    // build the new element
    var frag = document.createElement('div')
    frag.innerHTML = newHTML
    var newEl = frag.firstElementChild
    if (!newEl) throw new Error(`Given HTML did not produce a valid DOM node`)

    // replace the target element with the new el
    targetEl.parentNode.replaceChild(newEl, targetEl)
  }

  window.timeSince = (date) => {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
}