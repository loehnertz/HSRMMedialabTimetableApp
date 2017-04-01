// Libraries for component rendering
import React from 'react';
import {
    Text,
    View
} from 'react-native';

const CardSection = (props) => {
    return (
        <View style={[styles.containerStyle, props.style]}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderColor: "#DDD",
        position: "relative"
    }
};

export { CardSection };
