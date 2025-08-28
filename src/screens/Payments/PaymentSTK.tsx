import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    ScrollView,
} from "react-native";
import CustomHeader from "../../components/button/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { banks } from "../../data/banks";
import CustomSelectModal from "../../components/modal/CustomSelectModal";
import ConnectPointsModal from "../../components/modal/ConnectPointsModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";

interface IItem {
    id: string;
    name: string
}

interface IAccount {
    selectedBank: string;
    accountNumber: string;
    amount: string;
    description: string;
}

type PayScreenProp = NativeStackNavigationProp<
    PaymentStackParamList & MainTabParamList,
    "PaymentMain"
>;



const PaymentSTK = () => {
    const [selectedBank, setSelectedBank] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("0");
    const [description, setDescription] = useState("HOANG TAN DUNG chuyen tien");
    const [isModalVisible, setModalVisible] = useState(false);
    const [connectModalVisible, setConnectModalVisible] = useState(true);

    const navigation = useNavigation<PayScreenProp>();

    const handleSelect = (item: IItem) => {
        console.log("Selected:", item.name);
        setSelectedBank(item.name);
        setModalVisible(false);
    };

    const handleContinue = () => {
        // console.log({
        //     selectedBank,
        //     accountNumber,
        //     amount,
        //     description,
        // });
        const data: IAccount = {
            selectedBank,
            accountNumber,
            amount,
            description,
        }
        if (selectedBank != "" && accountNumber != "" && amount != "" && description != "") {

            navigation.navigate('ConfirmPaymentSTK', data)
        }
        return
    };

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader title="Chuyển đến số tài khoản" />
                <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#ffffffff" }}>
                    {/* Nguồn chuyển tiền */}
                    <Text style={styles.sectionTitle}>Nguồn chuyển tiền</Text>
                    <View style={styles.infoBox}>
                        <Text style={styles.accountText}>Tài khoản thanh toán - 0909123456</Text>
                        <Text style={styles.infoText}>Số dư: 5,000,000 VNĐ</Text>
                    </View>

                    {/* Chuyển đến */}
                    <Text style={styles.sectionTitle}>Chuyển đến</Text>
                    <View style={styles.transferBox}>
                        <TouchableOpacity
                            style={styles.transferRow}
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="business-outline" size={20} color="#00339aff" style={styles.icon} />
                            <Text style={{ color: selectedBank ? "#000" : "#888", fontSize: 18 }}>
                                {selectedBank || "Chọn ngân hàng"}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <View style={styles.transferRow}>
                            <Ionicons name="card-outline" size={20} color="#00339aff" style={styles.icon} />
                            <TextInput
                                style={styles.inputInline}
                                placeholder="Nhập số tài khoản"
                                keyboardType="numeric"
                                value={accountNumber}
                                onChangeText={setAccountNumber}
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Số tiền</Text>
                    <View style={styles.amountBox}>
                        <TextInput
                            style={styles.amountInput}
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={setAmount}
                            textAlign="center"
                        />
                        <Text style={styles.currency}>VNĐ</Text>
                    </View>

                    {/* Nội dung */}
                    <Text style={styles.sectionTitle}>Nội dung chuyển tiền</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập nội dung"
                        value={description}
                        onChangeText={setDescription}
                    />
                </ScrollView>

                {/* Nút Tiếp tục */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                        <Text style={styles.continueText}>Tiếp tục</Text>
                    </TouchableOpacity>
                </View>

                <CustomSelectModal
                    visible={isModalVisible}
                    title="Chọn ngân hàng"
                    data={banks}
                    labelKey="name"
                    onClose={() => setModalVisible(false)}
                    onSelect={handleSelect}
                />
            </SafeAreaView>
            <ConnectPointsModal
                visible={connectModalVisible}
                onSuccess={() => setConnectModalVisible(false)} // chỉ khi nối thành công mới tắt modal
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: "400",
        marginTop: 16,
        marginBottom: 8,
        color: "#00339aff",
    },
    infoBox: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#e9e8e8ff",
    },
    accountText: {
        fontSize: 16,
        color: "#00339aff",
        marginBottom: 4,
        fontWeight: '500'
    },
    infoText: {
        fontSize: 18,
        fontWeight: "500",
    },
    transferBox: {
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#e9e8e8ff",
    },
    transferRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    divider: {
        height: 1,
        backgroundColor: "#e9e8e8ff",
    },
    icon: {
        marginRight: 10,
    },
    inputInline: {
        flex: 1,
        fontSize: 18,
    },
    amountBox: {
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#e9e8e8ff",
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    amountInput: {
        fontSize: 22,
        fontWeight: "bold",
        minWidth: 100,
        color: "#00339aff",
    },
    currency: {
        fontSize: 18,
        marginLeft: 8,
    },
    input: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12,
        fontSize: 18
    },
    footer: {
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderTopWidth: 1,
        borderColor: "#eee",
        marginBottom: 25
    },
    continueButton: {
        backgroundColor: "#00339aff",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    continueText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "500",
    },
});

export default PaymentSTK;
