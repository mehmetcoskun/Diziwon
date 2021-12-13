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
    ActivityIndicator,
    Platform,
    ToastAndroid,
} from 'react-native';

// Expo
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

// Apollo
import { Mutation } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { register } from '../../queries';

// Icons
import * as Icon from '../../components/icons';

export default function Register({ navigation }) {
    const [fullName, setFullName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordShow, setPasswordShow] = useState(true);
    const [errorShow, setErrorShow] = useState(false);

    const email_ref = useRef();
    const password_ref = useRef();

    const onRegister = (register) => {
        setErrorShow(false);
        if (!fullName || !email || !password) {
            if (Platform.OS == 'ios') {
                Alert.alert('Lütfen boş alanları doldurun.');
            } else if (Platform.OS == 'android') {
                ToastAndroid.show(
                    'Lütfen boş alanları doldurun.',
                    ToastAndroid.SHORT
                );
            }
        } else {
            if (
                email.includes('@hotmail.') ||
                email.includes('@outlook.') ||
                email.includes('@gmail.') ||
                email.includes('@yahoo.') ||
                email.includes('@yandex.') ||
                email.includes('@mynet.') ||
                email.includes('@mail.ru')
            ) {
                register({
                    variables: {
                        avatar: `/classics/${
                            Math.floor(Math.random() * 19) + 1
                        }.png`,
                        full_name: fullName,
                        email: email.trim(),
                        password,
                        last_active: 'Register',
                        device_brand: store.user.device_brand,
                        device_model: store.user.device_model,
                        device_os_version: store.user.device_os_version,
                        app_version: Constants.manifest.version,
                    },
                }).then(() => {
                    Alert.alert('E-Posta Kutunuzu Kontrol Edin!');
                });
            } else {
                Alert.alert('Lütfen geçerli bir e-posta adresi girin.');
            }
        }
    };

    return (
        <Mutation mutation={register}>
            {(register, { loading, error, data }) => {
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
                                        onPress={() => navigation.goBack()}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: 'white' }}>
                                            GİRİŞ YAP
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
                                <Text style={styles.formTitle}>Kayıt Ol</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        placeholderTextColor="#a3a3a3"
                                        placeholder="Ad Soyadı"
                                        returnKeyType="next"
                                        value={fullName}
                                        onChangeText={(text) =>
                                            setFullName(text)
                                        }
                                        onSubmitEditing={() =>
                                            email_ref.current.focus()
                                        }
                                    />
                                    <Icon.Profile
                                        width={24}
                                        height={24}
                                        stroke={'#DB2424'}
                                        style={styles.icon}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        autoCorrect={false}
                                        placeholderTextColor="#a3a3a3"
                                        placeholder="E-Posta Adresi"
                                        value={email}
                                        ref={email_ref}
                                        onChangeText={(text) => setEmail(text)}
                                        returnKeyType="next"
                                        autoCapitalize="none"
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
                                        ref={password_ref}
                                        secureTextEntry={passwordShow}
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
                                    style={styles.submitButton}
                                    onPress={() => onRegister(register)}
                                >
                                    <Text style={styles.submitButtonText}>
                                        Kayıt Ol
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
        height: 350,
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
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        margin: 10,
    },
});
