import React, { Component } from 'react';
import { AppRegistry, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

// Create a component
class MainScene extends Component {
    static navigationOptions = {
        title: 'Willkommen',
    };

    render() {
        return (
            <Text>STUNDENPLAN</Text>
        );
    }
}

const App = StackNavigator({
    Main: { screen: MainScene },
});

AppRegistry.registerComponent('HSRMMedialabTimetableApp', () => App);
