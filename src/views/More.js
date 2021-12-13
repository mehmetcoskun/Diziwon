import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    AsyncStorage,
    Linking,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Expo
import Constants from 'expo-constants';

// NetInfo
import NetInfo from '@react-native-community/netinfo';

// Base64
import base64 from 'react-native-base64';

// MobX
import { observer } from 'mobx-react';

// Store
import { store } from '../store';

// Types
import { SET_TOKEN } from '../store/types';

// Components
import Header from '../components/Header';
import MoreMenu from '../components/MoreMenu';

// Icons
import * as Icon from '../components/icons';

// Views
import Users from './ManagementPanel/Users';
import ProfileManagement from './User/ProfileManagement';
import Request from './Request';

const More = observer(({ navigation }) => {
    const [connection, setConnection] = useState(true);

    NetInfo.addEventListener((state) => {
        connection !== state.isConnected && setConnection(state.isConnected);
    });

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            if (store.connection === false) {
                navigation.goBack();
                if (Platform.OS == 'ios') {
                    Alert.alert(
                        'Bazı bilgiler yüklenemedi. Lütfen yeniden deneyin.'
                    );
                } else if (Platform.OS == 'android') {
                    ToastAndroid.show(
                        'Bazı bilgiler yüklenemedi. Lütfen yeniden deneyin.',
                        ToastAndroid.SHORT
                    );
                }
            }
        }
    }, [isFocused]);

    return (
        <SafeAreaView>
            <Header
                headerLeft={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon.BackArrow width={18} height={18} />
                    </TouchableOpacity>
                }
                navigation={navigation}
                style={{ marginTop: 15 }}
            />
            <View style={styles.avatarContainer}>
                <Image
                    source={{
                        uri: store.user.avatar?.startsWith('http')
                            ? store.user.avatar
                            : store.settings.assets_url +
                              '/avatars' +
                              store.user.avatar,
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{store.user.full_name}</Text>
            </View>
            <TouchableOpacity
                style={styles.profileManagementButton}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('ProfileManagement')}
            >
                <Icon.Pencil fill="#909090" width={15} height={15} />
                <Text style={styles.profileManagementButtonText}>
                    Profil Yönetimi
                </Text>
            </TouchableOpacity>
            <ScrollView>
                <View>
                    {connection && store.user.authority != 'user' && (
                        <MoreMenu onPress={() => navigation.navigate('Users')}>
                            <Icon.ManageUser
                                width={24}
                                height={24}
                                fill="#B3B3B3"
                            />
                            <Text style={styles.menuItemText}>Üyeler</Text>
                        </MoreMenu>
                    )}
                    {connection && (
                        <MoreMenu
                            onPress={() => navigation.navigate('Request')}
                        >
                            <Icon.Request
                                width={24}
                                height={24}
                                fill="#B3B3B3"
                            />
                            <Text style={styles.menuItemText}>
                                İstek Gönder
                            </Text>
                        </MoreMenu>
                    )}
                    <MoreMenu
                        onPress={() => navigation.navigate('MyWatchList')}
                    >
                        <Icon.Checkmark width={24} height={24} fill="#B3B3B3" />
                        <Text style={styles.menuItemText}>Listem</Text>
                    </MoreMenu>
                    <MoreMenu
                        onPress={() => {
                            Linking.openURL(
                                store.settings.user_account_url?.replace(
                                    '%q%',
                                    base64.encode(
                                        store.user.id +
                                            '-' +
                                            parseInt(Date.now() / 1000)
                                    )
                                )
                            );
                        }}
                    >
                        <Icon.Profile width={24} height={24} stroke="#B3B3B3" />
                        <Text style={styles.menuItemText}>Hesap</Text>
                    </MoreMenu>
                    <MoreMenu
                        onPress={() => Linking.openURL(store.settings.help_url)}
                    >
                        <Icon.Help width={24} height={24} />
                        <Text style={styles.menuItemText}>Yardım</Text>
                    </MoreMenu>
                </View>
                <View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.logoutButton}
                        onPress={() => {
                            Alert.alert(
                                'Oturumu Kapat',
                                'Oturumu kapatmak istiyor musunuz?',
                                [
                                    {
                                        text: 'Hayır',
                                    },
                                    {
                                        text: 'Evet',
                                        onPress: () =>
                                            AsyncStorage.removeItem(
                                                'token'
                                            ).then(() => {
                                                store.setStore(SET_TOKEN, null);
                                            }),
                                    },
                                ]
                            );
                        }}
                    >
                        <Text style={styles.logoutButtonText}>
                            Oturumu Kapat
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.versionText}>
                        Versiyon: {Constants.manifest.version}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
});

const Stack = createStackNavigator();

export default function MoreStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                headerStyle: {
                    backgroundColor: 'black',
                },
            }}
        >
            <Stack.Screen name="More" component={More} />
            <Stack.Screen name="Users" component={Users} />
            <Stack.Screen
                name="ProfileManagement"
                component={ProfileManagement}
            />
            <Stack.Screen
                name="Request"
                component={Request}
                options={{
                    headerShown: true,
                    title: 'İstek Gönder',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '400',
                    },
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 2,
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        margin: 10,
    },
    profileManagementButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    profileManagementButtonText: {
        color: '#B3B3B3',
        marginLeft: 10,
        fontSize: 12,
        fontWeight: 'bold',
    },
    menuItemText: {
        color: '#B3B3B3',
        fontSize: 16,
        marginLeft: 15,
    },
    logoutButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    logoutButtonText: {
        color: '#909090',
        fontSize: 18,
    },
    versionText: {
        color: '#555555',
        alignSelf: 'center',
        padding: 5,
    },
});
