import React, { Component } from 'react';
import {
    Modal,
    TouchableOpacity
} from 'react-native';

class EventModal extends Component {
    handleContainerPress(event) {
        let pressedTargetId = event.nativeEvent.target;

        if (pressedTargetId === this.state.containerTargetId) {
            this.props.onClose();
        }
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                onRequestClose={() => this.props.onClose()}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity
                    onLayout={(event) => this.setState({ containerTargetId: event.nativeEvent.target })}
                    onPress={this.handleContainerPress.bind(this)}
                    activeOpacity={1.0}
                    style={styles.modalContainer}
                >
                    {this.props.children}
                </TouchableOpacity>
            </Modal>
        );
    }
}

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.55)"
    }
};

export { EventModal };
