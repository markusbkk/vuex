import {mapActions} from '@visitsb/vuex';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Product} from '../types';

export default function ProductComponent({product, style}: { product: Product, style: ViewStyle }) {
    const {addProductToCart} = mapActions('cart', ['addProductToCart'])

    const title: string = product.title
    const price: string = (new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price));

    const inventory: number = product.inventory
    const isInStock: boolean = (product.inventory > 0)

    return <View style={style}>
        <View style={[styles.row]}>
            <View style={[styles.column, {alignItems: "flex-start", justifyContent: "space-between"}]}>
                <Text style={styles.productTitle}>{title}</Text>
                {isInStock ?
                    <Text style={[styles.linkText, {color: "darkslategrey"}]}>In
                        stock: {inventory} left</Text> : <></>}
            </View>
            <View style={[styles.spacer]}/>
            <View style={[styles.column, styles.productTag]}>
                <Text style={styles.productPrice}>{price}</Text>
                {isInStock ?
                    <Pressable onPress={() => addProductToCart(product)} style={({pressed}) => ({
                        opacity: pressed ? 0.5 : 1,
                    })}>
                        <Text style={[styles.link, styles.linkText]}>Buy</Text>
                    </Pressable> :
                    <Text style={[styles.linkText, {color: "darkslategrey"}]}>Out of stock</Text>
                }
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
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
    productTitle: {
        fontSize: 15
    },
    productPrice: {
        fontSize: 15
    },
    productTag: {
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    link: {},
    linkText: {
        fontSize: 15,
        color: '#2e78b7'
    },
    spacer: {
        flex: 1
    }
});