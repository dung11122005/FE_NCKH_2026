import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";

interface IOtpModalProps {
    visible: boolean;
    onSuccess: (otp: string) => void;
    onCancel?: () => void;
    duration?: number; // thời gian hết hạn OTP (giây)
}

const OtpModal: React.FC<IOtpModalProps> = ({
    visible,
    onSuccess,
    onCancel,
    duration = 60,
}) => {
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(duration);

    useEffect(() => {
        if (!visible) return;

        setCountdown(duration);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [visible]);

    const handleChange = (text: string) => {
        const filtered = text.replace(/\D/g, "");
        if (filtered.length <= 6) setOtp(filtered);

        if (filtered.length === 6) {
            onSuccess(filtered);
            setOtp("");
        }
    };

    const handleResend = () => {
        setCountdown(duration);
        // Gọi API resend OTP ở đây
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Nhập mã OTP</Text>
                    <Text style={styles.subtitle}>
                        OTP đã gửi tới số điện thoại của bạn
                    </Text>
                    <Text style={styles.countdown}>Còn lại: {countdown}s</Text>
                    <TextInput
                        value={otp}
                        onChangeText={handleChange}
                        keyboardType="numeric"
                        maxLength={6}
                        style={styles.input}
                        autoFocus
                    />
                    <TouchableOpacity
                        disabled={countdown > 0}
                        onPress={handleResend}
                        style={{ marginTop: 8 }}
                    >
                        <Text style={{ color: countdown > 0 ? "#aaa" : "#00339a" }}>
                            Gửi lại mã
                        </Text>
                    </TouchableOpacity>
                    {onCancel && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onCancel}
                        >
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
        marginBottom: 8,
        color: "#00339a",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        textAlign: "center",
    },
    countdown: {
        fontSize: 16,
        color: "#ff4d4d",
        marginBottom: 12,
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
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#00339a",
        marginTop: 10,
    },
    cancelText: {
        color: "#00339a",
        fontSize: 16,
    },
});

export default OtpModal;
