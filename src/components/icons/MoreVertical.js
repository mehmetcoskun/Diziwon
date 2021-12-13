import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function MoreVertical(props) {
    return (
        <Svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="prefix__feather prefix__feather-menu"
            {...props}
        >
            <Path d="M3 12h18M3 6h18M3 18h18" />
        </Svg>
    );
}

export default MoreVertical;
