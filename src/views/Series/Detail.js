import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Share,
    Alert,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Native
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Base64
import base64 from 'react-native-base64';

// Expo
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';

// Modal
import Modal from 'react-native-modal';

// Apollo
import { useQuery, useMutation } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import {
    getSeriesQuery,
    incrementCounter,
    getKeepWatchingList,
    controlKeepWatchingList,
    addKeepWatchingList,
    updateKeepWatchingList,
} from '../../queries';

// Components
import EpisodeItem from '../../components/EpisodeItem';
import ToggleWatchListButton from '../../components/ToggleWatchListButton';
import Header from '../../components/Header';

// Icons
import * as Icon from '../../components/icons';

export default function Detail({ route, navigation }) {
    const { id, title } = route.params;

    const [seasons, setSeasons] = useState([]);
    const [seasonsLength, setSeasonsLength] = useState([]);
    const [seasonNumberList, setSeasonNumberList] = useState([]);
    const [seasonModalVisible, setSeasonModalVisible] = useState(false);
    const [activeSeason, setActiveSeason] = useState(1);
    const [activeTabMenu, setActiveTabMenu] = useState(1);
    const [summary, setSummary] = useState();
    const [summaryToggle, setSummaryToggle] = useState(false);

    const shorten = (str, n) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
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
            refetchKeepWatchingList();
        }
    }, [isFocused, store.connection]);

    const share_text = store.settings.share_text?.replace('%title%', title);
    const download_url = store.settings.download_ref_url?.replace(
        '%q%',
        base64.encode(store.user.id + '-' + parseInt(Date.now() / 1000))
    );

    const { loading, data } = useQuery(getSeriesQuery, {
        variables: {
            id,
        },
    });

    const [addCounter] = useMutation(incrementCounter);
    const [addList] = useMutation(addKeepWatchingList);
    const [updateList] = useMutation(updateKeepWatchingList);

    const {
        data: controlKeepWatchingListData,
        refetch: refetchKeepWatchingList,
    } = useQuery(controlKeepWatchingList, {
        variables: {
            user_id: store.user.id,
            _id: id,
        },
    });

    const { data: getKeepWatchingListData } = useQuery(getKeepWatchingList, {
        variables: {
            user_id: store.user.id,
            _id: id,
        },
    });

    useEffect(() => {
        if (controlKeepWatchingListData?.controlKeepWatchingList) {
            setActiveSeason(
                getKeepWatchingListData?.getKeepWatchingList[0]?.season
            );
        }
    }, [controlKeepWatchingListData, getKeepWatchingListData]);

    useEffect(() => {
        addCounter({
            variables: {
                id,
            },
        });
    }, [data]);

    useLayoutEffect(() => {
        data?.series?.watch.map(({ season }) => setSeasonsLength(season));
    }, [loading, data]);

    useEffect(() => {
        setSeasons(() => data?.series?.watch);
    }, [loading, data]);

    var firstEpisode = seasons?.filter(
        (episodes) => episodes.episode == 1 && episodes.season == 1
    )[0];

    useEffect(() => {
        const tempSeasonList = [];

        seasons?.forEach((el) => {
            if (!tempSeasonList.some((f) => f.season === el.season)) {
                tempSeasonList.push(el);
            }
        });

        const tempSeasonNumberList = [];

        tempSeasonList.filter((el) => {
            tempSeasonNumberList.push(el.season);
        });

        setSeasonNumberList(
            tempSeasonNumberList.sort(function (a, b) {
                return a - b;
            })
        );
    }, [seasons]);

    const seasonModalToggle = () => {
        setSeasonModalVisible(!seasonModalVisible);
    };

    const _Share = async () => {
        await Share.share({
            message: share_text + ' ' + download_url,
            url: download_url,
        });
    };

    const renderItemSubtitle = ({
        item: { season, episode, link_subtitle, name, overview, still_path },
    }) => (
        <EpisodeItem
            episodeBackdrop={
                still_path == null
                    ? {
                          uri: data?.series?.backdrop,
                      }
                    : {
                          uri: still_path,
                      }
            }
            episodeTitle={!name ? episode + '. Bölüm' : episode + '. ' + name}
            episodeMinute={data?.series?.runtime}
            episodeSummary={!overview ? 'Bölüm özeti bulunamadı' : overview}
            onPress={() => {
                if (controlKeepWatchingListData?.controlKeepWatchingList) {
                    updateList({
                        variables: {
                            user_id: store.user.id,
                            _id: id,
                            season: parseInt(season),
                            episode: parseInt(episode),
                        },
                    }).then(() => {
                        navigation.navigate('Player', {
                            uri: link_subtitle,
                        });
                    });
                } else {
                    addList({
                        variables: {
                            user_id: store.user.id,
                            _id: id,
                            season: parseInt(season),
                            episode: parseInt(episode),
                        },
                    }).then(() => {
                        navigation.navigate('Player', {
                            uri: link_subtitle,
                        });
                    });
                }
            }}
            onDownloadPress={() => {
                navigation.navigate('Player', {
                    uri: link_subtitle.replace('iframe', 'download'),
                });
            }}
        />
    );

    const renderItemDugging = ({
        item: { season, episode, link_dugging, name, overview, still_path },
    }) => (
        <EpisodeItem
            episodeBackdrop={
                still_path == null
                    ? {
                          uri: data?.series?.backdrop,
                      }
                    : {
                          uri: still_path,
                      }
            }
            episodeTitle={!name ? episode + '. Bölüm' : name}
            episodeMinute={data?.series?.runtime}
            episodeSummary={!overview ? 'Bölüm özeti bulunamadı' : overview}
            onPress={() => {
                if (controlKeepWatchingListData?.controlKeepWatchingList) {
                    updateList({
                        variables: {
                            user_id: store.user.id,
                            _id: id,
                            season: parseInt(season),
                            episode: parseInt(episode),
                        },
                    }).then(() => {
                        navigation.navigate('Player', {
                            uri: link_dugging,
                        });
                    });
                } else {
                    addList({
                        variables: {
                            user_id: store.user.id,
                            _id: id,
                            season: parseInt(season),
                            episode: parseInt(episode),
                        },
                    }).then(() => {
                        navigation.navigate('Player', {
                            uri: link_dugging,
                        });
                    });
                }
            }}
            onDownloadPress={() => {
                navigation.navigate('Player', {
                    uri: link_dugging.replace('iframe', 'download'),
                });
            }}
        />
    );

    const headerComponent = () => (
        <View style={styles.container}>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,10.5)']}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 1 }]}
            />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.imdbRating}>
                        %{data?.series?.imdb_rating.split('.')} eşleşme
                    </Text>
                    <Text style={styles.year}>{data?.series?.year}</Text>
                    <View style={styles.maturityContainer}>
                        <Text style={styles.maturity}>
                            {data?.series?.maturity}
                        </Text>
                    </View>
                    <Text style={{ color: 'white', marginLeft: 10 }}>
                        {data?.series?.runtime}
                    </Text>
                    <View style={styles.resolutionContainer}>
                        <Text style={styles.resolution}>HD</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => {
                    if (controlKeepWatchingListData?.controlKeepWatchingList) {
                        updateList({
                            variables: {
                                user_id: store.user.id,
                                _id: id,
                                season: 1,
                                episode: 1,
                            },
                        }).then(() => {
                            navigation.navigate('Player', {
                                uri:
                                    firstEpisode?.link_subtitle == null
                                        ? firstEpisode?.link_dugging
                                        : firstEpisode?.link_subtitle,
                            });
                        });
                    } else {
                        addList({
                            variables: {
                                user_id: store.user.id,
                                _id: id,
                                season: 1,
                                episode: 1,
                            },
                        }).then(() => {
                            navigation.navigate('Player', {
                                uri:
                                    firstEpisode?.link_subtitle == null
                                        ? firstEpisode?.link_dugging
                                        : firstEpisode?.link_subtitle,
                            });
                        });
                    }
                }}
                style={styles.playButton}
                activeOpacity={0.7}
            >
                <Icon.Play width={16} height={16} color="black" />
                <Text style={styles.playButtonText}>Oynat</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Player', {
                        uri:
                            firstEpisode?.link_subtitle == null
                                ? firstEpisode?.link_dugging.replace(
                                      'iframe',
                                      'download'
                                  )
                                : firstEpisode?.link_subtitle.replace(
                                      'iframe',
                                      'download'
                                  ),
                    })
                }
                style={styles.downloadButton}
                activeOpacity={0.7}
            >
                <Icon.Download width={16} height={16} fill="white" />
                <Text style={styles.downloadButtonText}>İndir</Text>
            </TouchableOpacity>
            <View style={styles.detailContainer}>
                <Text
                    style={styles.summary}
                    onPress={() => {
                        setSummaryToggle(!summaryToggle);
                        if (summaryToggle) {
                            setSummary(shorten(data?.series?.summary, 200));
                        } else {
                            setSummary(data?.series?.summary);
                        }
                    }}
                >
                    {typeof summary === 'undefined'
                        ? shorten(data?.series?.summary, 200)
                        : summary}
                </Text>
                <View style={styles.genresContainer}>
                    <Text style={styles.genresTitle}>Kategoriler: </Text>
                    <Text style={styles.genres}>
                        {data?.series?.genres.split(',').join(', ')}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <ToggleWatchListButton
                        id={id}
                        iconStyle={styles.button}
                        textStyle={styles.buttonText}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={() => _Share()}
                    >
                        <Icon.Paperplane width={24} height={24} fill="white" />
                        <Text style={styles.buttonText}>Paylaş</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.tab}>
                {seasonsLength > 1 && (
                    <Modal
                        isVisible={seasonModalVisible}
                        style={styles.modalContainer}
                        onBackButtonPress={() => seasonModalToggle()}
                        backdropOpacity={0.9}
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        backdropTransitionInTiming={0}
                        backdropTransitionOutTiming={0}
                    >
                        <FlatList
                            data={seasonNumberList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalTitleContainer}
                                    onPress={() => {
                                        seasonModalToggle();
                                        setActiveSeason(item);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.modalTitle,
                                            activeSeason == item &&
                                                styles.modalActiveTitle,
                                        ]}
                                    >
                                        {item}. Sezon
                                    </Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingVertical: 100 }}
                            showsVerticalScrollIndicator={false}
                        />
                        <TouchableOpacity
                            style={styles.modalCloseContainer}
                            onPress={() => seasonModalToggle()}
                        >
                            <Icon.Close width={24} height={24} fill="#121313" />
                        </TouchableOpacity>
                    </Modal>
                )}
                <View style={styles.tabMenu}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            setActiveTabMenu(1);
                        }}
                    >
                        <View
                            style={activeTabMenu == 1 && styles.tabMenuActive}
                        >
                            <Text
                                style={[
                                    styles.tabMenuTitle,
                                    activeTabMenu == 1 && { color: 'white' },
                                ]}
                            >
                                BÖLÜMLER
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {seasons?.some(
                        (el) => el.season === activeSeason && el.link_dugging
                    ) && (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setActiveTabMenu('DUBLAJ');
                            }}
                        >
                            <View
                                style={
                                    activeTabMenu == 'DUBLAJ' &&
                                    styles.tabMenuActive
                                }
                            >
                                <Text
                                    style={[
                                        styles.tabMenuTitle,
                                        activeTabMenu == 'DUBLAJ' && {
                                            color: 'white',
                                        },
                                    ]}
                                >
                                    DUBLAJ
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {activeTabMenu == 1 ? (
                <>
                    {seasonsLength > 1 ? (
                        <TouchableOpacity
                            style={styles.seasonSelectButton}
                            activeOpacity={0.7}
                            onPress={() => seasonModalToggle()}
                        >
                            <Text style={styles.seasonSelectButtonText}>
                                {activeSeason}. Sezon
                            </Text>
                            <Icon.BottomArrow
                                fill="white"
                                width={12}
                                height={12}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.singleSeasonTitle}>
                            {activeSeason}. Sezon
                        </Text>
                    )}
                </>
            ) : (
                <>
                    {seasonsLength > 1 ? (
                        <TouchableOpacity
                            style={styles.seasonSelectButton}
                            activeOpacity={0.7}
                            onPress={() => seasonModalToggle()}
                        >
                            <Text style={styles.seasonSelectButtonText}>
                                {activeSeason}. Sezon
                            </Text>
                            <Icon.BottomArrow
                                fill="white"
                                width={12}
                                height={12}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.singleSeasonTitle}>
                            {activeSeason}. Sezon
                        </Text>
                    )}
                </>
            )}
        </View>
    );

    const subtitleSeason = useMemo(() => {
        if (typeof seasons === 'undefined') {
            return [];
        }

        return seasons?.filter((el) => el.season === activeSeason);
    }, [seasons, activeSeason]);

    const duggingSeason = useMemo(() => {
        if (typeof seasons === 'undefined') {
            return [];
        }

        return seasons?.filter(
            (el) => el.season === activeSeason && el.link_dugging
        );
    }, [seasons, activeSeason]);

    return (
        <>
            {loading ? (
                <>
                    <SafeAreaView>
                        <Header
                            headerLeft={
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                >
                                    <Icon.BackArrow width={18} height={18} />
                                </TouchableOpacity>
                            }
                            navigation={navigation}
                            style={{ marginVertical: 9 }}
                        />
                    </SafeAreaView>
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size="large" color="white" />
                    </View>
                </>
            ) : activeTabMenu == 1 ? (
                <SafeAreaView style={{ flex: 1 }}>
                    <Header
                        headerLeft={
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <Icon.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                        }
                        navigation={navigation}
                        style={{ marginVertical: 9 }}
                    />
                    <View style={styles.backdropContainer}>
                        <ImageBackground
                            source={{ uri: data?.series?.backdrop }}
                            style={styles.backdrop}
                        >
                            <View style={styles.noSpecialVideoContainer}>
                                <Text style={styles.noSpecialVideoText}>
                                    Özel Video Yok
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <FlatList
                        data={subtitleSeason}
                        renderItem={renderItemSubtitle}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={headerComponent()}
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
            ) : (
                <SafeAreaView style={{ flex: 1 }}>
                    <Header
                        headerLeft={
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                <Icon.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                        }
                        navigation={navigation}
                        style={{ marginVertical: 9 }}
                    />
                    <View style={styles.backdropContainer}>
                        <ImageBackground
                            source={{ uri: data?.series?.backdrop }}
                            style={styles.backdrop}
                        >
                            <View style={styles.noSpecialVideoContainer}>
                                <Text style={styles.noSpecialVideoText}>
                                    Özel Video Yok
                                </Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <FlatList
                        data={duggingSeason}
                        renderItem={renderItemDugging}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={headerComponent()}
                        showsVerticalScrollIndicator={false}
                    />
                </SafeAreaView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
    },
    backdropContainer: {
        alignItems: 'center',
    },
    backdrop: {
        width: '100%',
        height: 220,
    },
    noSpecialVideoContainer: {
        backgroundColor: 'black',
        position: 'absolute',
        left: 0,
        bottom: 0,
        margin: 10,
        padding: 10,
        borderRadius: 5,
    },
    noSpecialVideoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    year: {
        marginLeft: 10,
        color: 'white',
    },
    imdbRating: {
        fontWeight: 'bold',
        color: '#46D369',
    },
    maturityContainer: {
        backgroundColor: '#4D4D4D',
        marginLeft: 10,
    },
    maturity: {
        padding: 3,
        color: '#E0E0E0',
        fontSize: 11,
    },
    resolutionContainer: {
        marginLeft: 10,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#454545',
    },
    resolution: {
        padding: 2,
        color: '#A9A9A9',
        fontSize: 12,
        fontWeight: 'bold',
    },
    playButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 3,
        height: 35,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    playButtonText: {
        paddingLeft: 5,
        fontSize: 18,
        fontWeight: 'bold',
    },
    downloadButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#292929',
        marginHorizontal: 10,
        borderRadius: 3,
        height: 35,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 15,
    },
    downloadButtonText: {
        paddingLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    detailContainer: {
        paddingHorizontal: 12,
    },
    summary: {
        color: 'white',
        marginBottom: 10,
    },
    titleContainer: {
        marginVertical: 15,
        marginHorizontal: 15,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    genresContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    genres: {
        flex: 1,
        color: '#B3B3B3',
    },
    genresTitle: {
        color: '#B3B3B3',
        fontWeight: 'bold',
    },
    button: {
        alignItems: 'center',
        marginLeft: 50,
    },
    buttonText: {
        color: '#6C6C6C',
        marginTop: 12,
        fontSize: 13,
    },
    tab: {
        marginTop: 15,
        borderTopWidth: 2,
        borderTopColor: '#2F2F2F',
    },
    tabMenu: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: -13,
    },
    tabMenuTitle: {
        color: '#7F7F7F',
        fontWeight: 'bold',
        fontSize: 15,
        paddingTop: 15,
        marginLeft: 20,
    },
    tabMenuActive: {
        borderTopWidth: 4,
        borderTopColor: '#E50914',
    },
    seasonSelectButton: {
        marginHorizontal: 7,
        marginTop: 15,
        borderRadius: 7,
        width: 130,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    seasonSelectButtonText: {
        color: '#B3B3B3',
        fontSize: 17,
        paddingRight: 10,
    },
    singleSeasonTitle: {
        color: '#B3B3B3',
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 15,
        marginLeft: 17,
    },
    buttonsContainer: {
        margin: 20,
        flexDirection: 'row',
        marginLeft: -30,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        alignItems: 'center',
    },
    modalTitleContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#B3B3B3',
        fontSize: 20,
    },
    modalActiveTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
    },
    modalCloseContainer: {
        width: 50,
        height: 50,
        borderRadius: 32.5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
