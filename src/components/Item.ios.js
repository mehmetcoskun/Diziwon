import React, { useState } from 'react';
import { StyleSheet, Image, TouchableHighlight } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// NetInfo
import NetInfo from '@react-native-community/netinfo';

export default function Item(props) {
    const { id, type, title, poster, navigation, style } = props;

    const [connection, setConnection] = useState(true);

    NetInfo.addEventListener((state) => {
        connection !== state.isConnected && setConnection(state.isConnected);
    });

    return (
        <TouchableHighlight
            style={styles.container}
            onPress={() =>
                navigation.navigate(
                    type == 'movie' ? 'MovieDetail' : 'SeriesDetail',
                    {
                        id,
                        title: title == null ? original_title : title,
                    }
                )
            }
        >
            <Image
                style={[{ ...style }, { borderRadius: 5 }]}
                source={{ uri: poster }}
                resizeMode="stretch"
            />
        </TouchableHighlight>
    );
}

Item.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
    style: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 18,
        marginLeft: 6,
    },
});
