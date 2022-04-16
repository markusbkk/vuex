import {mapActions, mapState} from '@visitsb/vuex';
import {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {StateContext} from '../store';
import {Product, RootStackScreenProps, State} from '../types';
import ProductComponent from "../components/ProductComponent"

export default function HomeScreen({navigation}: RootStackScreenProps<"Home">) {
    const {products} = mapState({
        products: (state: State): Product[] => state.products.all
    });
    const {getAllProducts} = mapActions('products', ['getAllProducts'])

    useEffect(() => {
        (async () => await getAllProducts())()
    }, [])

    return (
        <View style={[styles.container, styles.column]}>
            <StateContext.Consumer>{(state: State) => <>{
                products().map((product: Product) => <ProductComponent product={product} key={product.id}
                                                                       style={styles.product}/>)}
            </>}</StateContext.Consumer>
            <View style={[styles.spacer, {flex: 8}]}/>
        </View>
    );
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
    spacer: {
        flex: 1
    }
});
