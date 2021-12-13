import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Platform,
    ToastAndroid,
    Dimensions,
} from 'react-native';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../store';

// Queries
import { getWatchList } from '../queries';

// Icons
import * as Icon from '../components/icons';

// Components
import Item from '../components/Item';
import Header from '../components/Header';

// Views
import MovieDetail from './Movie/Detail';
import SeriesDetail from './Series/Detail';

function MyWatchList({ navigation }) {
    const { loading, data, fetchMore, refetch } = useQuery(getWatchList, {
        variables: {
            user_id: store.user.id,
            limit: 9,
            sort: 'DESC',
        },
    });

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

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
    }, [isFocused, store.connection]);

    const renderItem = ({
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
                width: Dimensions.get('screen').width / 3 - 10,
                height: 175,
            }}
        />
    );

    const header = () => (
        <Header
            headerLeft={
                <>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            justifyContent: 'center',
                        }}
                    >
                        <Icon.BackArrow width={18} height={18} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Listem</Text>
                </>
            }
            navigation={navigation}
            style={{ marginVertical: 20 }}
        />
    );

    return data?.getWatchList?.length === 0 ? (
        <>
            <SafeAreaView>
                <Header
                    headerLeft={
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Listem</Text>
                        </>
                    }
                    navigation={navigation}
                    style={{ marginTop: 20 }}
                />
            </SafeAreaView>
            <View style={styles.emptyPageContainer}>
                <View style={styles.pageCenterIconContainer}>
                    <Icon.Plus fill="#474747" width={60} height={60} />
                </View>
                <Text style={styles.emptyPageTitle}>
                    Bunu biliyor muydunuz?
                </Text>
                <Text style={styles.emptyPageText}>
                    İstediğiniz dizi ve filmleri daha sonra kolayca bulmak için
                    listenize ekleyin.
                </Text>
                <TouchableOpacity
                    style={styles.emptyPageButton}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.emptyPageButtonText}>
                        İzleyecek bir şeyler bulun
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    ) : loading ? (
        <>
            <SafeAreaView>
                <Header
                    headerLeft={
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{
                                    justifyContent: 'center',
                                }}
                            >
                                <Icon.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Listem</Text>
                        </>
                    }
                    navigation={navigation}
                    style={{ marginTop: 20 }}
                />
            </SafeAreaView>
            <View style={styles.activityIndicator}>
                <ActivityIndicator size="large" color="white" />
            </View>
        </>
    ) : (
        <SafeAreaView>
            <FlatList
                data={data?.getWatchList}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            user_id: store.user.id,
                            offset: data?.getWatchList?.length + 1,
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            if (
                                !fetchMoreResult ||
                                fetchMoreResult?.getWatchList?.length === 0
                            ) {
                                return previousResult;
                            }

                            return {
                                getWatchList:
                                    previousResult?.getWatchList?.concat(
                                        fetchMoreResult?.getWatchList
                                    ),
                            };
                        },
                    });
                }}
                ListHeaderComponent={header()}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function MyWatchListStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="MyWatchList" component={MyWatchList} />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
            <Stack.Screen name="SeriesDetail" component={SeriesDetail} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 25,
        color: 'white',
        marginLeft: 20,
        fontFamily: 'AktifoBBlack',
    },
    emptyPageContainer: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        marginHorizontal: 50,
    },
    pageCenterIconContainer: {
        backgroundColor: '#121212',
        width: 150,
        height: 150,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    emptyPageTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 23,
        marginBottom: 10,
    },
    emptyPageText: {
        color: '#B3B3B3',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 40,
    },
    emptyPageButton: {
        backgroundColor: 'white',
        padding: 10,
        justifyContent: 'center',
    },
    emptyPageButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
