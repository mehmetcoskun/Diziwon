import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeFilled = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path d="M14 21h7V9.5l-9-6.75L3 9.5V21h7v-6h4v6Z" />
    </Svg>
);

export default HomeFilled;
