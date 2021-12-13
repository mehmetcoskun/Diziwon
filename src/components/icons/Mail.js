import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Mail(props) {
    return (
        <Svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
            <Path d="M25 4H7a5 5 0 00-5 5v14a5 5 0 005 5h18a5 5 0 005-5V9a5 5 0 00-5-5zM7 6h18a3 3 0 012.4 1.22h-.08L18 15.79a3 3 0 01-4.06 0L4.68 7.26H4.6A3 3 0 017 6zm18 20H7a3 3 0 01-3-3V9.36l8.62 7.9a5 5 0 006.76 0L28 9.36V23a3 3 0 01-3 3z" />
        </Svg>
    );
}

export default Mail;
