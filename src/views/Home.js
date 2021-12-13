import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    RefreshControl,
    ScrollView,
    Alert,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    Linking,
} from 'react-native';

// Moment
import moment from 'moment';
import 'moment/locale/tr';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Expo
import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenOrientation from 'expo-screen-orientation';
import Constants from 'expo-constants';

// Apollo
import { useQuery, useMutation } from 'react-apollo';

// Store
import { store } from '../store';

// Types
import {
    SET_TOKEN,
    SET_USER_ID,
    SET_USER_AVATAR,
    SET_USER_FULL_NAME,
    SET_USER_EMAIL,
    SET_USER_AUTHORITY,
    SET_SETTINGS_APP_NAME,
    SET_SETTINGS_APP_VERSION,
    SET_SETTINGS_ASSETS_URL,
    SET_SETTINGS_SHARE_APP_TEXT,
    SET_SETTINGS_DOWNLOAD_URL,
    SET_SETTINGS_DOWNLOAD_REF_URL,
    SET_SETTINGS_SHARE_TEXT,
    SET_SETTINGS_PASSWORD_RESET_URL,
    SET_SETTINGS_USER_ACCOUNT_URL,
    SET_SETTINGS_HELP_URL,
    SET_SETTINGS_USERAGENT,
} from '../store/types';

// Queries
import {
    getDatasQuery,
    getUser,
    updateUser,
    Settings,
    getKeepWatchingList,
} from '../queries';

// Components
import ToggleWatchListButton from '../components/ToggleWatchListButton';
import PlayButton from '../components/PlayButton';
import Header from '../components/Header';
import Menu from '../components/HeaderMenu/HomeMenu';
import HorizontalList from '../components/HorizontalList';
import KeepWatchingList from '../components/KeepWatchingList';

// Icons
import * as Icon from '../components/icons';

// Views
import More from './More';
import Movies from './Movie/Movies';
import MovieDetail from './Movie/Detail';
import Series from './Series/Series';
import SeriesDetail from './Series/Detail';
import Genre from './Genre';
import MyWatchList from './MyWatchList';
import Player from './Player';

const wait = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

