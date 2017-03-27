import React, { Component } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { Card } from './Card';
import { CardSection } from './CardSection';
import { Button } from './Button';
import i18n from 'react-native-i18n';
import bundledTranslations from '../../translations';

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
                transparent={true}
                animationType="fade"
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    onLayout={(event) => this.setState({ containerTargetId: event.nativeEvent.target })}
                    onPress={this.handleContainerPress.bind(this)}
                    activeOpacity={1.0}
                    style={styles.modalContainer}
                >
                    <Card style={styles.modalCard}>
                        <CardSection style={styles.modalCardSection}>
                            <Text style={styles.modalText}>
                                {this.props.children}
                            </Text>
                        </CardSection>

                        <CardSection>
                            <Button onPress={this.props.onClose}>
                                {i18n.t('close')}
                            </Button>
                        </CardSection>
                    </Card>
                </TouchableOpacity>
            </Modal>
        );
    }
}

i18n.locale = 'de';
i18n.fallbacks = true;
i18n.translations = bundledTranslations;

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.55)"
    },
    modalCard: {
        width: (Dimensions.get('window')["width"] / 2),
        height: (Dimensions.get('window')["height"] / 2)
    },
    modalCardSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalText: {
        fontSize: 18,
        textAlign: "center"
    }
};

export { EventModal };
