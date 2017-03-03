window.views = {}
{
  const {updateNode} = window
  const {register} = window.bus
  const {feed, feedItem, profile, follows, suggestedFollows} = window.com

  register('main', updateAll, {
    feed: () => {
      updateNode('feed', feed())
    },
    post: (id, data) => {
      updateNode(id, feedItem(data))
    },
    follows: (opts) => {
      updateNode('follows', follows(opts))
    }
  })

  function updateAll () {
    updateNode('main-layout', `
      <div id="main-layout" class="layout">
        <div class="layout--side">
          ${profile()}
        </div>
        <div class="layout--main">
          ${feed()}
        </div>
        <div class="layout--side">
          ${follows()}
          ${suggestedFollows()}
        </div>
      </div>
    `)
  }
}