import React from 'react';
import { TouchableOpacity } from 'react-native';

// PropTypes
import PropTypes from 'prop-types';

// Apollo
import { Query } from 'react-apollo';

// Queries
import { getMovieQuery, getSeriesQuery } from '../queries';

export default function PlayButton(props) {
    const { style, navigation, bottomPopupRef, id, type } = props;
    return (
        <Query
            query={type == 'movie' ? getMovieQuery : getSeriesQuery}
            variables={{ id }}
        >
            {({ loading, error, data }) => {
                var firstEpisode = data?.series?.watch?.filter(
                    (episodes) => episodes.episode == 1 && episodes.season == 1
                )[0];
                return (
                    <>
                        <TouchableOpacity
                            style={style}
                            onPress={() => {
                                bottomPopupRef &&
                                    bottomPopupRef.current.close();
                                type == 'movie'
                                    ? navigation.navigate('Player', {
                                          uri:
                                              data?.movie?.watch
                                                  ?.link_subtitle !== null
                                                  ? data?.movie?.watch
                                                        ?.link_subtitle
                                                  : data?.movie?.watch
                                                        ?.link_dugging,
                                      })
                                    : navigation.navigate('Player', {
                                          uri:
                                              firstEpisode?.link_subtitle ==
                                              null
                                                  ? firstEpisode?.link_dugging
                                                  : firstEpisode?.link_subtitle,
                                      });
                            }}
                        >
                            {props.children}
                        </TouchableOpacity>
                    </>
                );
            }}
        </Query>
    );
}

PlayButton.propTypes = {
    style: PropTypes.object.isRequired,
    navigation: PropTypes.any.isRequired,
    bottomPopupRef: PropTypes.any,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};
