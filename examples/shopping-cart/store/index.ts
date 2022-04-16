import {Commit, createLogger, createStore, Store} from "@visitsb/vuex";
import {Context, createContext, useContext, useEffect, useState} from "react";
import {CartItem, CartProduct, CartState, CheckoutStatus, Product, ProductsState, State} from "./../types";
import shop from '../api/shop'

const debug = process.env.NODE_ENV !== 'production'

export const store: Store<State> = createStore({
    strict: debug,
    state: (): State => ({}),
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        products: {
            namespaced: true,
            state: (): ProductsState => ({
                all: []
            }),
            getters: {},
            mutations: {
                setProducts(state: ProductsState, products: Product[]) {
                    state.all = products
                },
                decrementProductInventory(state: ProductsState, {id}: Product) {
                    const product = state.all.find(product => product.id === id)
                    product!.inventory--
                }
            },
            actions: {
                async getAllProducts({commit}: { commit: Commit }) {
                    const products: Product[] = await shop.getProducts()
                    commit('setProducts', products)
                }
            }
        },
        cart: {
            namespaced: true,
            state: (): CartState => ({
                items: [],
                checkoutStatus: CheckoutStatus.EMPTY
            }),
            getters: {
                cartProducts: (state: CartState, getters: any, rootState: State): CartProduct[] => {
                    return state.items.map(({id, quantity}): CartProduct => {
                        const product: Product = rootState.products.all.find((product: Product) => (product.id === id))
                        return <CartProduct>{
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            quantity
                        }
                    })
                },
                cartTotalItems: (state: CartState, getters: any): number => {
                    return getters.cartProducts.reduce((total: number, product: CartProduct) => {
                        return total + product.quantity
                    }, 0)
                },
                cartTotalPrice: (state: CartState, getters: any): number => {
                    return getters.cartProducts.reduce((total: number, product: CartProduct) => {
                        return total + product.price * product.quantity
                    }, 0)
                }
            },
            mutations: {
                pushProductToCart(state: CartState, {id}: Partial<Product> & { id: number }) {
                    state.items.push({id, quantity: 1})
                },

                incrementItemQuantity(state: CartState, {id}: Partial<Product> & { id: number }) {
                    const cartItem: CartItem = state.items.find(item => item.id === id)!
                    cartItem.quantity++
                },

                setCartItems(state: CartState, {items}: { items: CartItem[] }): void {
                    state.items = items
                },

                setCheckoutStatus(state: CartState, status: CheckoutStatus = CheckoutStatus.EMPTY): void {
                    state.checkoutStatus = status
                }
            },
            actions: {
                async checkout({
                                   commit,
                                   state
                               }: { commit: Commit, state: CartState }, products: Product[]): Promise<void> {
                    commit('setCheckoutStatus')
                    try {
                        await shop.buyProducts(products)
                        // empty cart
                        commit('setCartItems', {items: []})
                        commit('setCheckoutStatus', CheckoutStatus.SUCCESSFUL)
                    } catch (e) {
                        // Log error somewhere
                        commit('setCheckoutStatus', CheckoutStatus.FAILED)
                    }
                },

                async addProductToCart({
                                           state,
                                           commit
                                       }: { state: CartState, commit: Commit }, product: Product): Promise<void> {
                    commit('setCheckoutStatus')

                    if (product.inventory > 0) {
                        const cartItem: CartItem = state.items.find(item => item.id === product.id)!

                        if (!cartItem) {
                            commit('pushProductToCart', {id: product.id})
                        } else {
                            commit('incrementItemQuantity', cartItem)
                        }

                        // remove 1 item from stock
                        commit('products/decrementProductInventory', {id: product.id}, {root: true})
                    }
                }
            }
        }
    },
    plugins: debug ? [
        createLogger<State>({
            collapsed: true,
            transformer: () => '...', // Skip log for state
            actionTransformer: JSON.stringify,
            mutationTransformer: JSON.stringify
        })
    ] : [/*no plugins*/]
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
