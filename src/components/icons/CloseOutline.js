import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

function CloseOutline(props) {
    return (
        <Svg viewBox='0 0 128 128' {...props}>
            <Circle fill='#525252' cx={64} cy={64} r={64} />
            <Path
                d='M100.3 90.4L73.9 64l26.3-26.4c.4-.4.4-1 0-1.4l-8.5-8.5c-.4-.4-1-.4-1.4 0L64 54.1 37.7 27.8c-.4-.4-1-.4-1.4 0l-8.5 8.5c-.4.4-.4 1 0 1.4L54 64 27.7 90.3c-.4.4-.4 1 0 1.4l8.5 8.5c.4.4 1.1.4 1.4 0L64 73.9l26.3 26.3c.4.4 1.1.4 1.5.1l8.5-8.5c.4-.4.4-1 0-1.4z'
                fill='#fff'
            />
        </Svg>
    );
}

export default CloseOutline;
