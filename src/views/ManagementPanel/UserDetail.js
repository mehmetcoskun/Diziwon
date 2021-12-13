import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    FlatList,
    Clipboard,
    TouchableHighlight,
    Alert,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ScrollView,
} from 'react-native';

// Moment
import moment from 'moment';
import 'moment/locale/tr';

// React Navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';

// Expo
import * as ScreenOrientation from 'expo-screen-orientation';

// Apollo
import { useQuery, useMutation } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { getUserDetail, deleteUser } from '../../queries';

// Components
import Item from '../../components/Item';
import StatusChangeButton from '../../components/StatusChangeButton';
import Header from '../../components/Header';
import KeepWatchingItem from '../../components/KeepWatchingItem';

// Icons
import * as Icon from '../../components/icons';

function UserDetail({ route, navigation }) {
    const { id } = route.params;

    const { loading, data, refetch } = useQuery(getUserDetail, {
        variables: {
            id,
        },
    });

    const [deleteUserData] = useMutation(deleteUser);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
            refetch();
        }
    }, [isFocused]);

    const writeToClipboard = async (email) => {
        await Clipboard.setString(email);
        if (Platform.OS == 'ios') {
            Alert.alert('Panoya başarıyla kopyalandı.');
        } else if (Platform.OS == 'android') {
            ToastAndroid.show(
                'Panoya başarıyla kopyalandı.',
                ToastAndroid.SHORT
            );
        }
    };

    const userDeleteAlert = (full_name) =>
        Alert.alert('Emin misiniz?', full_name + ' adlı kullanıcı siliniyor', [
            {
                text: 'Sil',
                onPress: () => {
                    deleteUserData({ variables: { id } }).then(() => {
                        if (Platform.OS == 'ios') {
                            Alert.alert('Kullanıcı başarıyla silindi');
                        } else if (Platform.OS == 'android') {
                            ToastAndroid.show(
                                'Kullanıcı başarıyla silindi',
                                ToastAndroid.SHORT
                            );
                        }
                        navigation.goBack();
                    });
                },
                style: 'destructive',
            },
            {
                text: 'İptal',
                style: 'cancel',
            },
        ]);

    const renderWatchListItem = ({
        item: {
            info: { id, type, title, original_title, poster },
        },
    }) => (
        <Item
            id={id}
            type={type}
            title={title == null ? original_title : title}
            poster={poster}
            navigation={navigation}
            style={{
                width: 110,
                height: 149,
            }}
        />
    );

    const renderKeepWatchinListItem = ({
        item: {
            _id,
            season,
            episode,
            info: { type, title, original_title, poster },
        },
    }) => (
        <KeepWatchingItem
            id={_id}
            season={season}
            episode={episode}
            type={type}
            title={title == null ? original_title : title}
            poster={poster}
            userId={id}
            navigation={navigation}
            refreshing={refetch}
            style={{ width: 110, height: 139 }}
        />
    );

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
                    style={{ marginTop: 15 }}
                />
            </SafeAreaView>
            <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color="white" />
            </View>
        </>
    ) : (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                    style={{ marginTop: 15 }}
                />
                <View style={styles.container}>
                    {id != store.user.id && (
                        <TouchableOpacity
                            style={styles.deleteUserButton}
                            onPress={() =>
                                userDeleteAlert(data?.getUserDetail?.full_name)
                            }
                        >
                            <Icon.DeleteUser
                                width={30}
                                height={30}
                                color={'#EE5564'}
                            />
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{
                            uri:
                                store.settings.assets_url +
                                '/avatars' +
                                data?.getUserDetail?.avatar,
                        }}
                        style={[
                            styles.avatar,
                            {
                                marginTop:
                                    store.user.authority == 'admin' &&
                                    id != store.user.id
                                        ? 60
                                        : 20,
                            },
                        ]}
                    />
                    <Text style={styles.fullName}>
                        {data?.getUserDetail?.full_name}{' '}
                    </Text>
                    {data?.getUserDetail?.status == 'pending' && (
                        <Text style={styles.statusText}>
                            (Onay Bekliyor...)
                        </Text>
                    )}
                    {data?.getUserDetail?.status == 'inactive' && (
                        <Text style={styles.statusText}>(Engellendi)</Text>
                    )}
                    <TouchableHighlight
                        onPress={() => {
                            writeToClipboard(data?.getUserDetail?.email);
                        }}
                    >
                        <Text style={styles.email}>
                            {data?.getUserDetail?.email}
                        </Text>
                    </TouchableHighlight>
                </View>
                <View style={{ flex: 1 }}>
                    {store.user.authority != 'user' && id != store.user.id && (
                        <View style={styles.listStatusItem}>
                            <Text style={styles.listItemContainer}>
                                <Text style={styles.listItemTitle}>Durum:</Text>{' '}
                            </Text>
                            <StatusChangeButton
                                id={id}
                                navigation={navigation}
                            />
                        </View>
                    )}
                    <Text style={styles.listItemContainer}>
                        <Text style={styles.listItemTitle}>En Son:</Text>{' '}
                        {data?.getUserDetail?.last_active != 'Register'
                            ? moment(data?.getUserDetail?.last_active).format(
                                  'LL LTS'
                              )
                            : 'Henüz giriş yapmadı'}
                    </Text>
                    <Text style={styles.listItemContainer}>
                        <Text style={styles.listItemTitle}>Kayıt Tarihi:</Text>{' '}
                        {moment(data?.getUserDetail?.createdAt).format(
                            'LL LTS'
                        )}
                    </Text>
                    <Text style={styles.listItemContainer}>
                        <Text style={styles.listItemTitle}>
                            Cihaz Marka/Model:
                        </Text>{' '}
                        {data?.getUserDetail?.device_brand +
                            ' / ' +
                            data?.getUserDetail?.device_model +
                            '(' +
                            data?.getUserDetail?.device_os_version +
                            ')'}
                    </Text>
                    <Text style={styles.listItemContainer}>
                        <Text style={styles.listItemTitle}>
                            Uygulama Versiyonu:
                        </Text>{' '}
                        {data?.getUserDetail?.app_version}
                    </Text>
                    <View style={{ marginTop: 30 }}>
                        <View>
                            {data?.getUserDetail?.keepwatchinglist?.length ? (
                                <View style={styles.header}>
                                    <Text style={styles.title}>
                                        İzlemeye Devam Et Listesi
                                    </Text>
                                </View>
                            ) : null}
                            <FlatList
                                data={data?.getUserDetail?.keepwatchinglist}
                                renderItem={renderKeepWatchinListItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal={true}
                                onEndReachedThreshold={1}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View>
                            {data?.getUserDetail?.watchlist?.length ? (
                                <View style={styles.header}>
                                    <Text style={styles.title}>
                                        İzleme Listesi
                                    </Text>
                                </View>
                            ) : null}
                            <FlatList
                                data={data?.getUserDetail?.watchlist}
                                renderItem={renderWatchListItem}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal={true}
                                onEndReachedThreshold={1}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function UserDetailStack(props) {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="UserDetail">
                {() => <UserDetail {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteUserButton: {
        top: 60,
        right: 20,
        position: 'absolute',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 20,
    },
    fullName: {
        color: 'white',
        fontSize: 30,
        marginTop: 20,
        fontFamily: 'AktifoBBlack',
    },
    email: {
        color: 'gray',
        fontSize: 15,
        marginBottom: 20,
        fontFamily: 'AktifoBSemiBold',
    },
    listItemContainer: {
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    listItemTitle: {
        fontSize: 17,
        color: '#ffc048',
        fontFamily: 'AktifoBBlack',
    },
    listStatusItem: {
        flex: 1,
        flexDirection: 'row',
    },
    header: {
        marginLeft: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'NunitoBlack',
    },
    statusText: {
        color: '#EE5564',
        marginBottom: 10,
    },
});
