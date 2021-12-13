import React, { useState, useEffect, createRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    Platform,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Expo
import { LinearGradient } from 'expo-linear-gradient';

// NetInfo
import NetInfo from '@react-native-community/netinfo';

// Apollo
import { useQuery } from 'react-apollo';

// Queries
import { getSeriesQuery } from '../queries';

// Components
import BottomPopup from '../components/BottomPopup';

// Icons
import * as Icon from '../components/icons';

export default function KeepWatchingItem(props) {
    const {
        id,
        season,
        episode,
        type,
        title,
        poster,
        userId,
        navigation,
        refreshing,
        style,
    } = props;
    const [connection, setConnection] = useState(true);
    const [datas, setDatas] = useState();
    const [currentData, setCurrentData] = useState();

    const bottomPopup = createRef();

    NetInfo.addEventListener((state) => {
        connection !== state.isConnected && setConnection(state.isConnected);
    });

    const { data } = useQuery(getSeriesQuery, {
        variables: {
            id,
        },
    });

    const getNext = () => {
        let nextItem = datas?.find(
            (item) => item.season == season && item.episode == episode + 1
        );

        if (!nextItem) {
            nextItem = datas?.find(
                (item) => item.season == season + 1 && item.episode == 1
            );
        }

        if (!!nextItem) return nextItem;
    };

    useEffect(() => {
        setDatas(data?.series?.watch);
    }, [data]);

    useEffect(() => {
        setCurrentData(
            datas?.find(
                (item) => item.season == season && item.episode == episode
            )
        );
    }, [datas, season, episode]);

    const onPressBottomPopup = () => {
        bottomPopup.current.open();

        if (!connection) {
            if (Platform.OS == 'ios') {
                Alert.alert(
                    'Bazı bilgiler yüklenemedi. Lütfen yeniden deneyin.'
                );
            } else {
                ToastAndroid.show(
                    'Bazı bilgiler yüklenemedi. Lütfen yeniden deneyin.',
                    ToastAndroid.SHORT
                );
            }
            setTimeout(() => {
                bottomPopup.current.close();
            }, 500);
        }
    };

    return (
        <TouchableHighlight style={styles.container}>
            <>
                <BottomPopup
                    bottomPopupRef={bottomPopup}
                    id={id}
                    title={title}
                    getNext={getNext}
                    userId={userId}
                    navigation={navigation}
                    refreshing={refreshing}
                />
                <ImageBackground
                    source={{ uri: poster }}
                    style={[
                        { ...style },
                        {
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                    imageStyle={{
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                    }}
                    resizeMode="stretch"
                >
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Player', {
                                uri:
                                    currentData?.link_subtitle == null
                                        ? currentData?.link_dugging
                                        : currentData?.link_subtitle,
                            })
                        }
                    >
                        <Icon.PlayOutline width={50} height={50} fill="white" />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,10.5)']}
                        style={[StyleSheet.absoluteFillObject, { top: 115 }]}
                    >
                        <Text style={styles.title}>
                            {season}.S:B{episode}
                        </Text>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.bottomMenuContainer}>
                    <View style={styles.bottomMenu}>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate(
                                    type == 'movie'
                                        ? 'MovieDetail'
                                        : 'SeriesDetail',
                                    {
                                        id,
                                        title:
                                            title == null
                                                ? original_title
                                                : title,
                                    }
                                )
                            }
                        >
                            <Icon.Info fill="#B3B3B3" width={20} height={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPressBottomPopup()}>
                            <Icon.MoreDotVertical />
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        </TouchableHighlight>
    );
}

KeepWatchingItem.propTypes = {
    id: PropTypes.string.isRequired,
    season: PropTypes.number.isRequired,
    episode: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    userId: PropTypes.string,
    navigation: PropTypes.any.isRequired,
    refreshing: PropTypes.any,
    style: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 18,
        marginLeft: 6,
    },
    title: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bottomMenuContainer: {
        width: '100%',
        height: 40,
        backgroundColor: '#191919',
    },
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginHorizontal: 10,
        alignItems: 'center',
    },
});
