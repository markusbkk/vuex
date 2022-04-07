# Plugins

Vuex stores accept the `plugins` option that exposes hooks for each mutation. A Vuex plugin is simply a function that receives the store as the only argument:

```ts
const myPlugin = (store) => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
  })
}
```

And can be used like this:

```ts
const store = createStore({
  // ...
  plugins: [myPlugin]
})
```

## Committing Mutations Inside Plugins

Plugins are not allowed to directly mutate state - similar to your components, they can only trigger changes by committing mutations.

By committing mutations, a plugin can be used to sync a data source to the store. For example, to sync a websocket data source to the store (this is just a contrived example, in reality the `createWebSocketPlugin` function can take some additional options for more complex tasks):

```ts
export default function createWebSocketPlugin (socket) {
  return (store) => {
    socket.on('data', data => {
      store.commit('receiveData', data)
    })
    store.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}
```

```ts
const plugin = createWebSocketPlugin(socket)

const store = createStore({
  state,
  mutations,
  plugins: [plugin]
})
```

## Taking State Snapshots

Sometimes a plugin may want to receive "snapshots" of the state, and also compare the post-mutation state with pre-mutation state. To achieve that, you will need to perform a deep-copy on the state object:

```ts
const myPluginWithSnapshot = (store) => {
  let prevState = _.cloneDeep(store.state)
  store.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // compare `prevState` and `nextState`...

    // save state for next mutation
    prevState = nextState
  })
}
```

## Built-in Logger Plugin

Vuex comes with a logger plugin for common debugging usage:

```ts
import {createLogger, createStore} from "@visitsb/vuex";

const store = createStore({
  plugins: [createLogger()]
})
```

The `createLogger` function takes a few options:

```ts
const logger = createLogger({
  collapsed: false, // auto-expand logged mutations
  filter (mutation, stateBefore, stateAfter) {
    // returns `true` if a mutation should be logged
    // `mutation` is a `{ type, payload }`
    return mutation.type !== "aBlocklistedMutation"
  },
  actionFilter (action, state) {
    // same as `filter` but for actions
    // `action` is a `{ type, payload }`
    return action.type !== "aBlocklistedAction"
  },
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of `{ type, payload }`
    // we can format it any way we want.
    return mutation.type
  },
  actionTransformer (action) {
    // Same as mutationTransformer but for actions
    return action.type
  },
  logActions: true, // Log Actions
  logMutations: true, // Log mutations
  logger: console, // implementation of the `console` API, default `console`
})
```

> Note the logger plugin takes state snapshots, so use it only during development.
