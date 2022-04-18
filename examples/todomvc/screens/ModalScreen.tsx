import {StatusBar} from 'expo-status-bar';
import {Platform, StyleSheet, Text, View} from 'react-native';

export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <Text>Open up ModalScreen.tsx to start working on your app!</Text>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'}/>
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
});
