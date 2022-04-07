# Modules

Due to using a single state tree, all states of our application are contained inside one big object. However, as our application grows in scale, the store can get really bloated.

To help with that, Vuex allows us to divide our store into **modules**. An example application [structure](structure.md) can be a great starting point. Each module can contain its own state, mutations, actions, getters, and even nested modules - it's fractal all the way down:

```ts
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = createStore({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> `moduleA`'s state
store.state.b // -> `moduleB`'s state
```

## Module Local State

Inside a module's mutations and getters, the first argument received will be **the module's local state**.

```ts
const moduleA = {
  state: () => ({
    count: 0
  }),
  mutations: {
    increment (state) {
      // `state` is the local module state
      state.count++
    }
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}
```

Similarly, inside module actions, `context.state` will expose the local state, and root state will be exposed as `context.rootState`:

```ts
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```

Also, inside module getters, the root state will be exposed as their 3rd argument:

```ts
const moduleA = {
  // ...
  getters: {
    sumWithRootCount (state, getters, rootState) {
      return state.count + rootState.count
    }
  }
}
```

## Namespacing

By default, actions and mutations are still registered under the **global namespace** - this allows multiple modules to react to the same action/mutation type. Getters are also registered in the global namespace by default. However, this currently has no functional purpose (it's as is to avoid breaking changes). You must be careful not to define two getters with the same name in different, non-namespaced modules, resulting in an error.

If you want your modules to be more self-contained or reusable, you can mark it as namespaced with `namespaced: true`. When the module is registered, all of its getters, actions and mutations will be automatically namespaced based on the path the module is registered at. For example:

```ts
const store = createStore({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: () => ({ ... }), // module state is already nested and not affected by namespace option
      getters: {
        isAdmin () { ... } // -> getters['account/isAdmin']
      },
      actions: {
        login () { ... } // -> dispatch('account/login')
      },
      mutations: {
        login () { ... } // -> commit('account/login')
      },

      // nested modules
      modules: {
        // inherits the namespace from parent module
        myPage: {
          state: () => ({ ... }),
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // further nest the namespace
        posts: {
          namespaced: true,

          state: () => ({ ... }),
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```

Namespaced getters and actions will receive localized `getters`, `dispatch` and `commit`. In other words, you can use the module assets without writing prefix in the same module. Toggling between namespaced or not does not affect the code inside the module.

### Accessing Global Assets in Namespaced Modules

If you want to use global state and getters, `rootState` and `rootGetters` are passed as the 3rd and 4th arguments to getter functions, and also exposed as properties on the `context` object passed to action functions.

To dispatch actions or commit mutations in the global namespace, pass `{ root: true }` as the 3rd argument to `dispatch` and `commit`.

```ts
modules: {
  foo: {
    namespaced: true,

    getters: {
      // `getters` is localized to this module's getters
      // you can use rootGetters via 4th argument of getters
      someGetter (state, getters, rootState, rootGetters) {
        getters.someOtherGetter // -> 'foo/someOtherGetter'
        rootGetters.someOtherGetter // -> 'someOtherGetter'
        rootGetters['bar/someOtherGetter'] // -> 'bar/someOtherGetter'
      },
      someOtherGetter: state => { ... }
    },

    actions: {
      // dispatch and commit are also localized for this module
      // they will accept `root` option for the root dispatch/commit
      someAction ({ dispatch, commit, getters, rootGetters }) {
        getters.someGetter // -> 'foo/someGetter'
        rootGetters.someGetter // -> 'someGetter'
        rootGetters['bar/someGetter'] // -> 'bar/someGetter'

        dispatch('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}
```

### Register Global Action in Namespaced Modules

If you want to register global actions in namespaced modules, you can mark it with `root: true` and place the action definition to function `handler`. For example:

```ts
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}
```

### Binding Helpers with Namespace

When binding a namespaced module to components with the `mapState`, `mapGetters`, `mapActions` and `mapMutations` helpers, it can get a bit verbose:

```ts
const {a, b} = mapState({
    a: state => state.some.nested.module.a,
    b: state => state.some.nested.module.b
  });

const {someGetter, someOtherGetter} = mapGetters([
    'some/nested/module/someGetter', // -> store['some/nested/module/someGetter']
    'some/nested/module/someOtherGetter', // -> store['some/nested/module/someOtherGetter']
  ]);

const {foo, bar} = mapActions([
    'some/nested/module/foo', // -> store['some/nested/module/foo']()
    'some/nested/module/bar' // -> store['some/nested/module/bar']()
  ]);
```

In such cases, you can pass the module namespace string as the first argument to the helpers so that all bindings are done using that module as the context. The above can be simplified to:

```ts
const {a, b}= mapState('some/nested/module', {
    a: state => state.a,
    b: state => state.b
  });

const {someGetter, someOtherGetter} = mapGetters('some/nested/module', [
    'someGetter', // -> this.someGetter
    'someOtherGetter', // -> this.someOtherGetter
  ])
},

const {foo, bar} = mapActions('some/nested/module', [
    'foo', // -> this.foo()
    'bar' // -> this.bar()
  ]);
```

Furthermore, you can create namespaced helpers by using `createNamespacedHelpers`. It returns an object having new component binding helpers that are bound with the given namespace value:

```ts
import {createNamespacedHelpers} from "@visitsb/vuex";

const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

// look up in `some/nested/module`
const {a, b} = mapState({
      a: state => state.a,
      b: state => state.b
    });

const {foo, bar} = mapActions([
      'foo',
      'bar'
    ]);
```

### Caveat for Plugin Developers

You may care about unpredictable namespacing for your modules when you create a [plugin](plugins.md) that provides the modules and let users add them to a Vuex store. Your modules will be also namespaced if the plugin users add your modules under a namespaced module. To adapt this situation, you may need to receive a namespace value via your plugin option:

```ts
// get namespace value via plugin option
// and returns Vuex plugin function
export function createPlugin (options = {}) {
  return function (store) {
    // add namespace to plugin module's types
    const namespace = options.namespace || ''
    store.dispatch(namespace + 'pluginAction')
  }
}
```

## Dynamic Module Registration

You can register a module **after** the store has been created with the `store.registerModule` method:

```ts
import {createStore} from "@visitsb/vuex";

const store = createStore({ /* options */ })

// register a module `myModule`
store.registerModule('myModule', {
  // ...
})

// register a nested module `nested/myModule`
store.registerModule(['nested', 'myModule'], {
  // ...
})
```

The module's state will be exposed as `store.state.myModule` and `store.state.nested.myModule`.

You can also remove a dynamically registered module with `store.unregisterModule(moduleName)`. 

> Note you cannot remove static modules (declared at store creation) with this method.

Note that you may check if the module is already registered to the store or not via `store.hasModule(moduleName)` method. One thing to keep in mind is that nested modules should be passed as arrays for both the `registerModule` and `hasModule` and not as a string with the path to the module.

### Preserving state

It may be likely that you want to preserve the previous state when registering a new module. You can achieve this with `preserveState` option: `store.registerModule('a', module, { preserveState: true })`

When you set `preserveState: true`, the module is registered, actions, mutations and getters are added to the store, but the state is not. It's assumed that your store state already contains state for that module and you don't want to overwrite it.

## Module Reuse

Sometimes we may need to register the same module multiple times in the same store.

If we use a plain object to declare the state of the module, then that state object will be shared by reference and cause cross store/module state pollution when it's mutated.

The solution is to use a function for declaring module state:

```ts
const MyReusableModule = {
  state: () => ({
    foo: 'bar'
  }),
  // mutations, actions, getters...
}
```

[Back](index.md)