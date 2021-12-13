import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Image,
    TextInput,
    Platform,
    ToastAndroid,
} from 'react-native';

// React Navigation
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useLazyQuery, useMutation } from 'react-apollo';

// Store
import { store } from '../store';

// Queries
import { addMovie, request, search } from '../queries';

// Icons
import * as Icon from '../components/icons';

export default function Request({ navigation }) {
    const [value, setValue] = useState('');
    const [title, setTitle] = useState('');
    const [poster, setPoster] = useState('');

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

    const [
        searchMovie,
        { loading: loadingSearchMovie, data: searchMovieData },
    ] = useLazyQuery(search);

    const [newRequest, { loading: newRequestLoading }] = useMutation(request);
    const [newMovie, { loading: newMovieLoading }] = useMutation(addMovie);

    useEffect(() => {
        if (typeof searchMovieData !== 'undefined') {
            setTitle(searchMovieData.search.title);
            setPoster(searchMovieData.search.poster);
        }
    }, [searchMovieData]);

    const onLoad = () => {
        const matches = value.match(/^tt([0-9]{7,})$/);

        if (matches) {
            searchMovie({ variables: { imdbId: value } });
        }
    };

    const onSubmit = () => {
        const matches = value.match(/^tt([0-9]{7,})$/);

        if (matches) {
            newMovie({
                variables: {
                    imdbId: value,
                    user_id: store.user.id,
                },
            })
                .then(() => {
                    if (Platform.OS == 'ios') {
                        Alert.alert('Film başarıyla eklendi');
                    } else if (Platform.OS == 'android') {
                        ToastAndroid.show(
                            'Film başarıyla eklendi',
                            ToastAndroid.SHORT
                        );
                    }
                })
                .catch((error) => {
                    if (Platform.OS == 'ios') {
                        Alert.alert(
                            error.message.replace('GraphQL error: ', '')
                        );
                    } else if (Platform.OS == 'android') {
                        ToastAndroid.show(
                            error.message.replace('GraphQL error: ', ''),
                            ToastAndroid.SHORT
                        );
                    }
                });
        } else {
            if (value.length) {
                newRequest({
                    variables: {
                        title: value,
                        user_id: store.user.id,
                    },
                })
                    .then(() => {
                        if (Platform.OS == 'ios') {
                            Alert.alert('İsteğiniz başarıyla gönderildi');
                        } else if (Platform.OS == 'android') {
                            ToastAndroid.show(
                                'İsteğiniz başarıyla gönderildi',
                                ToastAndroid.SHORT
                            );
                        }
                    })
                    .catch((error) => {
                        if (Platform.OS == 'ios') {
                            Alert.alert(
                                error.message.replace('GraphQL error: ', '')
                            );
                        } else if (Platform.OS == 'android') {
                            ToastAndroid.show(
                                error.message.replace('GraphQL error: ', ''),
                                ToastAndroid.SHORT
                            );
                        }
                    });
            } else {
                if (Platform.OS == 'ios') {
                    Alert.alert('Lütfen gerekli alanları doldurun');
                } else if (Platform.OS == 'android') {
                    ToastAndroid.show(
                        'Lütfen gerekli alanları doldurun',
                        ToastAndroid.SHORT
                    );
                }
            }
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.headerButtonText}>İptal</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    style={{ marginRight: 10 }}
                    onPress={() => onSubmit()}
                >
                    <Text style={styles.headerButtonText}>Gönder</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, value]);

    return newRequestLoading || newMovieLoading ? (
        <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" color="white" />
        </View>
    ) : (
        <View style={styles.container}>
            <View style={styles.emptySearchContainer}>
                {loadingSearchMovie ? (
                    <>
                        <View style={styles.emptyPoster}>
                            <ActivityIndicator
                                style={{
                                    flex: 1,
                                }}
                            />
                        </View>
                        <View style={styles.emptyTitle} />
                    </>
                ) : !title && !poster ? (
                    <>
                        <View style={styles.emptyPoster} />
                        <View style={styles.emptyTitle} />
                    </>
                ) : (
                    <View style={{ alignItems: 'center' }}>
                        <Image source={{ uri: poster }} style={styles.poster} />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="IMDb ID veya bir isim giriniz"
                    placeholderTextColor="#C1C1C1"
                    autoCapitalize="none"
                    onChangeText={(text) => setValue(text.trim())}
                    autoCorrect={false}
                />
                <TouchableOpacity onPress={() => onLoad()}>
                    <Icon.Search
                        style={styles.icon}
                        stroke="#B3B3B3"
                        width={24}
                        height={24}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        height: 50,
        borderColor: 'white',
        borderWidth: 1,
        marginTop: 10,
    },
    icon: {
        padding: 10,
        margin: 10,
    },
    emptySearchContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    emptyPoster: {
        width: 100,
        height: 149,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dotted',
        borderRadius: 1,
        marginBottom: 10,
    },
    emptyTitle: {
        width: 140,
        height: 20,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dotted',
        borderRadius: 1,
    },
    poster: {
        width: 100,
        height: 149,
        marginBottom: 10,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
    },
    input: {
        flex: 1,
        height: 50,
        borderRadius: 4,
        marginBottom: 15,
        paddingLeft: 20,
        color: 'white',
    },
});
