import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// React Navigation
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useQuery } from 'react-apollo';

// Store
import { store } from '../store';

// Components
import KeepWatchingItem from './KeepWatchingItem';

export default function KeepWatchingList({
    menuTitle,
    query,
    variables,
    navigation,
    refreshing,
}) {
    const { data, fetchMore, refetch } = useQuery(query, {
        variables: {
            ...variables,
        },
    });

    const isFocused = useIsFocused();
    useEffect(() => {
        refetch();
        if (isFocused) {
            refetch();
        }
    }, [refreshing, isFocused]);

    const renderItem = ({
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
            userId={store.user.id}
            navigation={navigation}
            refreshing={refetch}
            style={{ width: 110, height: 139 }}
        />
    );

    return data?.getKeepWatchingList.length ? (
        <View style={styles.body}>
            <View style={styles.menuTitleContainer}>
                <Text style={styles.menuTitle}>{menuTitle}</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={data?.getKeepWatchingList}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    onEndReachedThreshold={1}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={() => {
                        fetchMore({
                            variables: {
                                ...variables,
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
                />
            </View>
        </View>
    ) : null;
}

KeepWatchingList.propTypes = {
    menuTitle: PropTypes.string.isRequired,
    query: PropTypes.any.isRequired,
    variables: PropTypes.object.isRequired,
    navigation: PropTypes.any.isRequired,
    refreshing: PropTypes.any,
};

const styles = StyleSheet.create({
    body: {
        marginLeft: 5,
    },
    menuTitleContainer: {
        flexDirection: 'column',
        marginBottom: 2,
    },
    menuTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'NunitoBlack',
    },
    contentContainer: {
        flexDirection: 'row',
        marginHorizontal: -5,
    },
});
