import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function MoreDotVertical(props) {
    return (
        <Svg
            width={4}
            height={16}
            viewBox="0 0 4 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G fill="none" fillRule="evenodd">
                <Path d="M-10-4h24v24h-24z" />
                <Path
                    d="M2 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2C.9 6 0 6.9 0 8s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    fill="#B3B3B3"
                />
            </G>
        </Svg>
    );
}

export default MoreDotVertical;
