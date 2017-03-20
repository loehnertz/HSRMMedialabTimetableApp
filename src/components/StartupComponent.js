// Imports
import React, { Component } from 'react';
import {
    View,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { dispatchMasterdata, dispatchSettings, isUserLoggedIn } from '../actions';

class Startup extends Component {
    componentWillMount() {
        this.props.isUserLoggedIn();
    }

    async componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            await nextProps.dispatchMasterdata();
            await nextProps.dispatchSettings(nextProps.user);
        }
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

const mapStateToProps = state => {
    return {
        user: state.login.user
    }
};

export default connect(mapStateToProps, { dispatchMasterdata, dispatchSettings, isUserLoggedIn })(Startup);
