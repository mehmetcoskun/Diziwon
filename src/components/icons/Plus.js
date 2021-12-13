import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Plus(props) {
    return (
        <Svg width={21} height={20} viewBox="0 0 21 20" {...props}>
            <Path
                d="M21 9v2h-9.45v9h-2.1v-9H0V9h9.45V0h2.1v9z"
                fillRule="evenodd"
            />
        </Svg>
    );
}

export default Plus;
