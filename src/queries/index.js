import { gql } from 'apollo-boost';

export const getMovieQuery = gql`
    query ($id: ID!) {
        movie(id: $id) {
            id
            imdb_id
            type
            title
            original_title
            poster
            backdrop
            backdrop_withtitle
            genres
            summary
            year
            imdb_rating
            maturity
            runtime
            counter
            watch {
                link_subtitle
                link_dugging
            }
        }
    }
`;

export const getSeriesQuery = gql`
    query ($id: ID!) {
        series(id: $id) {
            id
            imdb_id
            type
            title
            original_title
            poster
            backdrop
            backdrop_withtitle
            genres
            summary
            year
            imdb_rating
            maturity
            runtime
            counter
            watch {
                link_subtitle
                link_dugging
                season
                episode
                name
                overview
                still_path
            }
        }
    }
`;

export const getDatasQuery = gql`
    query (
        $sort: String
        $limit: Int
        $offset: Int
        $featured: String
        $sortByType: String
        $random: Boolean
        $search: String
        $genre: String
    ) {
        datas(
            sort: $sort
            limit: $limit
            offset: $offset
            featured: $featured
            sortByType: $sortByType
            random: $random
            search: $search
            genre: $genre
        ) {
            id
            imdb_id
            type
            title
            original_title
            poster
            backdrop
            backdrop_withtitle
            genres
            summary
            year
            imdb_rating
            maturity
            runtime
            counter
        }
    }
`;

export const login = gql`
    mutation (
        $email: String!
        $password: String!
        $device_brand: String
        $device_model: String
        $device_os_version: String
        $app_version: String
    ) {
        login(
            data: {
                email: $email
                password: $password
                device_brand: $device_brand
                device_model: $device_model
                device_os_version: $device_os_version
                app_version: $app_version
            }
        ) {
            token
        }
    }
`;

export const register = gql`
    mutation (
        $avatar: String!
        $full_name: String!
        $email: String!
        $password: String!
        $last_active: String!
        $device_brand: String
        $device_model: String
        $device_os_version: String
        $app_version: String
    ) {
        register(
            data: {
                avatar: $avatar
                full_name: $full_name
                email: $email
                password: $password
                last_active: $last_active
                device_brand: $device_brand
                device_model: $device_model
                device_os_version: $device_os_version
                app_version: $app_version
            }
        )
    }
`;

export const getUsers = gql`
    query ($sort: String, $limit: Int, $offset: Int) {
        getUsers(sort: $sort, limit: $limit, offset: $offset) {
            id
            avatar
            full_name
            email
            authority
            status
            last_active
            device_brand
            device_model
            device_os_version
            app_version
            ref_download
            createdAt
        }
    }
`;

export const getUserDetail = gql`
    query ($id: ID!) {
        getUserDetail(id: $id) {
            id
            avatar
            full_name
            email
            authority
            status
            last_active
            device_brand
            device_model
            device_os_version
            app_version
            ref_download
            createdAt
            watchlist {
                _id
                user_id
                info {
                    id
                    imdb_id
                    type
                    title
                    original_title
                    poster
                    backdrop
                    backdrop_withtitle
                    genres
                    summary
                    year
                    imdb_rating
                    maturity
                    runtime
                    counter
                }
            }
            keepwatchinglist {
                _id
                season
                episode
                info {
                    id
                    imdb_id
                    type
                    title
                    original_title
                    poster
                    backdrop
                    backdrop_withtitle
                    genres
                    summary
                    year
                    imdb_rating
                    maturity
                    runtime
                    counter
                }
            }
        }
    }
`;

export const getUser = gql`
    query ($token: String!) {
        getUser(token: $token) {
            id
            avatar
            full_name
            email
            authority
            status
            last_active
            device_brand
            device_model
            device_os_version
            app_version
            ref_download
            createdAt
        }
    }
`;

