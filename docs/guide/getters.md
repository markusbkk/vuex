# Getters

Sometimes we may need to compute derived state based on store state, for example filtering through a list of items and counting them:

``` ts
doneTodos: (state: State) => state.todos.filter(todo => todo.done)
```

If more than one component needs to make use of this, we have to either duplicate the function, or extract it into a shared helper and import it in multiple places - both are less than ideal.

Vuex allows us to define "getters" in the store. You can think of them as computed properties for stores.

Getters will receive the state as their 1st argument:

``` ts
// state/TodoStore.ts

import {createStore, Store} from "@visitsb/vuex";
import {Context, createContext, useContext, useEffect, useState} from "react";

export interface Todo {
    id: number,
    text: string,
    done: boolean
}

export interface State {
    todos: Todo[]
}

export const store: Store<State> = createStore({
    state: (): State => ({
        todos: [
            {id: 1, text: '...', done: true},
            {id: 2, text: '...', done: false}
        ]
    }),
    getters: {
        doneTodos: (state: State) => state.todos.filter(todo => todo.done)
    }
});
...
```

## Property-Style Access

The getters will be exposed on the `store.getters` object, and you access values as properties:

``` ts
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```

Getters will also receive other getters as the 2nd argument:

``` ts
getters: {
  // ...
  doneTodosCount: (state, getters) => getters.doneTodos.length
}
```

``` ts
store.getters.doneTodosCount // -> 1
```

We can now easily make use of it inside any component.

## Method-Style Access

You can also pass arguments to getters by returning a function. This is particularly useful when you want to query an array in the store:

```ts
getters: {
  // ...
  getTodoById: (state) => (id: number) => state.todos.find(todo => (todo.id === id))
}
```

``` ts
store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

Note that getters accessed via methods will run each time you call them, and the result is not cached.

## The `mapGetters` Helper

The `mapGetters` helper simply maps store getters to local computed properties:

``` tsx
// screens/MapGettersExample.tsx

import {StyleSheet, Text, View} from 'react-native';
import {useEffect} from "react";
import {mapGetters} from "@visitsb/vuex";

export default function MapGettersExample() {
    const {doneTodos, doneTodosCount} = mapGetters(['doneTodos', 'doneTodosCount'])

    useEffect(() => {
        console.debug(doneTodos());
        console.debug(doneTodosCount());
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>...</Text>
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

If you want to map a getter to a different name, use an object:

``` ts
mapGetters({
  // map `doneCount` to `store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```
