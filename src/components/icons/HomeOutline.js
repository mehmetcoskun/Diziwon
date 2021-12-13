import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const HomeOutline = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path d="M21 21h-8v-5h-2v5H3V9.5l9-6.75 9 6.75V21Zm-6-2h4v-8.5l-7-5.25-7 5.25V19h4v-5h6v5Z" />
    </Svg>
);

export default HomeOutline;
