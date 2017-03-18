import React, { Component } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { CardSection } from './common';

class ListItem extends Component {
    onRowPress() {
        console.log("Pressed");
    }

    renderLecturers() {
        let lecturersArray = JSON.parse(this.props.eventLecturers);
        let lecturersString = '';
        for (let lecturer in lecturersArray) {
            lecturersString = lecturersString + lecturersArray[lecturer];
            if (!(lecturer + 1) == lecturersArray.length) {  // Check if it's NOT the last iteration
                lecturersString = lecturersString + ', ';
            }
        }
        return lecturersString;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
                <View>
                    <CardSection style={styles.cardSection}>
                        <Text style={styles.title}>
                            {this.props.eventName}
                        </Text>
                        <Text style={styles.title}>
                            {this.props.eventRoom}
                        </Text>
                        <Text style={styles.title}>
                            {this.renderLecturers()}
                        </Text>
                    </CardSection>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    cardSection: {
        flexDirection: "column"
    },
    title: {
        fontSize: 18,
        paddingLeft: 15
    }
};

export default ListItem;