function Home({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [datas, setDatas] = useState({});

    const {
        error,
        data,
        refetch: refetchUser,
    } = useQuery(getUser, {
        variables: {
            token: store.token,
        },
    });

    const { data: SettingsData } = useQuery(Settings);

    const { data: LastData, refetch: refetchLastData } = useQuery(
        getDatasQuery,
        {
            variables: {
                limit: 1,
                random: true,
            },
        }
    );

    useEffect(() => {
        setDatas(LastData?.datas[0]);
    }, [LastData]);

    const [setUser] = useMutation(updateUser);

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
    }, [isFocused]);

    useEffect(() => {
        if (error) {
            AsyncStorage.removeItem('token').then(() => {
                if (Platform.OS == 'ios') {
                    Alert.alert(error.message.replace('GraphQL error: ', ''));
                } else if (Platform.OS == 'android') {
                    ToastAndroid.show(
                        error.message.replace('GraphQL error: ', ''),
                        ToastAndroid.SHORT
                    );
                }
                store.setStore(SET_TOKEN, null);
            });
        } else {
            store.setStore(SET_USER_ID, data?.getUser?.id);
            store.setStore(SET_USER_AVATAR, data?.getUser?.avatar);
            store.setStore(SET_USER_FULL_NAME, data?.getUser?.full_name);
            store.setStore(SET_USER_EMAIL, data?.getUser?.email);
            store.setStore(SET_USER_AUTHORITY, data?.getUser?.authority);

            store.setStore(
                SET_SETTINGS_APP_NAME,
                SettingsData?.Settings?.app_name
            );
            store.setStore(
                SET_SETTINGS_APP_VERSION,
                SettingsData?.Settings?.app_version
            );
            store.setStore(
                SET_SETTINGS_ASSETS_URL,
                SettingsData?.Settings?.assets_url
            );
            store.setStore(
                SET_SETTINGS_SHARE_APP_TEXT,
                SettingsData?.Settings?.share_app_text
            );
            store.setStore(
                SET_SETTINGS_DOWNLOAD_URL,
                SettingsData?.Settings?.download_url
            );
            store.setStore(
                SET_SETTINGS_DOWNLOAD_REF_URL,
                SettingsData?.Settings?.download_ref_url
            );
            store.setStore(
                SET_SETTINGS_SHARE_TEXT,
                SettingsData?.Settings?.share_text
            );
            store.setStore(
                SET_SETTINGS_PASSWORD_RESET_URL,
                SettingsData?.Settings?.password_reset_url
            );
            store.setStore(
                SET_SETTINGS_USER_ACCOUNT_URL,
                SettingsData?.Settings?.user_account_url
            );
            store.setStore(
                SET_SETTINGS_HELP_URL,
                SettingsData?.Settings?.help_url
            );
            store.setStore(
                SET_SETTINGS_USERAGENT,
                SettingsData?.Settings?.useragent
            );

            if (store.user.id) {
                setUser({
                    variables: {
                        id: store.user.id,
                        last_active: `${moment().format()}`,
                        device_brand: store.user.device_brand,
                        device_model: store.user.device_model,
                        device_os_version: store.user.device_os_version,
                        app_version: Constants.manifest.version,
                    },
                });
            }
        }
    }, [data, SettingsData]);

    useEffect(() => {
        if (store?.settings?.app_version) {
            if (Constants.manifest.version != store?.settings?.app_version) {
                Alert.alert(
                    'Yeni Güncelleme Algılandı',
                    'İndirmek istiyor musunuz?',
                    [
                        {
                            text: 'Daha Sonra',
                        },
                        {
                            text: 'Evet',
                            onPress: () =>
                                Linking.openURL(store.settings.download_url),
                        },
                    ]
                );
            }
        }
    }, [SettingsData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetchLastData();
        refetchUser();

        wait(500).then(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        title="Yükleniyor.."
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,10.5)']}
                        style={[
                            StyleSheet.absoluteFillObject,
                            {
                                borderRadius: 1,
                                transform: [{ rotate: '180deg' }],
                                height: 200,
                            },
                        ]}
                    />
                    <Header navigation={navigation} />
                    <Menu navigation={navigation} />
                </View>
                <ImageBackground
                    style={styles.imageContainer}
                    source={{
                        uri: datas?.poster,
                    }}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,10.5)']}
                        style={[
                            StyleSheet.absoluteFillObject,
                            { borderRadius: 1 },
                        ]}
                    />
                    <Text style={styles.title}>
                        {datas?.title == null
                            ? datas?.original_title
                            : datas?.title}
                    </Text>
                    <View style={styles.buttons}>
                        <ToggleWatchListButton
                            id={datas?.id}
                            iconStyle={styles.buttonList}
                            textStyle={styles.buttonText}
                        />
                        <PlayButton
                            style={styles.buttonPlay}
                            navigation={navigation}
                            id={datas?.id}
                            type={datas?.type}
                        >
                            <Icon.Play color="black" />
                            <Text style={styles.buttonPlayText}>Oynat</Text>
                        </PlayButton>
                        <TouchableOpacity
                            style={styles.buttonInfo}
                            onPress={() => {
                                navigation.navigate(
                                    datas?.type == 'movie'
                                        ? 'MovieDetail'
                                        : 'SeriesDetail',
                                    {
                                        id: datas?.id,
                                        title:
                                            datas?.title == null
                                                ? datas?.original_title
                                                : datas?.title,
                                    }
                                );
                            }}
                        >
                            <Icon.Info fill="white" width={20} height={20} />
                            <Text style={styles.buttonText}>Bilgi</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View>
                    <KeepWatchingList
                        menuTitle={store.user.full_name + ', İzlemeye Devam Et'}
                        query={getKeepWatchingList}
                        variables={{
                            user_id: store.user.id,
                            limit: 10,
                            sort: 'DESC',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Diziwon'da Popüler"
                        query={getDatasQuery}
                        variables={{ limit: 10, featured: 'DESC' }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Son Eklenenler"
                        query={getDatasQuery}
                        variables={{ limit: 10, sort: 'DESC' }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Komedi"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Komedi',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Bilim Kurgu"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Bilim Kurgu',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Korku"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Korku',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Romantik"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Romantik',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Aksiyon"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Aksiyon',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Gerilim"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Gerilim',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Dram"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Dram',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Gizem"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Gizem',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Suç"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Suç',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Animasyon"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Animasyon',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Macera"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Macera',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Fantastik"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Fantastik',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Savaş"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            random: true,
                            genre: 'Savaş',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="More" component={More} />
            <Stack.Screen name="Movies" component={Movies} />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
            <Stack.Screen name="Series" component={Series} />
            <Stack.Screen name="SeriesDetail" component={SeriesDetail} />
            <Stack.Screen name="Genre" component={Genre} />
            <Stack.Screen name="MyWatchList" component={MyWatchList} />
            <Stack.Screen name="Player" component={Player} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
    },
    imageContainer: {
        height: 550,
        marginBottom: 25,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonList: {
        alignItems: 'center',
        margin: 20,
    },
    buttonPlay: {
        margin: 30,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
    },
    buttonInfo: {
        alignItems: 'center',
        margin: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        fontFamily: 'NunitoBlack',
        fontWeight: '900',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 6,
        fontSize: 12,
    },
    buttonPlayText: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
});
