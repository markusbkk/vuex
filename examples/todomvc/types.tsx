import {Store} from "@visitsb/vuex";

import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }

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

export type RootStackParamList = {
    Home: undefined;
    Modal: undefined;
    NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = CompositeScreenProps<NativeStackScreenProps<RootStackParamList>, NativeStackScreenProps<RootStackParamList, Screen>>;

// Custom todomvc app types
export type State = {
    todos: Todo[]
}

// @see store.getters for each filter
export enum TodoFilters {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed'
}

export type Todo = {
    id: string,
    text: string,
    done: boolean
}
