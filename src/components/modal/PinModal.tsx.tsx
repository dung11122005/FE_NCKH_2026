import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";

interface IPinModalProps {
    visible: boolean;
    onSuccess: (pin: string) => void;
    onCancel?: () => void;
}

const PinModal: React.FC<IPinModalProps> = ({ visible, onSuccess, onCancel }) => {
    const [pin, setPin] = useState("");

    const handleChange = (text: string) => {
        const filtered = text.replace(/\D/g, ""); // chỉ cho nhập số
        if (filtered.length <= 6) setPin(filtered);

        if (filtered.length === 6) {
            onSuccess(filtered); // gọi callback khi nhập đủ 6 số
            setPin(""); // reset input
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Nhập mã PIN</Text>
                    <TextInput
                        value={pin}
                        onChangeText={handleChange}
                        keyboardType="numeric"
                        maxLength={6}
                        secureTextEntry
                        style={styles.input}
                        autoFocus
                    />
                    <Text style={styles.note}>Nhập 6 số PIN để xác nhận</Text>
                    {onCancel && (
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.cancelText}>Hủy</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
        color: "#00339a",
    },
    input: {
        width: "60%",
        fontSize: 24,
        borderBottomWidth: 1,
        borderColor: "#00339a",
        textAlign: "center",
        marginBottom: 12,
        letterSpacing: 12,
    },
    note: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#00339a",
    },
    cancelText: {
        color: "#00339a",
        fontSize: 16,
    },
});

export default PinModal;
