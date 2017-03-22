// Libraries for component rendering
import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

const IconButton = ({ onPress, children }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.transparentBackgroundButton}>
            { children }
        </TouchableOpacity>
    );
};

const styles = {
    transparentBackgroundButton: {
        backgroundColor: "transparent",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#E10019",
        paddingLeft: 19,
        paddingRight: 19,
        paddingTop: 10,
        paddingBottom: 10
    }
};

export { IconButton };
