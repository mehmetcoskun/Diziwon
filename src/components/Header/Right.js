import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// React Navigation
import { useRoute } from '@react-navigation/native';

// MobX
import { observer } from 'mobx-react';

// Store
import { store } from '../../store';

const Right = observer(({ navigation }) => {
    const route = useRoute();

    return (
        <TouchableOpacity
            onPress={() => {
                route.name != 'More' && navigation.navigate('More');
            }}
        >
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
        </TouchableOpacity>
    );
});

Right.propTypes = {
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    avatar: {
        width: 24,
        height: 24,
    },
});

export default Right;
