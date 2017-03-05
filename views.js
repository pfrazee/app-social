window.views = {}
{
  const {updateNode} = window
  const {register} = window.bus

  register('main', updateAll, {
    feed: () => {
      updateNode('feed', com.feed())
    },
    post: (id, data) => {
      updateNode(id, com.feedItem(data))
    },
    follows: (opts) => {
      updateNode('follows', com.follows(opts))
    }
  })

  function updateAll () {
    updateNode('main-layout', `
      <div id="main-layout" class="layout">
        <div class="layout--side">
          ${com.profile()}
        </div>
        <div class="layout--main">
          ${com.feed()}
        </div>
        <div class="layout--side">
          ${com.follows()}
          ${com.userTools()}
        </div>
      </div>
    `)
  }
}