import {Store} from "@visitsb/vuex";

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

declare global {
    type Nullable<T> = T | null;
    type ObjectKeys<T> = T extends object ? (keyof T)[] : T extends number ? [] : T extends Array<any> | string ? string[] : never;

    interface ObjectConstructor {
        keys<T>(o: T): ObjectKeys<T>
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
    // `globalThis` property provides a standard way of accessing the global this value (and hence the
    // global object itself) across environments.
    // https://vuex.vuejs.org/api/#component-binding-helpers
    // mapXXX, createNamespacedHelpers presume `this.$store` is setup
    var $store: Store<State>;
}

// Custom counter app types
export interface State {
    count: number
}
