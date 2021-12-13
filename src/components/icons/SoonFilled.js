import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SoonFilled = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path fill="none" d="M0 0h24v24H0z" stroke="#00000000" />
        <Path
            fill="#ffffffff"
            d="M18.995 8c.552 0 1.052.224 1.414.586.322.322.535.752.578 1.232l.008.182v9c0 .552-.224 1.052-.586 1.414a1.994 1.994 0 0 1-1.232.578l-.182.008h-9a1.994 1.994 0 0 1-1.414-.586 1.994 1.994 0 0 1-.578-1.232L7.995 19v-9c0-.552.224-1.052.586-1.414a1.994 1.994 0 0 1 1.232-.578L9.995 8h9ZM11.7 9.57v9.86l7.887-4.93L11.7 9.57Z"
            stroke="#ffffffff"
            strokeWidth={2}
        />
        <Path
            fill="#ffffffff"
            d="M15.803 4.454 16.076 6h-2.031l-.211-1.198a1 1 0 0 0-1.159-.811L4.802 5.379a1 1 0 0 0-.811 1.158l1.389 7.879a1 1 0 0 0 .62.758v2.047a3.001 3.001 0 0 1-2.59-2.458L2.02 6.885a3 3 0 0 1 2.434-3.476l7.874-1.388a3 3 0 0 1 3.475 2.433Z"
            stroke="#00000000"
        />
    </Svg>
);

export default SoonFilled;
