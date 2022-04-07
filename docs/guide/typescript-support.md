# TypeScript Support

Vuex provides its typings so you can use TypeScript to write a store definition. You don't need any special TypeScript configuration for Vuex. 

However, if you're writing your components in TypeScript, there're a few steps to follow that require for you to correctly provide typings for a store.

## Typing `store`

Vuex doesn't provide typings for `store` property out of the box, but you can easily use the typings in your React applications.

To do so, declare typings:

```ts
// store.ts

import {Store} from "@visitsb/vuex";

export interface State {
    count: number
}

export const store: Store<State> = createStore(...);
```

### Reactivity

The recommended way to inject store into your components is using React's [Context](https://reactjs.org/docs/context.html) Provider and [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook:

```ts
// store.ts

export const store: Store<State> = createStore(...);

export const StoreContext: Context<Store<State>> = createContext(store);
export const StateContext: Context<State> = createContext(store.state);

export default function useStore() {
    const store = useContext<Store<State>>(StoreContext);
    const state = useContext<State>(StateContext);

    // Provider can expose a global variable
    // but it needs to be reactive in order to cause a re-render
    // which is different to Vuex - hence subscribe to state changes
    // and refresh a `react`-ive state which Provider understands
    let [watchedState, setWatchedState] = useState(state);

    useEffect((/*didUpdate*/) => {
        const unsubscribe = store.subscribe((_, newState) => setWatchedState((prevState) => ({...prevState, ...newState})));

        return (/*cleanup*/) => {
            unsubscribe();
        }
    }, []);

    const _globalThis = (globalThis || self || window || global || {});
    if (typeof _globalThis.$store === 'undefined') {
        // mapXXX, createNamespacedHelpers presume `this.$store` is setup
        _globalThis.$store = store;
    }

    return {store, state: watchedState};
}

```

Use the store at your application root, and provide it to child components:

```ts
// App.tsx

import useStore, {StateContext, StoreContext} from "./store";

export default function App() {
    const {store, state} = useTodoStore();

    return <SafeAreaProvider>
        <StoreContext.Provider value={store}>
            <StateContext.Provider value={state}>
                <MyComponent />
            </StateContext.Provider>
        </StoreContext.Provider>
    </SafeAreaProvider>;
```

Components can access the `store`, `state` from context providers using either [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) hook or [Context.Consumer](https://reactjs.org/docs/context.html#contextconsumer) as described in the [example](../index.md).