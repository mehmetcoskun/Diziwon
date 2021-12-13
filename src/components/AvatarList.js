import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Store
import { store } from '../store';

// Types
import { SET_USER_TEMP_AVATAR } from '../store/types';

export default function AvatarList({ navigation, datas }) {
    const renderItem = ({ item: { avatar_group, uri } }) => (
        <>
            <View style={styles.menuTitleContainer}>
                <Text style={styles.menuTitle}>{avatar_group}</Text>
            </View>
            <View style={styles.contentContainer}>
                <FlatList
                    data={uri}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                store.setStore(SET_USER_TEMP_AVATAR, item);
                                navigation.goBack();
                            }}
                        >
                            <Image
                                source={{
                                    uri:
                                        store.settings.assets_url +
                                        '/avatars' +
                                        item,
                                }}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={datas}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

AvatarList.propTypes = {
    datas: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginTop: 20,
    },
    menuTitleContainer: {
        flexDirection: 'column',
        marginBottom: 15,
    },
    menuTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    contentContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginLeft: -10,
    },
    image: {
        width: 110,
        height: 110,
        marginLeft: 10,
    },
});
