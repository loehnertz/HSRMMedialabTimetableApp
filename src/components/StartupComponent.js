// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { dispatchMasterdata, dispatchSettings, isUserLoggedIn } from '../actions';

class Startup extends Component {
    async componentDidMount() {
        await this.props.dispatchMasterdata();
        await this.props.dispatchSettings();
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

export default connect(null, { dispatchMasterdata, dispatchSettings, isUserLoggedIn })(Startup);
