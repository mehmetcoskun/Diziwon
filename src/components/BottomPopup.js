import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// RBSheet
import RBSheet from 'react-native-raw-bottom-sheet';

// Apollo
import { Query, useMutation } from 'react-apollo';

// Queries
import {
    getSeriesQuery,
    updateKeepWatchingList,
    removeKeepWatchingList,
} from '../queries';

// Icons
import * as Icon from './icons';
import { store } from '../store';

export default function BottomPopup({
    bottomPopupRef,
    id,
    title,
    getNext,
    userId,
    navigation,
    refreshing,
}) {
    const [updateList] = useMutation(updateKeepWatchingList);
    const [removeList] = useMutation(removeKeepWatchingList);

    return (
        <RBSheet
            ref={bottomPopupRef}
            customStyles={{
                mask: { backgroundColor: 'transparent' },
                container: {
                    elevation: 100,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    backgroundColor: '#2B2B2B',
                },
            }}
            openDuration={600}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.title,
                            title.length >= 20
                                ? { fontSize: 24 }
                                : { fontSize: 26 },
                        ]}
                    >
                        {title}
                    </Text>
                    <TouchableOpacity
                        onPress={() => bottomPopupRef.current.close()}
                        activeOpacity={1}
                    >
                        <Icon.CloseOutline width={30} height={30} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            bottomPopupRef.current.close();
                            navigation.navigate('SeriesDetail', {
                                id,
                                title: title == null ? original_title : title,
                            });
                        }}
                    >
                        <Icon.Info fill="white" width={30} height={30} />
                        <Text style={styles.menuText}>
                            Bölümler ve Daha Fazla Bilgi
                        </Text>
                    </TouchableOpacity>
                    <Query query={getSeriesQuery} variables={{ id }}>
                        {({ loading, error, data }) => {
                            return (
                                <>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            bottomPopupRef.current.close();
                                            navigation.navigate('Player', {
                                                uri:
                                                    data?.series?.watch[0]
                                                        ?.link_subtitle !== null
                                                        ? data?.series?.watch[0]?.link_subtitle?.replace(
                                                              'iframe',
                                                              'download'
                                                          )
                                                        : data?.series?.watch[0]?.link_dugging?.replace(
                                                              'iframe',
                                                              'download'
                                                          ),
                                            });
                                        }}
                                    >
                                        <Icon.Download
                                            fill="white"
                                            width={30}
                                            height={30}
                                        />
                                        <Text style={styles.menuText}>
                                            Bölümü İndir
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            );
                        }}
                    </Query>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            bottomPopupRef.current.close();
                            if (typeof getNext() != 'undefined') {
                                updateList({
                                    variables: {
                                        user_id: store.user.id,
                                        _id: id,
                                        season: parseInt(getNext()?.season),
                                        episode: parseInt(getNext()?.episode),
                                    },
                                }).then(() => refreshing());
                            } else {
                                removeList({
                                    variables: {
                                        user_id: store.user.id,
                                        _id: id,
                                    },
                                }).then(() => refreshing());
                            }
                        }}
                    >
                        <Icon.Checkmark fill="white" width={30} height={30} />
                        <Text style={styles.menuText}>İzledim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            bottomPopupRef.current.close();
                            removeList({
                                variables: {
                                    user_id: userId,
                                    _id: id,
                                },
                            }).then(() => refreshing());
                        }}
                    >
                        <Icon.Close fill="white" width={30} height={30} />
                        <Text style={styles.menuText}>Bu Satırdan Çıkar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </RBSheet>
    );
}

BottomPopup.propTypes = {
    bottomPopupRef: PropTypes.any.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    getNext: PropTypes.func.isRequired,
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 10,
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    title: {
        flex: 1,
        color: 'white',
        fontWeight: 'bold',
    },
    menuItem: {
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
