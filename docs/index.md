# What is Vuex?

Vuex is a **state management pattern + library** originally created for Vue.js applications. Vuex serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.

**This fork makes Vuex available for use in non-Vue applications such as  React, ReactJS and React Native applications.** This documentation covers Vuex usage _outside_ of Vue ecosystem.

## What is a "State Management Pattern"?

Let's start with a simple React counter app:

```js
const Counter = {
    state: () => ({
        count: 0
    }),
    mutations: {
        INCREMENT(state) {
            state.count = state.count + 1
        },
        DECREMENT(state) {
            state.count = state.count - 1
        }
    },
    actions: {
        increment({commit}) {
            commit('INCREMENT')
        },
        decrement({commit}) {
            commit('DECREMENT')
        }
    }
}
```

It contains the following parts:

- The **state**, the source of truth that drives our app;
- The **mutations**, which defines explicit rules to update **state**;
- The **actions**, the possible ways the state could change in reaction to user inputs from a component views in your application.

This is a simple representation of the concept of "one-way data flow":

![img](public/flow.png "one-way data flow")

However, the simplicity quickly breaks down when we have **multiple components that share a common state**:

- Multiple views may depend on the same piece of state.
- Actions from different views may need to mutate the same piece of state.

For problem one, passing props can be tedious for deeply nested components, and simply doesn't work for sibling components. For problem two, we often find ourselves resorting to solutions such as reaching for direct parent/child instance references or trying to mutate and synchronize multiple copies of the state via events. Both of these patterns are brittle and quickly lead to unmaintainable code.

So why don't we extract the shared state out of the components, and manage it in a global singleton? With this, our component tree becomes a big "view", and any component can access the state or trigger actions, no matter where they are in the tree!

By defining and separating the concepts involved in state management and enforcing rules that maintain independence between views and states, we give our code more structure and maintainability.

This is the basic idea behind Vuex, inspired by [Flux](https://facebook.github.io/flux/docs/overview), [Redux](http://redux.js.org/) and [The Elm Architecture](https://guide.elm-lang.org/architecture/). Unlike the other patterns, Vuex is also a library implementation tailored specifically for Vue.js to take advantage of its granular reactivity system for efficient updates.

![img](public/vuex.png "Vuex")

## When Should I Use It?

Vuex helps us deal with shared state management with the cost of more concepts and boilerplate. It's a trade-off between short term and long term productivity.

If you've never built a large-scale SPA and jump right into Vuex, it may feel verbose and daunting. That's perfectly normal - if your app is simple, you will most likely be fine without Vuex. A simple [store pattern](guide/index.md) may be all you need. But if you are building a medium-to-large-scale SPA, chances are you have run into situations that make you think about how to better handle state outside of your Vue components, and Vuex will be the natural next step for you. There's a good quote from Dan Abramov, the author of Redux:

> Flux libraries are like glasses: you’ll know when you need them.

For further details, see the [Guide](guide/index.md).

## How To Get It?

See [Installation](installation.md).

## API

See [API](api/index.md).