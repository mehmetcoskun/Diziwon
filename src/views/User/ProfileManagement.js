import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
    Alert,
    TextInput,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Apollo
import { useMutation } from 'react-apollo';

// MobX
import { observer } from 'mobx-react';

// Store
import { store } from '../../store';

// Types
import {
    SET_USER_AVATAR,
    SET_USER_TEMP_AVATAR,
    SET_USER_FULL_NAME,
} from '../../store/types';

// Queries
import { updateUser } from '../../queries';

// Views
import AvatarManagement from './AvatarManagement';

const ProfileManagement = observer(({ navigation }) => {
    const [fullName, setFullName] = useState(store.user.full_name);
    const [repeatMutation, setRepeatMutation] = useState(false);

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
    }, [isFocused, store.connection]);

    const [setUser, { loading, error, data }] = useMutation(updateUser);

    if (data) {
        if (data.avatar !== store.user.avatar) {
            store.setStore(SET_USER_AVATAR, data.updateUser.avatar);
        }

        if (data.full_name !== store.user.full_name) {
            store.setStore(SET_USER_FULL_NAME, data.updateUser.full_name);
        }
    }

    const _onPress = () => {
        setRepeatMutation(false);

        if (
            store.user.temp_avatar === null &&
            fullName === store.user.full_name
        ) {
            if (Platform.OS == 'ios') {
                Alert.alert('Profil değişiklikleri kaydedilmedi');
            } else if (Platform.OS == 'android') {
                ToastAndroid.show(
                    'Profil değişiklikleri kaydedilmedi',
                    ToastAndroid.SHORT
                );
            }
        }

        if (fullName !== store.user.full_name) {
            setUser({ variables: { id: store.user.id, full_name: fullName } });
            if (Platform.OS == 'ios') {
                Alert.alert('Profil değişiklikleri kaydedildi');
            } else if (Platform.OS == 'android') {
                ToastAndroid.show(
                    'Profil değişiklikleri kaydedildi',
                    ToastAndroid.SHORT
                );
            }
        }

        if (store.user.temp_avatar !== null) {
            setUser({
                variables: {
                    id: store.user.id,
                    avatar: store.user.temp_avatar,
                    full_name: fullName,
                },
            });
            store.setStore(SET_USER_TEMP_AVATAR, null);
            if (Platform.OS == 'ios') {
                Alert.alert('Profil değişiklikleri kaydedildi');
            } else if (Platform.OS == 'android') {
                ToastAndroid.show(
                    'Profil değişiklikleri kaydedildi',
                    ToastAndroid.SHORT
                );
            }
        }
    };

    if (error && !repeatMutation) {
        setRepeatMutation(true);
        if (Platform.OS == 'ios') {
            Alert.alert(error.message.replace('GraphQL error: ', ''));
        } else if (Platform.OS == 'android') {
            ToastAndroid.show(
                error.message.replace('GraphQL error: ', ''),
                ToastAndroid.SHORT
            );
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.headerButtonText}>İptal</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => _onPress()}
                >
                    <Text style={styles.headerButtonText}>Kaydet</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, fullName]);

    return loading ? (
        <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="white" />
        </View>
    ) : (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.avatarContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AvatarManagement')}
                    style={{ alignItems: 'center' }}
                >
                    <ImageBackground
                        source={{
                            uri:
                                store.user.temp_avatar === null
                                    ? store.user.avatar?.startsWith('http')
                                        ? store.user.avatar
                                        : store.settings.assets_url +
                                          '/avatars' +
                                          store.user.avatar
                                    : store.settings.assets_url +
                                      '/avatars' +
                                      store.user.temp_avatar,
                        }}
                        style={styles.avatar}
                        imageStyle={{ borderRadius: 5 }}
                    />
                    <Text style={styles.avatarChangeText}>Değiştir</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    value={fullName}
                    onChangeText={(text) => setFullName(text)}
                    style={styles.input}
                />
            </View>
            <View>
                <View style={styles.bodyDisableButton}>
                    <Text style={styles.bodyDisableButtonText}>
                        TÜM YETİŞKİNLİK DÜZEYLERİ
                    </Text>
                </View>
                <View style={{ marginHorizontal: 10 }}>
                    <Text style={styles.bodyText}>
                        Bu profilde{' '}
                        <Text style={{ fontWeight: 'bold', color: 'white' }}>
                            tüm yetişkinlik düzeylerindeki
                        </Text>{' '}
                        içerikleri göster.
                    </Text>
                </View>
            </View>
        </View>
    );
});

const Stack = createStackNavigator();

export default function ProfileManagementStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'black',
                },
            }}
        >
            <Stack.Screen
                name="ProfileManagement"
                component={ProfileManagement}
                options={{
                    title: 'Profili Düzenle',
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontSize: 18,
                        fontWeight: '400',
                    },
                }}
            />
            <Stack.Screen
                name="AvatarManagement"
                component={AvatarManagement}
                options={{
                    title: 'Simge Seçin',
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
        alignItems: 'center',
        marginTop: 20,
    },
    avatar: {
        width: 110,
        height: 110,
    },
    avatarChangeText: {
        color: 'white',
        fontSize: 18,
        marginTop: 10,
    },
    headerButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginVertical: 20,
        marginHorizontal: 50,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyDisableButton: {
        backgroundColor: '#363636',
        marginHorizontal: 70,
        padding: 9,
        borderRadius: 4,
        marginBottom: 5,
    },
    bodyDisableButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#B3B3B3',
    },
    input: {
        height: 50,
        marginBottom: 15,
        paddingLeft: 20,
        color: 'white',
        borderColor: 'white',
        borderWidth: 1,
    },
});
