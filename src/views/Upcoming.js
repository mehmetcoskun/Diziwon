import React, { useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ImageBackground,
    Platform,
    ToastAndroid,
} from 'react-native';

// Moment
import moment from 'moment';
import 'moment/locale/tr';

// React Navigation
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../store';

// Queries
import { getUpcomings } from '../queries';

// Components
import Header from '../components/Header';

// Views
import More from './More';

function Upcoming({ navigation }) {
    const { loading, data } = useQuery(getUpcomings);

    const shorten = (str, n) => {
        return str.length > n ? str.substr(0, n - 1) + '...' : str;
    };

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
    }, [isFocused, store.connection]);

    const renderItem = ({
        item: { backdrop_path, original_title, overview, release_date, title },
    }) => (
        <View style={{ marginBottom: 20 }}>
            <ImageBackground
                source={{ uri: backdrop_path }}
                style={{ height: 200 }}
                imageStyle={{ resizeMode: 'stretch' }}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.releaseDate}>
                    {moment(release_date).fromNow()}
                </Text>
                <Text style={styles.title}>
                    {title == null ? original_title : title}
                </Text>
                <Text style={{ color: '#808080' }}>
                    {shorten(overview, 200)}
                </Text>
            </View>
        </View>
    );

    const header = () => (
        <Header
            headerLeft={<Text style={styles.headerTitle}>Çok Yakında</Text>}
            navigation={navigation}
            style={{ marginVertical: 20 }}
        />
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={data?.getUpcomings}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={header}
            />
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function UpcomingStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Upcoming" component={Upcoming} />
            <Stack.Screen name="More" component={More} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 24,
        color: 'white',
        fontFamily: 'AktifoBBlack',
    },
    infoContainer: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    releaseDate: {
        color: '#808080',
        marginBottom: 10,
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
