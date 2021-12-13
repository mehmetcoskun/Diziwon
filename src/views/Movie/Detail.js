import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Share,
    ScrollView,
    Alert,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Base64
import base64 from 'react-native-base64';

// Expo
import * as ScreenOrientation from 'expo-screen-orientation';

// Modal
import Modal from 'react-native-modal';

// Apollo
import { useQuery, useMutation } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { getMovieQuery, incrementCounter } from '../../queries';

// Components
import ToggleWatchListButton from '../../components/ToggleWatchListButton';
import Header from '../../components/Header';

// Icons
import * as Icon from '../../components/icons';

export default function Detail({ route, navigation }) {
    const { id, title } = route.params;
    const [watchModalVisible, setWatchModalVisible] = useState(false);
    const [downloadModalVisible, setDownloadModalVisible] = useState(false);
    const [summary, setSummary] = useState();
    const [summaryToggle, setSummaryToggle] = useState(false);

    const shorten = (str, n) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    };

    const watchModalToggle = () => {
        setWatchModalVisible(!watchModalVisible);
    };

    const downloadModalToggle = () => {
        setDownloadModalVisible(!downloadModalVisible);
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
        }
    }, [isFocused, store.connection]);

    const share_text = store.settings.share_text?.replace('%title%', title);
    const download_url = store.settings.download_ref_url?.replace(
        '%q%',
        base64.encode(store.user.id + '-' + parseInt(Date.now() / 1000))
    );

    const { loading, data } = useQuery(getMovieQuery, {
        variables: {
            id,
        },
    });

    const [addCounter] = useMutation(incrementCounter);

    useEffect(() => {
        addCounter({
            variables: {
                id,
            },
        });
    }, [data]);

    const _Share = async () => {
        await Share.share({
            message: share_text + ' ' + download_url,
            url: download_url,
        });
    };

    return loading ? (
        <>
            <SafeAreaView>
                <Header
                    headerLeft={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
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
    ) : (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                headerLeft={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon.BackArrow width={18} height={18} />
                    </TouchableOpacity>
                }
                navigation={navigation}
                style={{ marginVertical: 9 }}
            />
            <Modal
                isVisible={watchModalVisible}
                style={styles.modalContainer}
                onBackButtonPress={() => watchModalToggle()}
                backdropOpacity={0.9}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
            >
                <ScrollView
                    contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {data?.movie?.watch.link_subtitle && (
                        <TouchableOpacity
                            style={styles.modalTitleContainer}
                            onPress={() => {
                                watchModalToggle();
                                navigation.navigate('Player', {
                                    uri: data?.movie?.watch.link_subtitle,
                                });
                            }}
                        >
                            <Text style={[styles.modalTitle]}>Altyazı</Text>
                        </TouchableOpacity>
                    )}
                    {data?.movie?.watch.link_dugging && (
                        <TouchableOpacity
                            style={styles.modalTitleContainer}
                            onPress={() => {
                                watchModalToggle();
                                navigation.navigate('Player', {
                                    uri: data?.movie?.watch.link_dugging,
                                });
                            }}
                        >
                            <Text style={[styles.modalTitle]}>Dublaj</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalCloseContainer}
                    onPress={() => watchModalToggle()}
                >
                    <Icon.Close width={24} height={24} fill="#121313" />
                </TouchableOpacity>
            </Modal>
            <Modal
                isVisible={downloadModalVisible}
                style={styles.modalContainer}
                onBackButtonPress={() => downloadModalToggle()}
                backdropOpacity={0.9}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
            >
                <ScrollView
                    contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'center',
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {data?.movie?.watch.link_subtitle && (
                        <TouchableOpacity
                            style={styles.modalTitleContainer}
                            onPress={() => {
                                downloadModalToggle();
                                navigation.navigate('Player', {
                                    uri: data?.movie?.watch.link_subtitle.replace(
                                        'iframe',
                                        'download'
                                    ),
                                });
                            }}
                        >
                            <Text style={[styles.modalTitle]}>Altyazı</Text>
                        </TouchableOpacity>
                    )}
                    {data?.movie?.watch.link_dugging && (
                        <TouchableOpacity
                            style={styles.modalTitleContainer}
                            onPress={() => {
                                downloadModalToggle();
                                navigation.navigate('Player', {
                                    uri: data?.movie?.watch.link_dugging.replace(
                                        'iframe',
                                        'download'
                                    ),
                                });
                            }}
                        >
                            <Text style={[styles.modalTitle]}>Dublaj</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalCloseContainer}
                    onPress={() => downloadModalToggle()}
                >
                    <Icon.Close width={24} height={24} fill="#121313" />
                </TouchableOpacity>
            </Modal>
            <View style={styles.backdropContainer}>
                <ImageBackground
                    source={{ uri: data?.movie?.backdrop }}
                    style={styles.backdrop}
                >
                    <View style={styles.noSpecialVideoContainer}>
                        <Text style={styles.noSpecialVideoText}>
                            Özel Video Yok
                        </Text>
                    </View>
                </ImageBackground>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.infoContainer}>
                            <Text style={styles.imdbRating}>
                                %{data?.movie?.imdb_rating.split('.')} eşleşme
                            </Text>
                            <Text style={styles.year}>{data?.movie?.year}</Text>
                            <View style={styles.maturityContainer}>
                                <Text style={styles.maturity}>
                                    {data?.movie?.maturity}
                                </Text>
                            </View>
                            <Text style={{ color: 'white', marginLeft: 10 }}>
                                {data?.movie?.runtime}
                            </Text>
                            <View style={styles.resolutionContainer}>
                                <Text style={styles.resolution}>HD</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.playButton}
                        activeOpacity={0.7}
                        onPress={() => watchModalToggle()}
                    >
                        <Icon.Play width={16} height={16} color="black" />
                        <Text style={styles.playButtonText}>Oynat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.downloadButton}
                        activeOpacity={0.7}
                        onPress={() => downloadModalToggle()}
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
                                    setSummary(
                                        shorten(data?.movie?.summary, 200)
                                    );
                                } else {
                                    setSummary(data?.movie?.summary);
                                }
                            }}
                        >
                            {typeof summary === 'undefined'
                                ? shorten(data?.movie?.summary, 200)
                                : summary}
                        </Text>
                        <View style={styles.genresContainer}>
                            <Text style={styles.genresTitle}>
                                Kategoriler:{' '}
                            </Text>
                            <Text style={styles.genres}>
                                {data?.movie?.genres.split(',').join(', ')}
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
                                <Icon.Paperplane
                                    width={24}
                                    height={24}
                                    fill="white"
                                />
                                <Text style={styles.buttonText}>Paylaş</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
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
        backgroundColor: '#303030',
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
        fontSize: 17,
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
    buttonsContainer: {
        margin: 20,
        flexDirection: 'row',
        marginLeft: -30,
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
