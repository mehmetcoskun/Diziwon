import React, { useEffect, useState } from 'react';
import { StatusBar, AsyncStorage } from 'react-native';

// React Navigation
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Expo
import * as Device from 'expo-device';
import { useFonts } from 'expo-font';

// NetInfo
import NetInfo from '@react-native-community/netinfo';

// Apollo
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// MobX
import { observer } from 'mobx-react';

// Store
import { store } from './src/store';

// Types
import {
    SET_TOKEN,
    SET_CONNECTION,
    SET_USER_DEVICE_BRAND,
    SET_USER_DEVICE_MODEL,
    SET_USER_DEVICE_OS_VERSION,
} from './src/store/types';

// Icons
import * as Icon from './src/components/icons';

// Views
import Splash from './src/views/Splash';
import Home from './src/views/Home';
import Upcoming from './src/views/Upcoming';
import Search from './src/views/Search';
import Download from './src/views/Download';
import { LoginStack, Register } from './src/views/Auth';

const client = new ApolloClient({
    uri: 'https://diziwon-app.herokuapp.com/graphql',
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default observer(() => {
    useFonts({
        NunitoBold: require('./assets/fonts/Nunito-Bold.ttf'),
        NunitoBlack: require('./assets/fonts/Nunito-Black.ttf'),
        AktifoBBlack: require('./assets/fonts/Aktifo-B-Black.ttf'),
        AktifoBSemiBold: require('./assets/fonts/Aktifo-B-SemiBold.ttf'),
        FreeSansBold: require('./assets/fonts/FreeSansBold.ttf'),
    });

    const [connection, setConnection] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    NetInfo.addEventListener((state) => {
        connection !== state.isConnected && setConnection(state.isConnected);
    });

    useEffect(() => {
        store.setStore(SET_CONNECTION, connection);
    }, [connection]);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('token');

            store.setStore(SET_TOKEN, token);

            store.setStore(SET_USER_DEVICE_BRAND, Device.brand);
            store.setStore(SET_USER_DEVICE_MODEL, Device.modelName);
            store.setStore(SET_USER_DEVICE_OS_VERSION, Device.osVersion);
        })();
    }, []);

    useEffect(() => {
        setInterval(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return <Splash />;
    }

    return (
        <SafeAreaProvider>
            <ApolloProvider client={client}>
                <StatusBar barStyle="light-content" />
                <NavigationContainer theme={DarkTheme}>
                    {store.token === null ? (
                        <></>
                    ) : store.token !== '' ? (
                        <Tab.Navigator
                            initialRouteName="Home"
                            tabBarOptions={{
                                activeTintColor: 'white',
                                keyboardHidesTabBar: true,
                                tabStyle: { padding: 5 },
                                labelStyle: { fontSize: 8 },
                            }}
                        >
                            <Tab.Screen
                                name="Home"
                                component={Home}
                                options={({ route }) => ({
                                    tabBarLabel: 'Ana Sayfa',
                                    tabBarIcon: ({ focused }) => (
                                        focused ? (
                                            <Icon.HomeFilled
                                                width={24}
                                                height={24}
                                                fill="white"
                                            />
                                        ) : (
                                            <Icon.HomeOutline
                                                width={24}
                                                height={24}
                                                fill="gray"
                                            />
                                        )
                                    ),
                                    tabBarVisible: getTabBarVisibility(route),
                                })}
                            />
                            <Tab.Screen
                                name="Upcoming"
                                component={Upcoming}
                                options={{
                                    tabBarLabel: 'Yeni ve Popüler',
                                    tabBarIcon: ({ focused }) => (
                                        focused ? (
                                            <Icon.SoonFilled
                                                width={24}
                                                height={24}
                                                fill="white"
                                            />
                                        ) : (
                                            <Icon.SoonOutline
                                                width={24}
                                                height={24}
                                                fill="gray"
                                            />
                                        )
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Search"
                                component={Search}
                                options={{
                                    tabBarLabel: 'Ara',
                                    tabBarIcon: ({ focused }) => (
                                        <Icon.Search
                                            stroke={focused ? 'white' : 'gray'}
                                            width={24}
                                            height={24}
                                        />
                                    ),
                                }}
                            />
                            <Tab.Screen
                                name="Download"
                                component={Download}
                                options={{
                                    tabBarLabel: 'İndirilenler',
                                    tabBarIcon: ({ focused }) => (
                                        focused ? (
                                            <Icon.DownloadFilled
                                                width={24}
                                                height={24}
                                                fill="white"
                                            />
                                        ) : (
                                            <Icon.DownloadOutline
                                                width={24}
                                                height={24}
                                                fill="gray"
                                            />
                                        )
                                    ),
                                }}
                            />
                        </Tab.Navigator>
                    ) : (
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                            initialRouteName="Login"
                        >
                            <Stack.Screen name="Login" component={LoginStack} />
                            <Stack.Screen
                                name="Register"
                                component={Register}
                            />
                        </Stack.Navigator>
                    )}
                </NavigationContainer>
            </ApolloProvider>
        </SafeAreaProvider>
    );
});

const getTabBarVisibility = (route) => {
    const routeName = route.state
        ? route.state.routes[route.state.index].name
        : '';

    return routeName !== 'Player';
};
