import {StatusBar} from 'expo-status-bar';
import {Button, FlatList, StyleSheet, Switch, Text, TextInput, View} from 'react-native';
import {useState} from "react";
import {mapActions, mapGetters, mapState} from "@visitsb/vuex";
import {State, Todo} from "../types";
import {StateContext} from '../store';

export default function HomeScreen() {
    const [text, onChangeText] = useState('');
    const {todos} = mapState(['todos']);
    const {addTodo, toggleTodo, removeTodo} = mapActions(['addTodo', 'toggleTodo', 'removeTodo']);
    const {total, remaining} = mapGetters(['total', 'remaining']);

    return (
        <View style={[styles.container, styles.column]}>
            <StateContext.Consumer>{(_: State) =>
                <FlatList style={styles.todoContainer}
                          contentContainerStyle={[styles.todoList, styles.column]}
                          data={todos()}
                          renderItem={({item: todo}: { item: Todo }) => (
                              <View style={[styles.todoItem, styles.row]}>
                                  <Switch value={todo.done} onValueChange={() => toggleTodo(todo)}
                                          style={styles.todoToggle}/>
                                  <Text style={todo.done ? [styles.todoText, styles.todoDone] : [styles.todoText]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail">{todo.text}</Text>
                                  <View style={{flex: 1}}/>
                                  <Button title="Delete" onPress={() => removeTodo(todo)}/>
                              </View>
                          )}
                          keyExtractor={(todo: Todo) => todo.id}
                          ListHeaderComponentStyle={styles.header}
                          ListHeaderComponent={<TextInput
                              style={styles.textInput}
                              onChangeText={text => onChangeText(text)}
                              onSubmitEditing={() => {
                                  if (text.trim().length > 0) addTodo(text)
                                  onChangeText('')
                              }}
                              placeholder="What needs to be done?"
                              value={text}
                          />}
                          ListEmptyComponent={<View style={[styles.emptyList, styles.row]}><Text
                              style={styles.emptyListText}>You have
                              no
                              todos</Text></View>}
                          ListFooterComponent={<Text
                              style={styles.footerText}>{remaining()} / {total()} remaining</Text>}
                          ListFooterComponentStyle={[styles.footer, styles.row, (total() === 0) ? styles.hidden : {}]}
                          ItemSeparatorComponent={() => <View style={styles.separator}/>}
                />}</StateContext.Consumer>
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
    row: {
        flexDirection: "row",
    },
    column: {
        flexDirection: "column",
    },
    todoContainer: {
        flex: 1,
        width: '100%',
    },
    todoList: {
        flexGrow: 1,
        padding: 10,
    },
    emptyList: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyListText: {
        color: "lightgrey",
        fontSize: 20
    },
    todoItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    todoText: {
        fontSize: 25,
        maxWidth: 260,
    },
    todoDone: {
        color: "darkgrey",
        textDecorationStyle: "solid",
        textDecorationLine: "line-through",
    },
    todoToggle: {
        marginRight: 10
    },
    textInput: {
        fontSize: 25,
        width: '100%',
        height: 45,
        borderColor: 'gray',
        borderWidth: 0.5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    header: {
        marginBottom: 10
    },
    footer: {
        alignContent: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    footerText: {
        color: "darkgrey",
    },
    hidden: {
        display: "none",
    },
    separator: {
        marginVertical: 1,
        width: '100%',
        height: 1,
    },
});
