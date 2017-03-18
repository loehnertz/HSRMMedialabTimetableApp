import React, { Component } from 'react';
import {
    Text,
    View,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import ListItem from './ListItemComponent';

class DayView extends Component {
    componentWillMount() {
        this.createDataSource(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.createDataSource(nextProps);
    }

    createDataSource({ events }) {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(events);
    }

    renderRow(event) {
        let masterdataJSON = JSON.parse(this.props.masterdata);
        let eventJSON = JSON.parse(event);

        let eventName = _.find(masterdataJSON["programs"][this.props.program]["courses"], { 'course': eventJSON["course"] })["shortname"];
        let eventRoom = eventJSON["rooms"][0];
        let eventLecturers = [];
        for (let lecturer in eventJSON["lecturers"]) {
            eventLecturers.push(_.get(masterdataJSON["persons"], eventJSON["lecturers"][lecturer])["name"]);
        }
        eventLecturers = JSON.stringify(eventLecturers);
        let eventNote = eventJSON["note"];

        return <ListItem eventName={eventName} eventRoom={eventRoom} eventLecturers={eventLecturers} eventNote={eventNote} />;
    }

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{this.props.day}</Text>
                </View>
                <View style={styles.flex}>
                    <ListView
                        enableEmptySections
                        dataSource={this.dataSource}
                        renderRow={this.renderRow.bind(this)}
                        style={styles.flex}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    header: {
        alignItems: "center",
        backgroundColor: "#F6F6F6",
        padding: 10
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    flex: {
        flex: 1
    }
};

const mapStateToProps = state => {
    return {
        program: state.login.program
    }
};

export default connect(mapStateToProps, {})(DayView);
