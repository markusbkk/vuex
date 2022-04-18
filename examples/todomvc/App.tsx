import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, Pressable} from 'react-native';
import useStore, {StateContext, StoreContext} from './store';
import {RootStackScreenProps} from './types'
import {FontAwesome} from '@expo/vector-icons';
import ModalScreen from "./screens/ModalScreen";
import HomeScreen from "./screens/HomeScreen";
import {useEffect} from "react";
import {mapActions} from "@visitsb/vuex";

const Stack = createNativeStackNavigator();

export default function App() {
    const {store, state} = useStore();
    const {loadTodos} = mapActions(['loadTodos']);

    useEffect(() => {
        (async () => await loadTodos())();
    }, []);

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
                                    title: 'Todo',
                                    headerRight: () => (
                                        <Pressable
                                            onPress={() => navigation.navigate('Modal')}
                                            style={({pressed}) => ({
                                                opacity: pressed ? 0.5 : 1,
                                            })}>
                                            <FontAwesome
                                                name="info-circle"
                                                size={25}
                                                style={{marginRight: 15}}
                                            />
                                        </Pressable>
                                    ),
                                })}/>
                            <Stack.Group screenOptions={{presentation: 'modal'}}>
                                <Stack.Screen name="Modal"
                                              component={ModalScreen}
                                              options={({navigation}: RootStackScreenProps<'Modal'>) => ({
                                                  title: 'Modal',
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
