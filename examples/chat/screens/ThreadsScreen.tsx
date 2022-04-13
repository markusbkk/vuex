import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text, View} from '../components/Themed';
import {RootTabScreenProps, Thread} from '../types';
import {State, StateContext} from "../store";
import {FontAwesome} from "@expo/vector-icons";
import {mapActions, mapGetters} from "@visitsb/vuex";

export default function ThreadsScreen({navigation}: RootTabScreenProps<'Threads'>) {
    const {switchThread} = mapActions(['switchThread'])

    async function showThreadMessages(id: string) {
        await switchThread({id})
        navigation.navigate('Messages')
    }

    return (
        <View style={styles.container}>
            <View style={styles.threadContainer}>
                <StateContext.Consumer>{(state: State) => <>{
                    Object.keys(state.threads).map((id: string) => {
                            const thread: Thread = state.threads[id]
                            const messagesCount: number = thread.messages.length

                            const isCurrentThread: boolean = (state.currentThreadId === thread.id)
                            const threadIconStyles = []

                            // Marker styles to highlight current thread
                            threadIconStyles.push(styles.threadIcon)
                            if (isCurrentThread) threadIconStyles.push(styles.threadIconSelected)

                            return <TouchableOpacity key={id} style={styles.thread} onPress={() => showThreadMessages(id)}>
                                <FontAwesome size={12} style={threadIconStyles}
                                             name={isCurrentThread ? "circle" : "circle-o"}/>
                                <Text style={styles.threadTitle}>{thread.name}</Text>
                                <Text style={styles.messagesCount}>({messagesCount})</Text>
                                <View style={styles.padding}></View>
                                <FontAwesome size={30} style={styles.threadTrailingIcon} name="angle-right"/>
                            </TouchableOpacity>
                        }
                    )}</>
                }</StateContext.Consumer></View>
            {/*<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <EditScreenInfo path="/screens/ThreadsScreen.tsx"/>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    threadContainer: {
        flex: 1,
        width: '100%',
    },
    thread: {
        flexDirection: "row",
        padding: 20,
    },
    threadIcon: {
        alignSelf: "flex-start",
        paddingRight: 10,
        marginTop: 7,
        color: "white"
    },
    threadIconSelected: {
        color: "royalblue"
    },
    threadTitle: {
        fontSize: 20,
        alignSelf: "flex-start"
    },
    threadTrailingIcon: {
        marginBottom: -3,
        alignSelf: "flex-end"
    },
    messagesCount: {
        fontSize: 20,
        paddingHorizontal: 10,
        color: "#aaa"
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
