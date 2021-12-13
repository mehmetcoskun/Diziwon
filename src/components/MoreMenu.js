import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Icons
import * as Icon from '../components/icons';

export default function MoreMenu(props) {
    const { children, ...otherProps } = props;
    return (
        <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            {...otherProps}
        >
            {children}
            <View style={styles.menuItemRightIcon}>
                <Icon.RightArrow width={24} height={24} color="#4D4D4D" />
            </View>
        </TouchableOpacity>
    );
}

MoreMenu.propTypes = {
    children: PropTypes.any.isRequired,
    onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    menuItem: {
        backgroundColor: '#121212',
        flexDirection: 'row',
        marginBottom: 2,
        padding: 17,
    },
    menuItemRightIcon: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
