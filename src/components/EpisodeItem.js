import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Icons
import * as Icon from './icons';

export default function EpisodeItem(props) {
    const {
        episodeBackdrop,
        episodeTitle,
        episodeMinute,
        episodeSummary,
        onDownloadPress,
        ...other
    } = props;
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <TouchableOpacity {...other} activeOpacity={0.9}>
                    <ImageBackground
                        source={episodeBackdrop}
                        style={styles.episodeBackdrop}
                        imageStyle={{ borderRadius: 5 }}
                    >
                        <Icon.PlayOutline width={30} height={30} fill="white" />
                    </ImageBackground>
                </TouchableOpacity>
                <View style={styles.episodeInfoContainer}>
                    <Text style={styles.episodeTitle}>{episodeTitle}</Text>
                    <Text style={styles.episodeMinute}>{episodeMinute}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.downloadButton}
                    onPress={onDownloadPress}
                >
                    <Icon.Download width={24} height={24} fill="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.summaryContainer}>
                <Text style={styles.episodeSummary}>{episodeSummary}</Text>
            </View>
        </View>
    );
}

EpisodeItem.propTypes = {
    episodeBackdrop: PropTypes.object.isRequired,
    episodeTitle: PropTypes.string.isRequired,
    episodeMinute: PropTypes.string.isRequired,
    episodeSummary: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    onDownloadPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 17,
        marginHorizontal: 7,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'row',
        marginRight: 10,
    },
    episodeBackdrop: {
        width: 140,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    episodeInfoContainer: {
        marginLeft: 17,
        marginRight: 17,
        flex: 8,
        justifyContent: 'center',
    },
    episodeTitle: {
        color: 'white',
        fontSize: 16,
    },
    episodeMinute: {
        color: '#797979',
    },
    downloadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    summaryContainer: {
        marginTop: 5,
    },
    episodeSummary: {
        color: '#898989',
    },
});
