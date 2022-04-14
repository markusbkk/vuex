import {mapActions, mapGetters, mapState} from '@visitsb/vuex';
import {StatusBar} from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';

export default function Counter() {
    const {count} = mapState(['count'])
    const {evenOrOdd} = mapGetters(['evenOrOdd'])
    const {
        increment,
        decrement,
        incrementIfOdd,
        incrementAsync
    } = mapActions(['increment', 'decrement', 'incrementIfOdd', 'incrementAsync'])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clicked: {count()} times, count is {evenOrOdd()}.</Text>
            <View style={styles.separator}/>
            <View style={styles.buttons}>
                <Button title="[ + ]" color="blue" onPress={() => increment()}/>
                <Button title="[ - ]" color="red" onPress={() => decrement()}/>
                <Button title="[ + ] (if odd)" color="orange" onPress={() => incrementIfOdd()}/>
                <Button title="[ + ] (async)" color="green" onPress={() => incrementAsync()}/>
            </View>
            <StatusBar style="auto"/>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    buttons: {
        flexDirection: "row"
    }
});
