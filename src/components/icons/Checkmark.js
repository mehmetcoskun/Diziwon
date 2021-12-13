import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Checkmark(props) {
    return (
        <Svg width={92} height={92} viewBox="0 0 92 92" {...props}>
            <Path d="M34.4 72c-1.2 0-2.3-.4-3.2-1.3L11.3 50.8c-1.8-1.8-1.8-4.6 0-6.4 1.8-1.8 4.6-1.8 6.4 0l16.8 16.7 39.9-39.8c1.8-1.8 4.6-1.8 6.4 0 1.8 1.8 1.8 4.6 0 6.4l-43.1 43c-1 .9-2.1 1.3-3.3 1.3z" />
        </Svg>
    );
}

export default Checkmark;