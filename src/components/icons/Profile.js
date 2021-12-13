import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

function Profile(props) {
    return (
        <Svg
            height={24}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            />
            <Circle
                cx={12}
                cy={7}
                fill="none"
                r={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
            />
        </Svg>
    );
}

export default Profile;
