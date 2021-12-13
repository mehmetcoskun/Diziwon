import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';

function BackArrow(props) {
    return (
        <Svg
            viewBox="0 0 11 20"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G fill="none" fillRule="evenodd">
                <Path opacity={0.87} d="M-6-2h24v24H-6z" />
                <Path
                    d="M10.62.99a1.25 1.25 0 00-1.77 0L.54 9.3a.996.996 0 000 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L3.38 10l7.25-7.25c.48-.48.48-1.28-.01-1.76z"
                    fill="white"
                />
            </G>
        </Svg>
    );
}

export default BackArrow;
