import React, { Component } from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';

class DayView extends Component {
    render() {
        return (
            <View style={styles.headerDay}>
                <View>
                    <Text>{this.props.week}</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    headerDay: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#CCCCCC",
        padding: 10
    },
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

export default DayView;
