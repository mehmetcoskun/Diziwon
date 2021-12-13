import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function Help(props) {
    return (
        <Svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
            <G fill="none" fillRule="evenodd">
                <Path d="M-2-2h24v24H-2z" />
                <Path
                    d="M9 16h2v-2H9v2zm1-16C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14C7.79 4 6 5.79 6 8h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"
                    fill="#B3B3B3"
                />
            </G>
        </Svg>
    );
}

export default Help;
