import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';

// Moment
import moment from 'moment';
import 'moment/locale/tr';

// React Navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../../store';

// Queries
import { getUsers } from '../../queries';

// Components
import Header from '../../components/Header';

// Views
import UserDetail from './UserDetail';

// Icons
import * as Icon from '../../components/icons';

function Users({ navigation }) {
    const { loading, data, refetch, fetchMore } = useQuery(getUsers, {
        variables: {
            sort: 'DESC',
            limit: 10,
        },
    });

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

    const renderUsers = ({ item }) => (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('UserDetail', { id: item.id })}
            activeOpacity={0.8}
        >
            <Image
                source={{
                    uri: store.settings.assets_url + '/avatars' + item.avatar,
                }}
                style={styles.avatar}
            />
            <View style={styles.info}>
                <Text style={styles.fullName}>
                    {item.full_name}
                    {` `}
                    {item.status == 'pending' && (
                        <Text style={styles.statusText}>
                            (Onay Bekliyor...)
                        </Text>
                    )}
                    {item.status == 'inactive' && (
                        <Text style={styles.statusText}>(Engellendi)</Text>
                    )}
                </Text>
                <Text style={styles.lastActiveBodyText}>
                    <Text style={styles.lastActiveText}>En son: </Text>
                    {item.last_active != 'Register'
                        ? moment(item.last_active).fromNow()
                        : 'Henüz giriş yapmadı'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const header = () => (
        <Header
            headerLeft={
                <>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ justifyContent: 'center' }}
                    >
                        <Icon.BackArrow width={18} height={18} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Kullanıcılar</Text>
                </>
            }
            navigation={navigation}
            style={{ marginVertical: 20 }}
        />
    );

    return loading ? (
        <>
            <SafeAreaView>
                <Header
                    headerLeft={
                        <>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={{ justifyContent: 'center' }}
                            >
                                <Icon.BackArrow width={18} height={18} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Kullanıcılar</Text>
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
                data={data?.getUsers}
                renderItem={renderUsers}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={1}
                onEndReached={() => {
                    fetchMore({
                        variables: {
                            offset: data?.getUsers?.length,
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            if (
                                !fetchMoreResult ||
                                fetchMoreResult?.getUsers?.length === 0
                            ) {
                                return previousResult;
                            }

                            return {
                                getUsers: previousResult?.getUsers?.concat(
                                    fetchMoreResult?.getUsers
                                ),
                            };
                        },
                    });
                }}
                ListHeaderComponent={header()}
            />
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function ManagementPanel() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Users" component={Users} />
            <Stack.Screen name="UserDetail" component={UserDetail} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
    },
    headerTitle: {
        fontSize: 24,
        color: 'white',
        marginLeft: 20,
        fontFamily: 'AktifoBBlack',
    },
    avatar: {
        width: 60,
        height: 60,
    },
    info: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    fullName: {
        color: '#f44336',
        fontSize: 19,
        fontFamily: 'AktifoBBlack',
    },
    lastActiveBodyText: {
        color: 'white',
        fontFamily: 'AktifoBSemiBold',
    },
    lastActiveText: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'AktifoBSemiBold',
    },
    statusText: {
        color: '#ff7675',
        fontSize: 12,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
