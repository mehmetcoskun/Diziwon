import React, { useRef, useEffect } from 'react';
import { StatusBar, Alert, Platform, ToastAndroid } from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// WebView
import WebView from 'react-native-webview';

// Expo
import * as ScreenOrientation from 'expo-screen-orientation';

// Store
import { store } from '../store';

export default function Player({ route, navigation }) {
    const { uri } = route.params;

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

    const webviewRef = useRef(null);

    useEffect(() => {
        if (uri.includes('iframe')) {
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
            );
        }
    }, [uri]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar hidden={true} />
            <WebView
                source={{
                    uri: `https:${uri}`,
                }}
                userAgent={store.settings.useragent}
                ref={webviewRef}
            />
        </SafeAreaView>
    );
}
