import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Modal
import Modal from 'react-native-modal';

// Icons
import * as Icon from '../../components/icons';

export default function HomeMenu({ navigation }) {
    const [genresModalVisible, setGenresModalVisible] = useState(false);

    const genresModalToggle = () => {
        setGenresModalVisible(!genresModalVisible);
    };

    const genres = [
        'Komedi',
        'Bilim Kurgu',
        'Korku',
        'Romantik',
        'Aksiyon',
        'Gerilim',
        'Dram',
        'Gizem',
        'Suç',
        'Animasyon',
        'Macera',
        'Fantastik',
        'Savaş',
    ];

    return (
        <>
            <Modal
                isVisible={genresModalVisible}
                style={styles.modalContainer}
                onBackButtonPress={() => genresModalToggle()}
                backdropOpacity={0.9}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionInTiming={0}
                backdropTransitionOutTiming={0}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingVertical: 100,
                    }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {genres.map((genre) => (
                        <TouchableOpacity
                            key={genre}
                            style={styles.modalTitleContainer}
                            onPress={() => {
                                genresModalToggle();
                                navigation.navigate('Genre', {
                                    genre,
                                });
                            }}
                        >
                            <Text style={[styles.modalTitle]}>{genre}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalCloseContainer}
                    onPress={() => genresModalToggle()}
                >
                    <Icon.Close width={24} height={24} fill="#121313" />
                </TouchableOpacity>
            </Modal>
            <View style={styles.container}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Series')}
                >
                    <Text style={styles.menuItemText}>Diziler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Movies')}
                >
                    <Text style={styles.menuItemText}>Filmler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => genresModalToggle()}
                    style={styles.menuItemContainer}
                >
                    <Text style={styles.menuItemText}>Kategoriler</Text>
                    <Icon.BottomArrowFilled
                        width={10}
                        height={10}
                        fill="white"
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}

HomeMenu.propTypes = {
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 50,
        paddingTop: 10,
    },
    menuItemContainer: {
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        color: 'white',
        marginRight: 5,
        fontFamily: 'AktifoBSemiBold',
    },
    modalContainer: {
        alignItems: 'center',
    },
    modalTitleContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    modalTitle: {
        color: '#B3B3B3',
        fontSize: 20,
    },
    modalActiveTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
    },
    modalCloseContainer: {
        width: 50,
        height: 50,
        borderRadius: 32.5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
