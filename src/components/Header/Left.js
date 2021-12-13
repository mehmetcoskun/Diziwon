import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Icons
import * as Icon from '../icons';

export default function Left({ navigation }) {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Home')}
        >
            <Icon.Logo style={styles.logo} />
        </TouchableOpacity>
    );
}

Left.propTypes = {
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    logo: {
        width: 50,
        height: 50,
    },
});
