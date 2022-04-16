import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartScreen, HomeScreen} from "./screens";
import {Button, Pressable, StyleSheet, Text, View} from 'react-native';
import useStore, {StateContext, StoreContext} from './store';
import {RootStackScreenProps} from './types'
import {FontAwesome} from '@expo/vector-icons';
import {mapGetters} from '@visitsb/vuex';

const Stack = createNativeStackNavigator();

export default function App() {
    const {store, state} = useStore();

    const {items} = mapGetters('cart', {
        items: 'cartTotalItems'
    });

    return (
        <SafeAreaProvider>
            <StoreContext.Provider value={store}>
                <StateContext.Provider value={state}>
                    <NavigationContainer>
                        <Stack.Navigator initialRouteName="Home">
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                options={({navigation}: RootStackScreenProps<'Home'>) => ({
                                    title: 'Products',
                                    headerRight: () => (
                                        <Pressable
                                            onPress={() => navigation.navigate('Cart')}
                                            style={({pressed}) => ({
                                                opacity: pressed ? 0.5 : 1,
                                            })}>
                                            <View style={[styles.cartContainer, styles.row]}>
                                                <FontAwesome
                                                    name="shopping-cart"
                                                    size={25}
                                                    style={{marginRight: 15}}
                                                />
                                                <Text style={styles.cartCount}>{items()}</Text>
                                            </View>
                                        </Pressable>
                                    ),
                                })}/>
                            <Stack.Group screenOptions={{presentation: 'modal'}}>
                                <Stack.Screen name="Cart"
                                              component={CartScreen}
                                              options={({navigation}: RootStackScreenProps<'Cart'>) => ({
                                                  title: 'Cart',
                                                  headerRight: () => <Button
                                                      title="Done"
                                                      onPress={() => navigation.goBack()}/>,
                                              })}/>
                            </Stack.Group>
                        </Stack.Navigator>
                    </NavigationContainer>
                </StateContext.Provider>
            </StoreContext.Provider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    cartContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    row: {
        flexDirection: "row"
    },
    column: {
        flexDirection: "column"
    },
    cartCount: {
        color: "green"
    }
});
