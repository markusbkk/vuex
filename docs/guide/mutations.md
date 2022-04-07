# Mutations

The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string **type** and a **handler**. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

```ts
const store: Store<State> = createStore({
    state: (): State => ({
        count: 0
    }),
    mutations: {
        INCREMENT(state: State) {
            state.count = state.count + 1
        }
    }
});
```

You cannot directly call a mutation handler. Think of it more like event registration: "When a mutation with type `increment` is triggered, call this handler." To invoke a mutation handler, you need to call `store.commit` with its type:

```ts
store.commit('increment')
```

## Commit with Payload

You can pass an additional argument to `store.commit`, which is called the **payload** for the mutation:

```ts
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```ts
store.commit('increment', 10)
```

In most cases, the **payload should be an object** so that it can contain multiple fields, and the recorded mutation will also be more descriptive:

```ts
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

```ts
store.commit('increment', {
  amount: 10
})
```

## Object-Style Commit

An alternative way to commit a mutation is by directly using an object that has a `type` property:

```ts
store.commit({
  type: 'increment',
  amount: 10
})
```

When using object-style commit, the entire object will be passed as the payload to mutation handlers, so the handler remains the same:

```ts
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
```

## Using Constants for Mutation Types

It is a commonly seen pattern to use constants for mutation types in various Flux implementations. This allows the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:

```ts
// mutation-types.ts
export const SOME_MUTATION = 'SOME_MUTATION'
```

```ts
// store.ts

import {createStore, Store} from "@visitsb/vuex";
import {SOME_MUTATION} from "./mutation-types";

export const store: Store<{}> = createStore({
    state: () => ({}),
    mutations: {
        // we can use the ES2015 computed property name feature
        // to use a constant as the function name
        [SOME_MUTATION](state) {
            // mutate state
        }
    }
});
```

Whether to use constants is largely a preference - it can be helpful in large projects with many developers, but it's totally **optional** if you don't like them.

## Mutations Must Be Synchronous

One important rule to remember is that **mutation handler functions must be synchronous**. Why? Consider the following example:

```ts
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

Now imagine we are debugging the app and looking at logs. For every mutation logged, the asynchronous callback inside the example mutation is not called yet when the mutation is committed, there's no way to know when the callback will actually be called - any state mutation performed in the callback is essentially un-trackable! See [strict](strict.md) on how to prevent that during development of your application.

## Committing Mutations in Components

You can commit mutations in components with `this.$store.commit('xxx')`, or use the `mapMutations` helper which maps component methods to `store.commit` calls (requires root `store` injection as shown in Counter [example](../index.md)):

```ts
import {mapMutations} from "@visitsb/vuex";

// ...
const {increment, incrementBy} = mapMutations([
    'increment', // map `increment()` to `store.commit('increment')`

    // `mapMutations` also supports payloads:
    'incrementBy' // map `incrementBy(amount)` to `store.commit('incrementBy', amount)`
]);

const {add} = mapMutations({
        add: 'increment' // map `add()` to `store.commit('increment')`
    });
```

## On to Actions

Asynchronicity combined with state mutation can make your program very hard to reason about. For example, when you call two methods both with async callbacks that mutate the state, how do you know when they are called and which callback was called first? This is exactly why we want to separate the two concepts. In Vuex, **mutations are synchronous transactions**:

```ts
store.commit('increment');
// any state change that the "increment" mutation may cause
// should be done at this moment.
```

To handle asynchronous operations, let's introduce [Actions](actions.md).
