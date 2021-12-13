import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DownloadFilled = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path fill="none" d="M0 0h24v24H0z" stroke="#00000000" />
        <Path
            fill="#ffffffff"
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm1-8 2.8-2.2 1.2 1.6-5 3.85-5-3.85 1.2-1.6L11 14V6h2v8Z"
            stroke="#00000000"
        />
    </Svg>
);

export default DownloadFilled;
