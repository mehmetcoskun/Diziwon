import React, { useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Alert,
    Linking,
    ActivityIndicator,
    AsyncStorage,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';

// Expo
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Apollo
import { Mutation, useQuery } from 'react-apollo';

// Store
import { store } from '../../store';

// Types
import { SET_TOKEN } from '../../store/types';

// Queries
import { Settings, login } from '../../queries';

// Icons
import * as Icon from '../../components/icons';

// Views
import Home from '../Home';
import Register from './Register';

function Login({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordShow, setPasswordShow] = useState(true);
    const [errorShow, setErrorShow] = useState(false);

    const password_ref = useRef();

    const { data: SettingsData } = useQuery(Settings);

    const onLogin = (login) => {
        setErrorShow(false);
        if (!email || !password) {
            Alert.alert('Lütfen boş alanları doldurun.');
        } else {
            if (Platform.OS == 'ios') {
                login({
                    variables: {
                        email,
                        password,
                        device_brand: store.user.device_brand,
                        device_model: store.user.device_model,
                        device_os_version: store.user.device_os_version,
                        app_version: Constants.manifest.version,
                    },
                });
            } else if (Platform.OS == 'android') {
                login({
                    variables: {
                        email,
                        password,
                        device_brand: store.user.device_brand,
                        device_model: store.user.device_model,
                        device_os_version: store.user.device_os_version,
                        app_version: Constants.manifest.version,
                    },
                }).then(() => {
                    ToastAndroid.show('Oturum Açıldı', ToastAndroid.SHORT);
                });
            }
        }
    };

    return (
        <Mutation mutation={login}>
            {(login, { loading, error, data }) => {
                if (data && data.login) {
                    AsyncStorage.setItem('token', data.login.token).then(() => {
                        store.setStore(SET_TOKEN, data.login.token);
                    });
                }

                if (error && !errorShow) {
                    setErrorShow(true);
                    if (Platform.OS == 'ios') {
                        Alert.alert(
                            error.message.replace('GraphQL error: ', '')
                        );
                    } else if (Platform.OS == 'android') {
                        ToastAndroid.show(
                            error.message.replace('GraphQL error: ', ''),
                            ToastAndroid.SHORT
                        );
                    }
                }

                return loading ? (
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) : (
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        style={styles.container}
                    >
                        <ScrollView
                            contentContainerStyle={{ flex: 1 }}
                            bounces={false}
                        >
                            <ImageBackground
                                source={require('../../../assets/auth_background.png')}
                                style={{ flex: 1 }}
                            >
                                <View style={styles.header}>
                                    <Icon.Logo width={60} height={60} />
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('Register')
                                        }
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: 'white' }}>
                                            ÜYE OL
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <LinearGradient
                                    colors={['transparent', 'rgba(39,40,44,1)']}
                                    style={[
                                        StyleSheet.absoluteFillObject,
                                        { borderRadius: 1 },
                                    ]}
                                />
                            </ImageBackground>
                            <View style={styles.form}>
                                <Text style={styles.formTitle}>Giriş Yap</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        placeholderTextColor="#a3a3a3"
                                        placeholder="E-Posta Adresi"
                                        onChangeText={(text) => setEmail(text)}
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        value={email}
                                        onSubmitEditing={() =>
                                            password_ref.current.focus()
                                        }
                                    />
                                    <Icon.Mail
                                        width={24}
                                        height={24}
                                        fill={'#DB2424'}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        placeholderTextColor="#a3a3a3"
                                        placeholder="Şifre"
                                        secureTextEntry={passwordShow}
                                        ref={password_ref}
                                        returnKeyType="done"
                                        value={password}
                                        onChangeText={(text) =>
                                            setPassword(text)
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            setPasswordShow(!passwordShow)
                                        }
                                    >
                                        {passwordShow == true ? (
                                            <Icon.ClosedEye
                                                width={24}
                                                height={24}
                                                stroke={'#DB2424'}
                                                style={styles.icon}
                                            />
                                        ) : (
                                            <Icon.OpenEye
                                                width={24}
                                                height={24}
                                                stroke={'#DB2424'}
                                                style={styles.icon}
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    style={styles.forgotPasswordButton}
                                    onPress={() =>
                                        Linking.openURL(
                                            SettingsData?.Settings
                                                ?.password_reset_url
                                        )
                                    }
                                >
                                    <Text style={{ color: '#a3a3a3' }}>
                                        Şifremi Unuttum?
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.submitButton}
                                    onPress={() => onLogin(login)}
                                >
                                    <Text style={styles.submitButtonText}>
                                        Giriş Yap
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                );
            }}
        </Mutation>
    );
}

const Stack = createStackNavigator();

export default function LoginStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="Login"
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#27282c',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginTop: 30,
        marginRight: 20,
        zIndex: 999,
        alignItems: 'center',
    },
    form: {
        height: 320,
        margin: 20,
        paddingTop: 20,
    },
    formTitle: {
        color: 'white',
        fontSize: 30,
        fontWeight: '600',
        marginBottom: 20,
        fontFamily: 'NunitoBlack',
    },
    inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#4e4e4e',
        alignItems: 'center',
    },
    input: {
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 18,
        fontWeight: '500',
        flex: 1,
        color: 'white',
    },
    submitButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#DB2424',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    submitButtonText: {
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
    },
    forgotPasswordButton: {
        flex: 1,
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        margin: 10,
    },
});
