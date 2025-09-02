import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../components/button/CustomHeader";
import PinModal from "../../components/modal/PinModal.tsx";
import OtpModal from "../../components/modal/OtpModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { RouteProp, useNavigation } from "@react-navigation/native";
import numberToVietnamese from "../../utils/numberToVietnamese";
import formatCurrency from "../../utils/formatCurrency";

type PayScreenProp = NativeStackNavigationProp<
    PaymentStackParamList & MainTabParamList,
    "PaymentMain"
>;

type ConfirmPaymentSTKRouteProp = RouteProp<PaymentStackParamList, "ConfirmPaymentSTK">;


interface IProps {
    route: ConfirmPaymentSTKRouteProp;
}

const ConfirmPaymentSTK = (props: IProps) => {

    const { route } = props;
    const { accountHolder,
        selectedBank,
        accountNumber,
        receivingAccountHolder,
        receivingSelectedBank,
        receivingAccountNumber,
        amount,
        description } = route.params;

    const navigation = useNavigation<PayScreenProp>();

    const [pinVisible, setPinVisible] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);

    // Demo dữ liệu
    // const amount = 5000000;
    // const description = "HOANG TAN DUNG chuyen tien";
    const sender = {
        name: accountHolder,
        account: accountNumber,
        bank: selectedBank,
    };
    const receiver = {
        name: receivingAccountHolder,
        account: receivingAccountNumber,
        bank: receivingSelectedBank,
    };
    const fee = "Miễn phí";
    const method = "Chuyển nhanh 24/7";


    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <CustomHeader title="Xác nhận chuyển tiền" />
                <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
                    {/* PHẦN 1: SỐ TIỀN */}
                    <View style={styles.amountBox}>
                        <Text style={{
                            fontSize: 18,
                            color: "#666",
                            paddingTop: 15
                        }}>Số tiền giao dịch</Text>
                        <Text style={styles.amountNumber}>{formatCurrency(Number(amount))} VNĐ</Text>
                        <Text style={styles.amountText}>{numberToVietnamese(Number(amount))}</Text>
                    </View>

                    {/* PHẦN 2: NGƯỜI CHUYỂN - NGƯỜI NHẬN */}
                    <View style={styles.userBox}>
                        <View>
                            <Text style={styles.sectionLabel}>Người chuyển</Text>
                            <View style={styles.userRow}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person-outline" size={30} color="#00339a" />
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{sender.name}</Text>
                                    <Text style={styles.userDetail}>{sender.account}</Text>
                                    <Text style={styles.userDetail}>{sender.bank}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.transferIcon}>
                            <Ionicons name="arrow-down-outline" size={24} color="#00339a" />
                        </View>

                        <View >
                            <Text style={styles.sectionLabel}>Người nhận</Text>
                            <View style={styles.userRow}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person-outline" size={30} color="#00339a" />
                                </View>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{receiver.name}</Text>
                                    <Text style={styles.userDetail}>{receiver.account}</Text>
                                    <Text style={styles.userDetail}>{receiver.bank}</Text>
                                </View>
                            </View>
                        </View>

                    </View>

                    {/* PHẦN 3: CHI TIẾT GIAO DỊCH */}
                    <View style={styles.detailBox}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Nội dung</Text>
                            <Text style={styles.detailValue}>{description}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Phí giao dịch</Text>
                            <Text style={styles.detailValue}>{fee}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Hình thức chuyển</Text>
                            <Text style={styles.detailValue}>{method}</Text>
                        </View>
                    </View>

                    {/* CẢNH BÁO */}
                    <View style={styles.warningBox}>
                        <Ionicons name="warning-outline" size={25} color="#ff0000ff" style={{ marginRight: 8 }} />
                        <Text style={styles.warningText}>Vui lòng kiểm tra thông tin trước khi xác nhận</Text>
                    </View>
                </ScrollView>

                {/* Nút Xác nhận */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.confirmButton}
                        onPress={() => setPinVisible(true)}
                    >
                        <Text style={styles.confirmText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <PinModal
                visible={pinVisible}
                onSuccess={(pin) => {
                    if (pin === "123456") {  // PIN đúng
                        setPinVisible(false);
                        setOtpVisible(true);
                    }
                }}
                onCancel={() => setPinVisible(false)}
            />

            <OtpModal
                visible={otpVisible}
                onSuccess={(otp) => {
                    if (otp === "123456") {  // OTP đúng
                        setOtpVisible(false);
                        navigation.navigate("PaymentSuccess", {
                            amount: amount,
                            receiver: { name: receivingAccountHolder, account: receivingAccountNumber, bank: receivingSelectedBank },
                            description: description
                        });
                    }
                }}
                onCancel={() => setOtpVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    amountBox: {
        alignItems: "center",
        marginBottom: 20,
        paddingVertical: 10,
    },
    amountNumber: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#00339a",
    },
    amountText: {
        fontSize: 16,
        color: "#666",
        textAlign: 'center'
    },
    userBox: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#eee",
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#00339a",
        marginBottom: 8,
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#eee",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: "500",
        color: "#000",
    },
    userDetail: {
        fontSize: 14,
        color: "#666",
    },
    transferIcon: {
        alignItems: "center",
        marginVertical: 12,
    },
    detailBox: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: 16,
        color: "#666",
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000",
        flexShrink: 1,
        textAlign: "right",
    },
    warningBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fffbe6",
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ffebcc",
        marginBottom: 20,
    },
    warningText: {
        fontSize: 16,
        color: "#cc0000ff",
        flex: 1,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
        marginBottom: 25
    },
    confirmButton: {
        backgroundColor: "#00339a",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    confirmText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});

export default ConfirmPaymentSTK;
