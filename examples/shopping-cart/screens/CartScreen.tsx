import {mapGetters, mapState} from '@visitsb/vuex';
import {useContext} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {StateContext, StoreContext} from '../store';
import {CartProduct, CheckoutStatus, RootStackScreenProps, State} from '../types';
import CartProductComponent from "../components/CartProductComponent"

export default function CartScreen({navigation}: RootStackScreenProps<"Home">) {
    const {products} = mapGetters('cart', {
        products: 'cartProducts'
    });

    return <View style={[styles.container, styles.column]}>
        <StateContext.Consumer>{(state: State) => {
            const isCartEmpty: boolean = (products().length === 0)
            if (isCartEmpty) return <EmptyCartView/>

            return <>
                <CartItemsView products={products()}/>
                <CartCheckoutView/>
                <View style={[styles.spacer, {flex: 8}]}/>
            </>
        }}</StateContext.Consumer>
    </View>
}

const EmptyCartView = () => (
    <View style={[styles.container, styles.column, {justifyContent: "center", alignItems: "center"}]}><Text
        style={[styles.linkText, {color: "darkslategrey"}]}>Your cart is empty</Text></View>)

const CartItemsView = ({products}: { products: CartProduct[] }) => products.map((product: CartProduct) =>
    <CartProductComponent product={product} key={product.id} style={styles.product}/>)

const CartCheckoutView = () => {
    const {dispatch} = useContext(StoreContext)

    const {products, total} = mapGetters('cart', {
        products: 'cartProducts',
        total: 'cartTotalPrice'
    })
    const {checkoutStatus} = mapState({
        checkoutStatus: (state: State) => state.cart.checkoutStatus
    })

    const showCheckoutAlert = () =>
        Alert.alert(
            "Uh oh",
            "Something went wrong. Try again later.",
            //[{text: "OK", onPress: () => console.debug("Try again later")}]
        );

    return <View style={styles.priceContainer}>
        <Text style={styles.price}>Total: {(new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(total()))}</Text>
        <Button title="Checkout" onPress={() => (async () => {
            await dispatch('cart/checkout', products)
            if (checkoutStatus() == CheckoutStatus.FAILED) showCheckoutAlert()
        })()}/>
        <Text style={[styles.linkText, {color: "darkslategrey"}]}>{checkoutStatus()}</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    row: {
        flex: 1,
        flexDirection: "row"
    },
    column: {
        flex: 1,
        flexDirection: "column"
    },
    product: {
        flex: 1,
        justifyContent: "flex-start",
        margin: 10,
        padding: 10,
        backgroundColor: "snow"
    },
    priceContainer: {
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 20
    },
    price: {
        fontSize: 20,
        color: "green"
    },
    link: {},
    linkText: {
        fontSize: 15,
        color: 'orange'
    },
    spacer: {
        flex: 1
    }
});
