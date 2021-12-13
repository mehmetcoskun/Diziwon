import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function PlayOutline(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            {...props}
        >
            <Path d="M256 0C114.608 0 0 114.608 0 256s114.608 256 256 256 256-114.608 256-256S397.392 0 256 0zm0 496C123.664 496 16 388.336 16 256S123.664 16 256 16s240 107.664 240 240-107.664 240-240 240z" />
            <Path d="M189.776 141.328v229.664L388.672 256.16z" />
        </Svg>
    );
}

export default PlayOutline;
