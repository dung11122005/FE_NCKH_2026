import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    BackHandler,
    Platform
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PaymentStackParamList, HomeStackParamList } from "../../navigation/types";

type PaymentWarningNavProp = StackNavigationProp<PaymentStackParamList & HomeStackParamList>;

const { width, height } = Dimensions.get("window");

const PaymentWarning = () => {
    const navigation = useNavigation<PaymentWarningNavProp>();
    const [countdown, setCountdown] = useState(10); // 120 giây = 2 phút

    // Countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Chặn nút back Android
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => true;
            if (Platform.OS === "android") {
                BackHandler.addEventListener("hardwareBackPress", onBackPress);
            }
            return () => {
                if (Platform.OS === "android") {
                    BackHandler.addEventListener("hardwareBackPress", onBackPress);
                }
            };
        }, [])
    );

    const formatTime = (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <ImageBackground
            source={require("../../assets/images/backgroundBalck.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.contentContainer}>
                <Image
                    source={require("../../assets/icons/iconwarning.png")}
                    style={styles.icon}
                />

                <Text style={styles.title}>CẢNH BÁO GIAO DỊCH</Text>

                <Text style={styles.message}>
                    Dựa vào thông tin bạn chuyển khoản, hệ thống nghi ngờ bạn đang bị{" "}
                    <Text style={{ fontWeight: "bold", color: "#ff0000", fontSize: 22 }}>
                        lừa đảo hoặc chuyển tiền không tự chủ
                    </Text>
                    {`\n\n`}Chúng tôi sẽ tạm khóa ứng dụng trong{" "}
                    <Text style={{ fontWeight: "bold" }}>2 phút</Text> để bạn kịp thời{" "}
                    <Text style={{ fontWeight: "bold", color: "#ff0000", fontSize: 22 }}>
                        tắt nguồn điện thoại
                    </Text>
                    {`\n\n`}Nếu bạn vẫn muốn thực hiện giao dịch, hãy{" "}
                    <Text style={{ fontWeight: "bold", color: "#ff0000", fontSize: 22 }}>
                        đến ngân hàng gần nhất để được hỗ trợ.
                    </Text>
                </Text>

                <Text style={styles.countdown}>
                    Ứng dụng sẽ mở sau: {formatTime(countdown)}
                </Text>

                {countdown === 0 && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("HomeMain")}
                    >
                        <Text style={styles.buttonText}>Trở về trang chính</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    );
};

export default PaymentWarning;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 120,
    },
    icon: {
        width: 150,
        height: 150,
        marginBottom: 10,
        alignSelf: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 25,
        textAlign: "center",
    },
    message: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 25,
    },
    countdown: {
        fontSize: 18,
        color: "#ffcc00",
        marginBottom: 25,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#00339a",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
