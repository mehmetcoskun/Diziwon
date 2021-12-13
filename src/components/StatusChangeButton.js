import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    Alert,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Apollo
import { useQuery, useMutation } from 'react-apollo';

// Queries
import { getUserDetail, setUserStatus } from '../queries';

export default function StatusChangeButton(props) {
    const { id, navigation } = props;

    const { data } = useQuery(getUserDetail, {
        variables: {
            id,
        },
    });

    const [setStatus] = useMutation(setUserStatus);

    return (
        <View>
            {data?.getUserDetail?.status == 'pending' && (
                <TouchableOpacity
                    onPress={() => {
                        setStatus({
                            variables: {
                                id,
                                status: 'active',
                            },
                        }).then(() => {
                            navigation.goBack();
                            if (Platform.OS == 'ios') {
                                Alert.alert('Kullanıcı hesabı onaylandı.');
                            } else if (Platform.OS == 'android') {
                                ToastAndroid.show(
                                    'Kullanıcı hesabı onaylandı.',
                                    ToastAndroid.SHORT
                                );
                            }
                        });
                    }}
                >
                    <Text style={styles.confirmButton}>Onayla</Text>
                </TouchableOpacity>
            )}
            {data?.getUserDetail?.status == 'active' && (
                <TouchableOpacity
                    onPress={() => {
                        setStatus({
                            variables: {
                                id,
                                status: 'inactive',
                            },
                        }).then(() => {
                            navigation.goBack();
                            if (Platform.OS == 'ios') {
                                Alert.alert('Kullanıcı hesabı engellendi.');
                            } else if (Platform.OS == 'android') {
                                ToastAndroid.show(
                                    'Kullanıcı engellendi.',
                                    ToastAndroid.SHORT
                                );
                            }
                        });
                    }}
                >
                    <Text style={styles.banButton}>Engelle</Text>
                </TouchableOpacity>
            )}
            {data?.getUserDetail?.status == 'inactive' && (
                <TouchableOpacity
                    onPress={() => {
                        setStatus({
                            variables: {
                                id,
                                status: 'active',
                            },
                        }).then(() => {
                            navigation.goBack();
                            if (Platform.OS == 'ios') {
                                Alert.alert('Kullanıcının engeli kaldırıldı.');
                            } else if (Platform.OS == 'android') {
                                ToastAndroid.show(
                                    'Kullanıcının engeli kaldırıldı.',
                                    ToastAndroid.SHORT
                                );
                            }
                        });
                    }}
                >
                    <Text style={styles.removeBanButton}>Engeli Kaldır</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

StatusChangeButton.propTypes = {
    id: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    confirmButton: {
        color: '#32ff7e',
        fontSize: 15,
        fontWeight: 'bold',
    },
    banButton: {
        color: '#f44336',
        fontSize: 15,
        fontWeight: 'bold',
        fontFamily: 'AktifoBBlack',
    },
    removeBanButton: {
        color: '#32ff7e',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
