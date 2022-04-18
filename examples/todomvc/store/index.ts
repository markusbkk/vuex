import {Commit, createLogger, createStore, Plugin, Store} from "@visitsb/vuex";
import {Context, createContext, useContext, useEffect, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import {State, Todo, TodoFilters} from "./../types";

const debug: boolean = (process.env.NODE_ENV !== 'production')
const STORAGE_KEY: string = 'todos-vuex'

const localStoragePlugin: Plugin<State> = (store: Store<State>) => {
    store.subscribe((mutation, {todos}) => {
        (async () => await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(todos)))();
    })
};

const loggerPlugin: Plugin<State> = createLogger<State>({
    collapsed: true,
    transformer: () => '...', // Skip log for state
    actionTransformer: JSON.stringify,
    mutationTransformer: JSON.stringify
});

export const store: Store<State> = createStore({
    strict: debug,
    state: (): State => ({
        todos: []
    }),
    getters: {
        all: (state: State): Todo[] => state.todos,
        active: (state: State, getters: any): Todo[] => getters.all.filter((todo: Todo) => !todo.done),
        completed: (state: State, getters: any): Todo[] => getters.all.filter((todo: Todo) => todo.done),
        allChecked: (state: State, getters: any): boolean => getters.all.every((todo: Todo) => todo.done),
        total: (state: State, getters: any): number => getters.all.length,
        remaining: (state: State, getters: any): number => getters.active.length
    },
    mutations: {
        setTodos(state: State, todos: Todo[]): void {
            state.todos = todos;
        },

        addTodo(state: State, todo: Todo): void {
            state.todos.push(todo);
        },

        removeTodo(state: State, todo: Todo): void {
            state.todos.splice(state.todos.indexOf(todo), 1);
        },

        editTodo(state: State, {todo, text = todo.text, done = todo.done}): void {
            const index: number = state.todos.indexOf(todo);

            state.todos.splice(index, 1, {
                ...todo,
                text,
                done
            });
        }
    },
    actions: {
        async loadTodos({commit}: { commit: Commit }): Promise<void> {
            const localStorageTodos: Nullable<string> = await SecureStore.getItemAsync(STORAGE_KEY);
            const todos: Todo[] = localStorageTodos ? JSON.parse(localStorageTodos) : [];

            commit('setTodos', todos);
        },

        addTodo({commit}: { commit: Commit }, text: string): void {
            commit('addTodo', {
                id: uuid.v4(),
                text,
                done: false
            });
        },

        removeTodo({commit}: { commit: Commit }, todo: Todo): void {
            commit('removeTodo', todo);
        },

        toggleTodo({commit}: { commit: Commit }, todo: Todo) {
            commit('editTodo', {todo, done: !todo.done});
        },

        editTodo({commit}: { commit: Commit }, {todo, value}: { todo: Todo, value: Todo }): void {
            commit('editTodo', {todo, text: value});
        },

        toggleAll({state, commit}: { state: State, commit: Commit }, done: boolean) {
            state.todos.forEach((todo) => {
                commit('editTodo', {todo, done});
            })
        },

        clearCompleted({state, commit}: { state: State, commit: Commit }): void {
            state.todos.filter(todo => todo.done)
                .forEach(todo => {
                    commit('removeTodo', todo);
                });
        },

        filteredTodos: ({getters}: { getters: any }, visibility: TodoFilters): Todo[] => getters[visibility]
    },
    modules: {},
    plugins: debug ? [loggerPlugin, localStoragePlugin] : [localStoragePlugin]
})

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
        const unsubscribe = store.subscribe((mutation, newState) => setWatchedState((prevState: State) => ({...prevState, ...newState})));

        return (/*cleanup*/) => unsubscribe();
    }, []);

    const _globalThis = (globalThis || self || window || global || {});
    if (typeof _globalThis.$store === 'undefined') {
        _globalThis.$store = store;
    }

    return {store, state: watchedState};
}
