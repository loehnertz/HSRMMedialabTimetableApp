// Libraries for component rendering
import React from 'react';
import {
    Text,
    View
} from 'react-native';

const Card = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "#DDD",
        borderBottomWidth: 0,
        elevation: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5
    }
};

export { Card };
