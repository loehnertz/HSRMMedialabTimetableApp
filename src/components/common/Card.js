// Libraries for component rendering
import React from 'react';
import {
    Text,
    View
} from 'react-native';

const Card = (props) => {
    return (
        <View style={[styles.containerStyle, props.style]}>
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
        shadowColor: '#333333',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowRadius: 2,
        shadowOpacity: 0.60,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8
    }
};

export { Card };
