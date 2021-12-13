import React, { useEffect, useState, createRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Alert,
    Dimensions,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../store';

// Queries
import { getDatasQuery } from '../queries';

// Components
import Item from '../components/Item';
import SearchItem from '../components/SearchItem';

// Views
import MovieDetail from './Movie/Detail';
import SeriesDetail from './Series/Detail';

// Icons
import * as Icon from '../components/icons';

function Search({ navigation }) {
    const [search, setSearch] = useState('');

    const searchRef = createRef();

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            searchRef.current.focus();
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

    const { loading, data, fetchMore } = useQuery(getDatasQuery, {
        variables:
            search !== ''
                ? {
                      search,
                      sort: 'DESC',
                      limit: 24,
                  }
                : {
                      featured: 'DESC',
                      limit: 10,
                  },
    });

    const renderSearchItem = ({
        item: { id, type, title, original_title, poster },
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

    const renderItem = ({
        item: { id, type, title, original_title, backdrop, backdrop_withtitle },
    }) => (
        <SearchItem
            id={id}
            type={type}
            title={title == null ? original_title : title}
            backdrop={backdrop_withtitle == '' ? backdrop : backdrop_withtitle}
            navigation={navigation}
        />
    );

    const headerComponent = () =>
        search !== '' ? (
            !loading && data?.datas?.length != 0 ? (
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                        Filmler, Diziler ve Programlar
                    </Text>
                </View>
            ) : null
        ) : !loading && data?.datas?.length != 0 ? (
            <View style={styles.labelContainer}>
                <Text style={styles.labelText}>En Çok Arananlar</Text>
            </View>
        ) : null;

    return (
        <>
            <View style={styles.header}>
                <Icon.Search
                    style={styles.icon}
                    stroke="#B3B3B3"
                    width={24}
                    height={24}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ara"
                    placeholderTextColor="#C1C1C1"
                    blurOnSubmit={true}
                    onChangeText={(search) => setSearch(search)}
                    autoCorrect={false}
                    returnKeyType="default"
                    ref={searchRef}
                />
            </View>
            <View style={styles.body}>
                {search !== '' ? (
                    <FlatList
                        data={data?.datas}
                        renderItem={renderSearchItem}
                        keyExtractor={(item, index) => index.toString()}
                        key={search}
                        numColumns={3}
                        onEndReachedThreshold={1}
                        onEndReached={() => {
                            fetchMore({
                                variables: {
                                    search,
                                    offset: data?.datas?.length + 18,
                                },
                                updateQuery: (
                                    previousResult,
                                    { fetchMoreResult }
                                ) => {
                                    if (
                                        !fetchMoreResult ||
                                        fetchMoreResult?.datas?.length === 0
                                    ) {
                                        return previousResult;
                                    }

                                    return {
                                        datas: previousResult?.datas?.concat(
                                            fetchMoreResult?.datas
                                        ),
                                    };
                                },
                            });
                        }}
                        ListHeaderComponent={headerComponent()}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={data?.datas}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={1}
                        ListHeaderComponent={headerComponent()}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </>
    );
}

const Stack = createStackNavigator();

export default function SearchStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
            <Stack.Screen name="SeriesDetail" component={SeriesDetail} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
        height: 35,
        marginTop: 30,
        marginBottom: 6,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
    },
    icon: {
        padding: 10,
        margin: 10,
    },
    input: {
        flex: 1,
        color: 'white',
    },
    labelContainer: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center',
        paddingLeft: 10,
    },
    labelText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    body: {
        flex: 1,
        marginRight: 10,
    },
});
