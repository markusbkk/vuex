import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';

import Counter from "./components/Counter"
import useStore, {StateContext, StoreContext} from './store';

export default function App() {
    const {store, state} = useStore()

    return (
        <View style={styles.container}>
            <StoreContext.Provider value={store}>
                <StateContext.Provider value={state}>
                    <Counter/>
                    <StatusBar style="auto"/>
                </StateContext.Provider>
            </StoreContext.Provider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
