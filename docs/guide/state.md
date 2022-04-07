# State

## Single State Tree

Vuex uses a **single state tree** - that is, this single object contains all your application level state and serves as the "single source of truth." This also means usually you will have only one store for each application. A single state tree makes it straightforward to locate a specific piece of state, and allows us to easily take snapshots of the current app state for debugging purposes.

The single state tree does not conflict with modularity - in later chapters we will discuss how to split your state and mutations into sub modules.

## Getting Vuex State into Vue Components

So how do we display state from the store in our components? Since Vuex stores are reactive, the simplest way to "retrieve" state using [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext) like we saw in  [Counter example](index.md):

```tsx
const state = useContext(StateContext)
console.log(state.count);
```

Whenever `state.count` changes, it will cause any reactive view to re-evaluate, and trigger associated UI updates. This pattern allows the component to use a global store, state singleton. 

Vuex is "injected" as a store into all child components from the root component through React's [Context](https://reactjs.org/docs/context.html), and will be available on them [useContext](https://reactjs.org/docs/hooks-reference.html#usecontext).

## The `mapState` Helper

When a component needs to make use of multiple store state properties or getters, declaring all those properties can get repetitive and verbose. To deal with this we can make use of the `mapState` helper which generates computed getter functions for us, saving us some keystrokes:

```tsx
// screens/MapStateExample.tsx

import {StyleSheet, Text, View} from 'react-native';
import {mapState} from "@visitsb/vuex";

export default function MapStateExample() {
    const {count} = mapState(['count']);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{count()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        paddingVertical: 20
    }
});
```

> Note that `mapState` returns an object with each property as a function. We can also pass a string array to `mapState` to map multiple values from state.

### Components Can Still Have Local State

Using Vuex doesn't mean you should put **all** the state in Vuex. Although putting more state into Vuex makes your state mutations more explicit and debuggable, sometimes it could also make the code more verbose and indirect. If a piece of state strictly belongs to a single component, it could be just fine leaving it as local state and using React's [useState](https://reactjs.org/docs/hooks-state.html) hook. You should weigh the trade-offs and make decisions that fit the development needs of your app.

Next, see how state can be modified via [Mutations](mutations.md) and how  [Getters](getters.md) can also represent state.
