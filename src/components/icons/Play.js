import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function Play(props) {
    const { color, ...other } = props;
    return (
        <Svg width={24} height={24} viewBox="0 0 11 14" {...other}>
            <G fill="none" fillRule="evenodd">
                <Path d="M-7-5h24v24H-7z" />
                <Path
                    d="M0 1.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 000-1.69L1.54.98A.998.998 0 000 1.82z"
                    fill={color}
                />
            </G>
        </Svg>
    );
}

export default Play;
