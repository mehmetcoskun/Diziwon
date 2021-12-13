import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Close(props) {
    return (
        <Svg viewBox="0 0 32 32" {...props}>
            <Path d="M17.459 16.014l8.239-8.194a.992.992 0 000-1.414 1.016 1.016 0 00-1.428 0l-8.232 8.187L7.73 6.284a1.009 1.009 0 00-1.428 0 1.015 1.015 0 000 1.432l8.302 8.303-8.332 8.286a.994.994 0 000 1.414 1.016 1.016 0 001.428 0l8.325-8.279 8.275 8.276a1.009 1.009 0 001.428 0 1.015 1.015 0 000-1.432l-8.269-8.27z" />
        </Svg>
    );
}

export default Close;
