import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Paperplane(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512.001 512.001"
            {...props}
        >
            <Path d="M507.608 4.395a15 15 0 00-16.177-3.321L9.43 193.872a15.002 15.002 0 00-.975 27.424l190.068 92.181 92.182 190.068a14.999 14.999 0 0027.423-.974l192.8-481.998a15.001 15.001 0 00-3.32-16.178zM52.094 209.118L434.72 56.069 206.691 284.096 52.094 209.118zm250.789 250.789l-74.979-154.599 228.03-228.027-153.051 382.626z" />
        </Svg>
    );
}

export default Paperplane;
