// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { isUserLoggedIn } from '../actions';

class Startup extends Component {
    componentDidMount() {
        this.props.isUserLoggedIn();
    }

    render() {
        return (
            <View style={styles.spinner}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }
}

const styles = {
    spinner: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};

export default connect(null, { isUserLoggedIn })(Startup);