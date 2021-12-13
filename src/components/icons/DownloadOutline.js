import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DownloadOutline = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path fill="none" d="M0 0h24v24H0z" stroke="#00000000" />
        <Path
            fill="gray"
            d="m13 14 2.8-2.2 1.2 1.6-5 3.85-5-3.85 1.2-1.6L11 14V6h2z"
        />
        <Path
            fill="#00000000"
            d="M3 12a9 9 0 1 1 18 0 9 9 0 1 1-18 0"
            stroke="gray"
            strokeWidth={2}
        />
    </Svg>
);

export default DownloadOutline;
