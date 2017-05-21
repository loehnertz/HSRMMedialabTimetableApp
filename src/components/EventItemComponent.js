import React, { Component } from 'react';
import {
    Text,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection } from './common';

class EventItem extends Component {
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

    titleTextFlex() {
        // TODO: Sometimes this is not working especially when going from 'lanscape' to 'portrait' (see Issue #28)
        if (this.props.orientation === 'PORTRAIT') {
            return ({ flexGrow: -1, flex: 12 });
        } else if (this.props.orientation === 'LANDSCAPE') {
            return ({ flex: -1, flexGrow: 12 });
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback>
                <Card>
                    <CardSection>
                        <Image source={require('../assets/images/clock.png')} style={styles.imageTitle} />
                        <Text style={[styles.titleText, this.titleTextFlex()]}>
                            {this.props.eventSlot}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/subject.png')} style={styles.imageTitle} />
                        <Text style={[styles.titleText, this.titleTextFlex()]}>
                            {this.props.eventName}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/house.png')} style={styles.imageTitle} />
                        <Text style={[styles.titleText, this.titleTextFlex()]}>
                            {this.props.eventRoom}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/person.png')} style={styles.imageTitle} />
                        <Text style={[styles.titleText, this.titleTextFlex()]}>
                            {this.renderLecturers()}
                        </Text>
                    </CardSection>
                    <CardSection>
                        <Image source={require('../assets/images/note.png')} style={styles.imageTitle} />
                        <Text style={[styles.titleText, this.titleTextFlex()]}>
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

const mapStateToProps = state => {
    return {
        orientation: state.timetable.orientation
    }
};

export default connect(mapStateToProps, {})(EventItem);
