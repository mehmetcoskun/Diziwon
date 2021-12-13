import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Search = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
        <Path
            d="M4 11.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 1 1-15 0M17 17l4 4"
            strokeWidth={2}
        />
    </Svg>
);

export default Search;
