// Libraries for component rendering
import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity
} from 'react-native';

class IconButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={[styles.transparentBackgroundButton, this.props.style]}>
                { this.props.children }
            </TouchableOpacity>
        );
    }
}

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
