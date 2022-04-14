import {Commit, createLogger, createStore, Store} from "@visitsb/vuex";
import {Context, createContext, useContext, useEffect, useState} from "react";
import {State} from "./types"

export const store: Store<State> = createStore({
    strict: true,
    state: (): State => ({
        count: 0
    }),
    getters: {
        evenOrOdd: (state: State): string => state.count % 2 === 0 ? 'even' : 'odd'
    },
    mutations: {
        increment(state: State): void {
            state.count++
        },
        decrement(state: State): void {
            state.count--
        }
    },
    actions: {
        increment: ({commit}: { commit: Commit }) => commit('increment'),
        decrement: ({commit}: { commit: Commit }) => commit('decrement'),
        incrementIfOdd({commit, state}: { commit: Commit, state: State }) {
            if ((state.count + 1) % 2 === 0) {
                commit('increment')
            }
        },
        incrementAsync({commit}: { commit: Commit }): Promise<boolean> {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('increment')
                    resolve(true)
                }, 1000)
            })
        }
    },
    plugins: [
        createLogger<State>({
            collapsed: true,
            transformer: () => '...', // Skip log for state
            actionTransformer: JSON.stringify,
            mutationTransformer: JSON.stringify
        })
    ]
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

        return (/*cleanup*/) => unsubscribe()
    }, []);

    const _globalThis = (globalThis || self || window || global || {});
    if (typeof _globalThis.$store === 'undefined') {
        _globalThis.$store = store;
    }

    return {store, state: watchedState};
}
