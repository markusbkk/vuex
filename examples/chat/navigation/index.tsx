/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {FontAwesome} from '@expo/vector-icons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {useContext, useEffect} from 'react';
import {ColorSchemeName, Pressable} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import TabOneScreen from '../screens/ThreadsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import {RootStackParamList, RootTabParamList, RootTabScreenProps} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import {StateContext, StoreContext, useStore} from "../store";
import {mapGetters} from "@visitsb/vuex";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
    const {store, state} = useStore()
    const {dispatch} = useContext(StoreContext)

    useEffect(() => {
        dispatch('getAllMessages')
    }, [])

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StoreContext.Provider value={store}>
                <StateContext.Provider value={state}>
                    <RootNavigator/>
                </StateContext.Provider>
            </StoreContext.Provider>
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Modal" component={ModalScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
    const colorScheme = useColorScheme();
    const {currentThread} = mapGetters(['currentThread']);

    return (
        <BottomTab.Navigator
            initialRouteName="Threads"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}>
            <BottomTab.Screen
                name="Threads"
                component={TabOneScreen}
                options={({navigation}: RootTabScreenProps<'Threads'>) => ({
                    title: 'Threads',
                    tabBarIcon: ({color}) => <TabBarIcon name="list" color={color}/>,
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate('Modal')}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <FontAwesome
                                name="info-circle"
                                size={25}
                                color={Colors[colorScheme].text}
                                style={{marginRight: 15}}
                            />
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="Messages"
                component={MessagesScreen}
                options={({navigation}: RootTabScreenProps<'Messages'>) => ({
                    title: currentThread().name,
                    tabBarIcon: ({color}) => <TabBarIcon name="comments-o" color={color}/>,
                    headerLeft: () => (
                        <Pressable
                            onPress={() => navigation.goBack()}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <FontAwesome
                                name="angle-left"
                                size={30}
                                color={Colors[colorScheme].text}
                                style={{marginLeft: 15}}
                            />
                        </Pressable>
                    )
                })}
            />
        </BottomTab.Navigator>
    );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={30} style={{marginBottom: -3}} {...props} />;
}
