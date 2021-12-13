import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function Pencil(props) {
    return (
        <Svg height={512} viewBox="0 0 488.471 488.471" width={512} {...props}>
            <Path d="M288.674 62.363L351.035.002l137.362 137.361-62.361 62.361zM245.547 105.541L0 351.088V488.47h137.382L382.93 242.923z" />
        </Svg>
    );
}

export default Pencil;
