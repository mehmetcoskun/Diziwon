import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Icons
import * as Icon from '../components/icons';

export default function SearchItem(props) {
    const { id, type, title, backdrop, navigation } = props;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
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
            <ImageBackground
                source={{ uri: backdrop }}
                style={styles.backdrop}
                imageStyle={{ borderRadius: 5, resizeMode: 'stretch' }}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View activeOpacity={0.5} style={styles.playButton}>
                <Icon.PlayOutline width={40} height={40} fill="white" />
            </View>
        </TouchableOpacity>
    );
}

SearchItem.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    backdropWithTitle: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        marginHorizontal: 7,
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        width: 110,
        height: 70,
    },
    infoContainer: {
        marginLeft: 17,
        marginRight: 17,
        flex: 8,
    },
    title: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        fontFamily: 'NunitoBold',
    },
    playButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
