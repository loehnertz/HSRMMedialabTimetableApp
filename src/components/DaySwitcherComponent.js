import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';

class DaySwitcher extends Component {
    render() {
        return (
            <View style={styles.bottomBar}>
                <Text>{this.props.day}</Text>
            </View>
        );
    }
}

const styles = {
    bottomBar: {
        position: "absolute",
        bottom: 0,
        alignSelf: "center",
        padding: 20
    }
};

export default DaySwitcher;
