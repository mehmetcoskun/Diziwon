import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, Platform, ToastAndroid } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// React Navigation
import { useIsFocused } from '@react-navigation/native';

// Apollo
import { useMutation, useQuery } from 'react-apollo';

// Store
import { store } from '../store';

// Queries
import { addWatchList, controlWatchList, removeWatchList } from '../queries';

// Icons
import * as Icon from './icons';

export default function ToggleWatchListButton(props) {
    const { id, iconStyle, textStyle } = props;

    const [watchListButtonToggle, setWatchListButtonToggle] = useState(false);

    const { data: controlWatchListData, refetch } = useQuery(controlWatchList, {
        variables: {
            _id: id,
            user_id: store.user.id,
        },
    });

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused]);

    useEffect(() => {
        if (controlWatchListData?.controlWatchList === true) {
            setWatchListButtonToggle(true);
        } else {
            setWatchListButtonToggle(false);
        }
    }, [controlWatchListData, id]);

    const [addList] = useMutation(addWatchList);
    const [removeList] = useMutation(removeWatchList);

    const _watchListButtonToggle = () => {
        setWatchListButtonToggle(!watchListButtonToggle);
        if (watchListButtonToggle === true) {
            removeList({
                variables: { _id: id, user_id: store.user.id },
            }).then(() => {
                if (Platform.OS == 'android') {
                    ToastAndroid.show(
                        'Listemden çıkarıldı',
                        ToastAndroid.SHORT
                    );
                }
                setWatchListButtonToggle(false);
            });
        } else {
            addList({
                variables: { _id: id, user_id: store.user.id },
            }).then(() => {
                if (Platform.OS == 'android') {
                    ToastAndroid.show('Listeme eklendi', ToastAndroid.SHORT);
                }
                setWatchListButtonToggle(true);
            });
        }
    };

    return (
        <TouchableOpacity
            style={iconStyle}
            onPress={() => _watchListButtonToggle()}
        >
            {watchListButtonToggle === true ? (
                <Icon.Checkmark fill="white" width={20} height={20} />
            ) : (
                <Icon.Plus width={20} height={20} fill="white" />
            )}
            <Text style={textStyle}>Listem</Text>
        </TouchableOpacity>
    );
}

ToggleWatchListButton.propTypes = {
    id: PropTypes.string.isRequired,
    iconStyle: PropTypes.object.isRequired,
    textStyle: PropTypes.object.isRequired,
};
