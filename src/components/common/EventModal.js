import React from 'react';
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

const EventModal = ({ children, visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {}}
        >
            <View style={styles.modalContainer}>
                <Card style={styles.modalCard}>
                    <CardSection style={styles.modalCardSection}>
                        <Text style={styles.modalText}>
                            {children}
                        </Text>
                    </CardSection>

                    <CardSection>
                        <Button onPress={onClose}>
                            {i18n.t('close')}
                        </Button>
                    </CardSection>
                </Card>
            </View>
        </Modal>
    );
};

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
