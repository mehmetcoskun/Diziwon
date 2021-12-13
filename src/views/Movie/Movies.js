import React, { useEffect, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    RefreshControl,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Expo
import { LinearGradient } from 'expo-linear-gradient';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { getDatasQuery, getUser } from '../../queries';

// Components
import ToggleWatchListButton from '../../components/ToggleWatchListButton';
import PlayButton from '../../components/PlayButton';
import Header from '../../components/Header';
import Menu from '../../components/HeaderMenu/MoviesMenu';
import HorizontalList from '../../components/HorizontalList';

// Icons
import * as Icon from '../../components/icons';

const wait = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

export default function Movies({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [datas, setDatas] = useState({});
    const [activeGenre, setActiveGenre] = useState('Tüm Kategoriler');

    const {
        error,
        data,
        refetch: refetchUser,
    } = useQuery(getUser, {
        variables: {
            token: store.token,
        },
    });

    const { data: LastData, refetch: refetchLastData } = useQuery(
        getDatasQuery,
        {
            variables: {
                limit: 1,
                random: true,
                sortByType: 'movie',
                genre: activeGenre == 'Tüm Kategoriler' ? null : activeGenre,
            },
        }
    );

    useEffect(() => {
        setDatas(LastData?.datas[0]);
    }, [LastData]);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
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
                    <Menu
                        setActiveGenre={setActiveGenre}
                        activeGenre={activeGenre}
                        navigation={navigation}
                    />
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
                    <HorizontalList
                        menuTitle="Diziwon'da Popüler"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Son Eklenenler"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            sort: 'DESC',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Komedi"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Komedi',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Bilim Kurgu"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Bilim Kurgu',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Korku"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Korku',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Romantik"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Romantik',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Aksiyon"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Aksiyon',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Gerilim"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Gerilim',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Dram"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Dram',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Gizem"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Gizem',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Suç"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Suç',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Animasyon"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Animasyon',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Macera"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Macera',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Fantastik"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Fantastik',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                    <HorizontalList
                        menuTitle="Savaş"
                        query={getDatasQuery}
                        variables={{
                            limit: 10,
                            featured: 'DESC',
                            genre: 'Savaş',
                            sortByType: 'movie',
                        }}
                        navigation={navigation}
                        refreshing={refreshing}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
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
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
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
