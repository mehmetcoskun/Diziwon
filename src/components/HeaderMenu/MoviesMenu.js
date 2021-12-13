import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Modal
import Modal from 'react-native-modal';

// Icons
import * as Icon from '../../components/icons';

export default function MoviesMenu({
    setActiveGenre,
    activeGenre,
    navigation,
}) {
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [genresModalVisible, setGenresModalVisible] = useState(false);

    const typeModalToggle = () => {
        setTypeModalVisible(!typeModalVisible);
    };

    const genresModalToggle = () => {
        setGenresModalVisible(!genresModalVisible);
    };

    const genres = [
        'Tüm Kategoriler',
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
                isVisible={typeModalVisible}
                style={styles.modalContainer}
                onBackButtonPress={() => typeModalToggle()}
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
                    <TouchableOpacity
                        style={styles.modalTitleContainer}
                        onPress={() => {
                            typeModalToggle();
                            navigation.navigate('Home');
                        }}
                    >
                        <Text style={styles.modalTitle}>Ana Sayfa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalTitleContainer}
                        onPress={() => {
                            typeModalToggle();
                            navigation.navigate('Series');
                        }}
                    >
                        <Text style={styles.modalTitle}>Diziler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalTitleContainer}>
                        <Text
                            style={[styles.modalTitle, styles.modalActiveTitle]}
                        >
                            Filmler
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalCloseContainer}
                    onPress={() => typeModalToggle()}
                >
                    <Icon.Close width={24} height={24} fill="#121313" />
                </TouchableOpacity>
            </Modal>
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
                                setActiveGenre(genre);
                            }}
                        >
                            <Text
                                style={[
                                    styles.modalTitle,
                                    activeGenre == genre &&
                                        styles.modalActiveTitle,
                                ]}
                            >
                                {genre}
                            </Text>
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
                    onPress={() => typeModalToggle()}
                    style={styles.menuItemContainer}
                >
                    <Text style={styles.activeMenuItemText}>Filmler</Text>
                    <Icon.BottomArrowFilled
                        width={10}
                        height={10}
                        fill="white"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => genresModalToggle()}
                    style={styles.menuItemContainer}
                >
                    <Text style={styles.menuItemText}>{activeGenre}</Text>
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

MoviesMenu.propTypes = {
    setActiveGenre: PropTypes.any.isRequired,
    activeGenre: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        marginLeft: 20,
    },
    menuItemContainer: {
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeMenuItemText: {
        color: 'white',
        fontSize: 18,
        marginRight: 5,
        fontFamily: 'AktifoBSemiBold',
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
