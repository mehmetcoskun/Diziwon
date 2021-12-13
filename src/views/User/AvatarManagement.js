import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { avatars } from '../../queries';

// Components
import AvatarList from '../../components/AvatarList';

export default function AvatarManagement({ navigation }) {
    const [datas, setDatas] = useState([]);

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

    const { loading, data } = useQuery(avatars);

    useEffect(() => {
        const tempDatas = [];

        data?.avatars?.forEach(function (item) {
            var existing = tempDatas.filter(function (v, i) {
                return v.avatar_group == item.avatar_group;
            });
            if (existing.length) {
                var existingIndex = tempDatas.indexOf(existing[0]);
                tempDatas[existingIndex].uri = tempDatas[
                    existingIndex
                ].uri.concat(item.uri);
            } else {
                tempDatas.push({
                    avatar_group: item.avatar_group,
                    uri: typeof item.uri == 'string' ? [item.uri] : item.uri,
                });
            }
        });

        setDatas(tempDatas);
    }, [loading, data]);

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
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <AvatarList datas={datas} navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    headerButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
