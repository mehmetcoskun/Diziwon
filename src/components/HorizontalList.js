import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Apollo
import { useQuery } from 'react-apollo';

// Components
import Item from './Item';

export default function HorizontalList({
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

    useEffect(() => {
        refetch();
    }, [refreshing]);

    const renderItem = ({
        item: { id, type, title, original_title, poster },
    }) => (
        <Item
            id={id}
            type={type}
            title={title == null ? original_title : title}
            poster={poster}
            navigation={navigation}
            style={{ width: 110, height: 149 }}
        />
    );

    return (
        <View style={styles.body}>
            <View style={styles.menuTitleContainer}>
                <Text style={styles.menuTitle}>{menuTitle}</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={data?.datas}
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
    );
}

HorizontalList.propTypes = {
    menuTitle: PropTypes.string.isRequired,
    query: PropTypes.any.isRequired,
    variables: PropTypes.object.isRequired,
    navigation: PropTypes.any.isRequired,
    refreshing: PropTypes.bool,
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
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'FreeSansBold',
    },
    contentContainer: {
        flexDirection: 'row',
        marginHorizontal: -5,
    },
});
