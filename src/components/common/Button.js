// Libraries for component rendering
import React from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

const Button = ({ onPress, children }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.centeredButton}>
            <Text style={styles.centeredButtonText}>
                { children }
            </Text>
        </TouchableOpacity>
    );
};

const styles = {
    centeredButton: {
        flex: 1,
        alignSelf: "stretch",
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "limegreen",
        margin: 10
    },
    centeredButtonText: {
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "bold",
        color: "limegreen",
        paddingTop: 10,
        paddingBottom: 10
    }
};

export { Button };
