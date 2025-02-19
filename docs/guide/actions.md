# Actions

Actions are similar to mutations, the differences being that:

- Instead of mutating the state, actions commit mutations.
- Actions can contain arbitrary asynchronous operations.

Let's register a simple action:

``` ts
export interface State {
    count: number
}

export const store: Store<State> = createStore({
    state: (): State => ({
        count: 0
    }),
    mutations: {
        INCREMENT(state: State) {
            state.count++;
        }
    },
    actions: {
        async increment(context) {
            context.commit('INCREMENT');
        }
    }
});
```

Action handlers receive a context object which exposes the same set of methods/properties on the store instance, so you can call `context.commit` to commit a mutation, or access the state and getters via `context.state` and `context.getters`. We can even call other actions with `context.dispatch`. We will see why this context object is not the store instance itself when we introduce [Modules](modules.md) later.

> In practice, we often use ES2015 [argument destructuring](https://github.com/lukehoban/es6features#destructuring) to simplify the code a bit (especially when we need to call `commit` multiple times):

``` ts
actions: {
    async increment({commit}: { commit: Commit }) {
        commit('INCREMENT');
    }
}
```

## Dispatching Actions

Actions are triggered with the `store.dispatch` method:

``` ts
store.dispatch('increment')
```

This may look silly at first sight: if we want to increment the count, why don't we just call `store.commit('increment')` directly? Remember that **mutations have to be synchronous**. Actions don't. We can perform **asynchronous** operations inside an action:

``` ts
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```

Actions support the same payload format and object-style dispatch:

``` ts
// dispatch with a payload
store.dispatch('incrementAsync', {
  amount: 10
})

// dispatch with an object
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

A more practical example of real-world actions would be an action to checkout a shopping cart, which involves **calling an async API** and **committing multiple mutations**:

``` ts
actions: {
  checkout ({ commit, state }, products) {
    // save the items currently in the cart
    const savedCartItems = [...state.cart.added]
    // send out checkout request, and optimistically
    // clear the cart
    commit(types.CHECKOUT_REQUEST)
    // the shop API accepts a success callback and a failure callback
    shop.buyProducts(
      products,
      // handle success
      () => commit(types.CHECKOUT_SUCCESS),
      // handle failure
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```

Note we are performing a flow of asynchronous operations, and recording the side effects (state mutations) of the action by committing them.

## Dispatching Actions in Components

You can dispatch actions in components with `store.dispatch('xxx')`, or use the `mapActions` helper which maps component methods to `store.dispatch` calls (requires root `store` injection as done in [example](../index.md)):

``` ts
import {mapActions, mapState} from "@visitsb/vuex";

const {increment, incrementBy} = mapActions([
        'increment', // map `increment()` to `store.commit('increment')`

        // `mapMutations` also supports payloads:
        'incrementBy' // map `incrementBy(amount)` to `store.commit('incrementBy', amount)`
    ]);

const {add} = mapActions({
        add: 'increment' // map `this.add()` to `this.$store.dispatch('increment')`
    });
```

## Composing Actions

Actions are often asynchronous, so how do we know when an action is done? And more importantly, how can we compose multiple actions together to handle more complex async flows?

The first thing to know is that `store.dispatch` can handle Promise returned by the triggered action handler and it also returns Promise:

``` ts
actions: {
  actionA ({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```

Now you can do:

``` ts
store.dispatch('actionA').then(() => {
  // ...
})
```

And also in another action:

``` ts
actions: {
  // ...
  actionB ({ dispatch, commit }) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```

Finally, if we make use of [async / await](https://tc39.github.io/ecmascript-asyncawait/), we can compose our actions like this:

``` ts
// assuming `getData()` and `getOtherData()` return Promises

actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // wait for `actionA` to finish
    commit('gotOtherData', await getOtherData())
  }
}
```

> It's possible for a `store.dispatch` to trigger multiple action handlers in different modules. In such a case the returned value will be a Promise that resolves when all triggered handlers have been resolved.

[Back](index.md)