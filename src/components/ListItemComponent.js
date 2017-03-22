import React, { Component } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    View,
    Image
} from 'react-native';
import { Card, CardSection } from './common';

class ListItem extends Component {
    onRowPress() {
        console.log("Pressed");
    }

    renderLecturers() {
        let lecturersArray = JSON.parse(this.props.eventLecturers);
        let lecturersString = '';
        for (let lecturer in lecturersArray) {
            lecturersString = lecturersString + lecturersArray[lecturer];
            if ((parseInt(lecturer) + 1) !== lecturersArray.length) {  // Check if it's NOT the last iteration
                lecturersString = lecturersString + ', ';
            }
        }
        return lecturersString;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
                <Card>
                    <CardSection>
                        <Image source={require('../assets/images/clock.png')} style={styles.imageTitle} />
                        <Text style={styles.titleText}>
                            {this.props.eventSlot}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/subject.png')} style={styles.imageTitle} />
                        <Text style={styles.titleText}>
                            {this.props.eventName}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/house.png')} style={styles.imageTitle} />
                        <Text style={styles.titleText}>
                            {this.props.eventRoom}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/person.png')} style={styles.imageTitle} />
                        <Text style={styles.titleText}>
                            {this.renderLecturers()}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/note.png')} style={styles.imageTitle} />
                        <Text style={styles.titleText}>
                            {this.props.eventNote}
                        </Text>
                    </CardSection>
                </Card>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = {
    cardSection: {
        flex: 1,
        flexDirection: "column"
    },
    titleText: {
        fontSize: 19
    },
    imageTitle: {
        height: 21,
        width: 21,
        marginRight: 11
    }
};

export default ListItem;
