import {Alert, Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {CartProduct} from '../types';

export default function CartProductComponent({product, style}: { product: CartProduct, style: ViewStyle }) {
    const title: string = product.title
    const price: string = (new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(product.price));
    const quantity: number = product.quantity

    const tbd = (): void => Alert.alert("Todo", "Not implemented yet");

    return <View style={style}>
        <View style={[styles.row]}>
            <View style={[styles.column, {alignItems: "flex-start", justifyContent: "space-between"}]}>
                <Text style={styles.productTitle}>{title}</Text>
                <Text style={[styles.linkText, {color: "darkslategrey"}]}>Quantity: {quantity}</Text>
            </View>
            <View style={[styles.spacer]}/>
            <View style={[styles.column, styles.productTag]}>
                <Text style={styles.productPrice}>{price}</Text>
                <Pressable onPress={() => tbd()} style={({pressed}) => ({opacity: pressed ? 0.5 : 1,})}>
                    <Text style={[styles.link, styles.linkText]}>Remove</Text>
                </Pressable>
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