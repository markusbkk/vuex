import {Context, createContext, useContext, useEffect, useState} from "react";
import {Store} from "@visitsb/vuex";
import store, {State} from "./store";

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
