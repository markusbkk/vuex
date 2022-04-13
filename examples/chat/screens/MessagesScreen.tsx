import {KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput} from 'react-native';
import {Text, View} from '../components/Themed';
import {Message, RootTabScreenProps, Thread} from "../types";
import {mapActions, mapGetters} from "@visitsb/vuex";
import {useState} from "react";
import {State, StateContext} from '../store';

export default function MessagesScreen({navigation}: RootTabScreenProps<'Messages'>) {
    const {currentThread} = mapGetters(['currentThread']);
    const {sendMessage} = mapActions(['sendMessage']);
    const [message, setMessage] = useState('');

    async function newMessage() {
        if (message.trim().length > 0) {
            await sendMessage({text: message, thread: currentThread()})
            // Reset input
            setMessage('')
        }
    }

    return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset="85"
                                 style={styles.container}>
        <View style={styles.messagesContainer}>
            <StateContext.Consumer>{(state: State) => {
                const thread: Thread = currentThread()

                return <>{thread.messages.map((id: string) => {
                    const message: Message = state.messages[id]
                    const messageTimestamp: string= new Date(message.timestamp).toLocaleTimeString(undefined, {timeStyle: "short"})

                    return <View key={id} style={styles.message}>
                        <View style={styles.messageHeader}>
                            <Text style={styles.messageAuthor}>{message.authorName}</Text>
                            <Text
                                style={styles.messageTimestamp}>{messageTimestamp}</Text>
                        </View>
                        <Text style={styles.messageText}>{message.text}</Text>

                    </View>
                })}</>
            }}</StateContext.Consumer></View>
        <View style={{flex: 1}}></View>
        <View style={styles.newMessage}>
            <TextInput style={styles.newMessageText}
                       placeholder="Post a new message"
                       value={message}
                       onChangeText={setMessage} onEndEditing={newMessage}
            />
            <Pressable style={({pressed}) => ({
                opacity: pressed ? 0.5 : 1,
            })} onPress={() => newMessage()}><Text style={styles.newMessageSend}>Send</Text></Pressable>
        </View>
        {/*<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <EditScreenInfo path="/screens/MessagesScreen.tsx"/>*/}
    </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    messagesContainer: {
        width: '100%'
    },
    message: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    messageHeader: {
        flex: 1,
        height: 50,
        marginHorizontal: 10,
        paddingVertical: 5
    },
    messageAuthor: {
        flex: 1,
        alignSelf: "flex-end",
        fontSize: 15,
        color: "royalblue"
    },
    messageTimestamp: {
        flex: 1,
        alignSelf: "flex-end",
        fontSize: 15,
        color: "tan"
    },
    messageText: {
        flex: 9,
        fontSize: 20
    },
    newMessage: {
        flexDirection: "row",
        width: '100%',
        marginBottom: 10
    },
    newMessageText: {
        flex: 1,
        fontSize: 20,
        paddingHorizontal: 20,
        backgroundColor: "#fff"
    },
    newMessageSend: {
        alignSelf: "flex-end",
        fontSize: 20,
        padding: 10,
        backgroundColor: "green",
        color: "white",
        margin: 10
    },
    padding: {
        flex: 1,
        flexDirection: "row"
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
