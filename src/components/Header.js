import React from 'react';
import { StyleSheet, View } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Components
import Left from './Header/Left';
import Right from './Header/Right';

export default function Header({ headerLeft, navigation, style }) {
    return (
        <View style={[styles.container, { ...style }]}>
            {headerLeft ? headerLeft : <Left navigation={navigation} />}
            <View style={styles.rightContainer}>
                <Right navigation={navigation} />
            </View>
        </View>
    );
}

Header.propTypes = {
    headerLeft: PropTypes.any,
    navigation: PropTypes.any.isRequired,
    style: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 15,
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
});