export const updateUser = gql`
    mutation (
        $id: ID!
        $avatar: String
        $full_name: String
        $last_active: String
        $device_brand: String
        $device_model: String
        $device_os_version: String
        $app_version: String
    ) {
        updateUser(
            data: {
                id: $id
                avatar: $avatar
                full_name: $full_name
                last_active: $last_active
                device_brand: $device_brand
                device_model: $device_model
                device_os_version: $device_os_version
                app_version: $app_version
            }
        ) {
            avatar
            full_name
            last_active
            device_brand
            device_model
            device_os_version
            app_version
        }
    }
`;

export const avatars = gql`
    {
        avatars {
            uri
            avatar_group
        }
    }
`;

export const getWatchList = gql`
    query ($user_id: ID!, $limit: Int, $offset: Int, $sort: String) {
        getWatchList(
            data: {
                user_id: $user_id
                limit: $limit
                offset: $offset
                sort: $sort
            }
        ) {
            _id
            user_id
            info {
                id
                imdb_id
                type
                title
                original_title
                poster
                backdrop
                backdrop_withtitle
                genres
                summary
                year
                imdb_rating
                maturity
                runtime
                counter
            }
        }
    }
`;

export const controlWatchList = gql`
    query ($_id: ID!, $user_id: ID!) {
        controlWatchList(data: { _id: $_id, user_id: $user_id })
    }
`;

export const addWatchList = gql`
    mutation ($_id: ID!, $user_id: ID!) {
        addWatchList(data: { _id: $_id, user_id: $user_id })
    }
`;

export const removeWatchList = gql`
    mutation ($_id: ID!, $user_id: ID!) {
        removeWatchList(data: { _id: $_id, user_id: $user_id })
    }
`;

export const getKeepWatchingList = gql`
    query ($user_id: ID!, $limit: Int, $offset: Int, $sort: String) {
        getKeepWatchingList(
            user_id: $user_id
            limit: $limit
            offset: $offset
            sort: $sort
        ) {
            _id
            season
            episode
            info {
                id
                imdb_id
                type
                title
                original_title
                poster
                backdrop
                backdrop_withtitle
                genres
                summary
                year
                imdb_rating
                maturity
                runtime
                counter
            }
        }
    }
`;

export const controlKeepWatchingList = gql`
    query ($user_id: ID!, $_id: ID!) {
        controlKeepWatchingList(user_id: $user_id, _id: $_id)
    }
`;

export const addKeepWatchingList = gql`
    mutation ($user_id: ID!, $_id: ID!, $season: Int!, $episode: Int!) {
        addKeepWatchingList(
            user_id: $user_id
            _id: $_id
            season: $season
            episode: $episode
        )
    }
`;

export const updateKeepWatchingList = gql`
    mutation ($user_id: ID!, $_id: ID!, $season: Int!, $episode: Int!) {
        updateKeepWatchingList(
            user_id: $user_id
            _id: $_id
            season: $season
            episode: $episode
        )
    }
`;

export const removeKeepWatchingList = gql`
    mutation ($user_id: ID!, $_id: ID!) {
        removeKeepWatchingList(user_id: $user_id, _id: $_id)
    }
`;

export const incrementCounter = gql`
    mutation ($id: ID!) {
        incrementCounter(id: $id)
    }
`;

export const Settings = gql`
    {
        Settings {
            app_name
            app_version
            assets_url
            share_app_text
            download_url
            download_ref_url
            share_text
            password_reset_url
            user_account_url
            help_url
            useragent
        }
    }
`;

export const request = gql`
    mutation ($title: String!, $user_id: ID!) {
        request(data: { title: $title, user_id: $user_id })
    }
`;

export const addMovie = gql`
    mutation ($imdbId: String!, $user_id: ID!) {
        addMovie(data: { imdbId: $imdbId, user_id: $user_id })
    }
`;

export const search = gql`
    query ($imdbId: String!) {
        search(imdbId: $imdbId) {
            title
            poster
        }
    }
`;

export const setUserStatus = gql`
    mutation ($id: ID!, $status: String!) {
        setUserStatus(id: $id, status: $status)
    }
`;

export const deleteUser = gql`
    mutation ($id: ID!) {
        deleteUser(id: $id)
    }
`;

export const getUpcomings = gql`
    {
        getUpcomings {
            title
            original_title
            backdrop_path
            overview
            release_date
        }
    }
`;
