import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Store
import { store } from '../store';

// Components
import Header from '../components/Header';

// Icons
import * as Icon from '../components/icons';

// Views
import More from './More';

function Download({ navigation }) {
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
        <>
            <SafeAreaView>
                <Header
                    headerLeft={
                        <Text style={styles.headerTitle}>İndirilenler</Text>
                    }
                    navigation={navigation}
                    style={{ marginVertical: 20 }}
                />
            </SafeAreaView>
            <View style={styles.emptyPageContainer}>
                <View style={styles.pageCenterIconContainer}>
                    <Icon.Download fill="#474747" width={60} height={60} />
                </View>
                <Text style={styles.emptyPageTitle}>
                    Asla Diziwon'suz kalmayın
                </Text>
                <Text style={styles.emptyPageText}>
                    Film ve dizileri indirin, çevrimdışı olduğunuzda bile
                    izleyecek bir şeyleriniz olsun.
                </Text>
                <TouchableOpacity
                    style={styles.emptyPageButton}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.emptyPageButtonText}>
                        İndirebiliceklerinizi Görün
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const Stack = createStackNavigator();

export default function DownloadStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Download" component={Download} />
            <Stack.Screen name="More" component={More} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'AktifoBBlack',
    },
    emptyPageContainer: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    pageCenterIconContainer: {
        backgroundColor: '#121212',
        width: 150,
        height: 150,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    emptyPageTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 23,
        marginBottom: 10,
    },
    emptyPageText: {
        color: '#B3B3B3',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    emptyPageButton: {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
    },
    emptyPageButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
