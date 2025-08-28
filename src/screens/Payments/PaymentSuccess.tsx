import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView
} from "react-native";
import ImageButton from "../../components/button/ImageButton";
import { icon } from "../../data/banks";
import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { HomeStackParamList, MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { PaymentSTKStackParamList } from "../../navigation/payment/PayNavigatorSTK";
import formatCurrency from "../../utils/formatCurrency";



type PaymentSuccessScreenProps = NativeStackScreenProps<
    PaymentSTKStackParamList,
    "PaymentSuccess"
>;

// Navigation gộp để có thể navigate sang Home
type CrossNav = CompositeNavigationProp<
    NativeStackNavigationProp<PaymentSTKStackParamList, "PaymentSuccess">,
    NativeStackNavigationProp<HomeStackParamList>
>;


// const route: RouteProp<PaymentStackParamList, 'PaymentSuccess'> = useRoute();


const PaymentSuccess = ({ route }: PaymentSuccessScreenProps) => {
    const { amount, receiver, description } = route.params;


    const navigation = useNavigation<CrossNav>();


    const currentDateTime = new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../assets/images/backgroundPay.jpg")} // Thay ảnh background của bạn
                style={styles.background}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {/* Icon thành công */}
                    <Image
                        source={require("../../assets/icons/iconTick.png")} // Thay icon tick của bạn
                        style={styles.successIcon}
                    />
                    <Text style={styles.successText}>Chuyển tiền thành công</Text>

                    {/* Số tiền */}
                    <Text style={styles.amount}>{formatCurrency(Number(amount))} VNĐ</Text>
                    <Text style={styles.datetime}>{currentDateTime}</Text>

                    {/* Khung thông tin */}
                    <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Người nhận</Text>
                            <Text style={styles.value}>{receiver.name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Ngân hàng</Text>
                            <Text style={styles.value}>{receiver.bank}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Số tài khoản</Text>
                            <Text style={styles.value}>{receiver.account}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Nội dung</Text>
                            <Text style={styles.value}>{description}</Text>
                        </View>
                    </View>

                    {/* Cảm ơn */}
                    <Text style={styles.thankText}>
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                    </Text>

                    {/* Các nút chia sẻ, lưu ảnh, lưu mẫu */}
                    <View style={styles.actionRow}>
                        <ImageButton
                            title="Chia sẻ"
                            imageSource={icon.iconshare}
                            onPress={() => console.log("Chia sẻ")}
                        />
                        <ImageButton
                            title="Lưu ảnh"
                            imageSource={icon.iconimage}
                            onPress={() => console.log("Lưu ảnh")}
                        />
                        <ImageButton
                            title="Lưu mẫu"
                            imageSource={icon.iconbienlai}
                            onPress={() => console.log("Lưu mẫu")}
                        />
                    </View>

                    {/* Nút thực hiện giao dịch khác */}
                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={() => navigation.navigate("HomeMain")}
                    >
                        <Text style={styles.mainButtonText}>Thực hiện giao dịch khác</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover"
    },
    container: {
        alignItems: "center",
        padding: 16
    },
    successIcon: {
        width: 120,
        height: 120,
        marginTop: 50,
        marginBottom: 10
    },
    successText: {
        fontSize: 20,
        color: "#000000ff",
        fontWeight: "500",
        marginBottom: 8
    },
    amount: {
        fontSize: 28,
        color: "#00a000",
        fontWeight: "500",
        marginBottom: 10
    },
    datetime: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20
    },
    infoBox: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 3,
        padding: 16,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    label: {
        fontSize: 16,
        color: "#666"
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000"
    },
    thankText: {
        fontSize: 14,
        color: "#00339a",
        marginBottom: 30
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20
    },
    actionBtn: {
        alignItems: "center"
    },
    actionText: {
        fontSize: 12,
        marginTop: 4,
        color: "#00339a"
    },
    mainButton: {
        backgroundColor: "#00339a",
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        width: "100%",
        alignItems: "center"
    },
    mainButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    }
});

export default PaymentSuccess;
