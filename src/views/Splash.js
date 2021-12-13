import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

// Icons
import * as Icon from '../components/icons';

export default function Splash() {
    return (
        <View style={styles.container}>
            <View style={styles.logoarea}>
                <Icon.Logo style={styles.logo} />
                <ActivityIndicator size="large" color="white" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    logoarea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 200,
        width: 200,
        marginBottom: 50,
    },
});
