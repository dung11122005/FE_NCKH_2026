import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import CustomHeader from "../../components/button/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import CustomSelectModal from "../../components/modal/CustomSelectModal";
import ConnectPointsModal from "../../components/modal/ConnectPointsModal";
import BankSelectModal from "../../components/modal/BankSelectModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList, MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { bankLogos, banks } from "../../data/banks";
import { callBankAccountNumber, callBankAccountUser } from "../../services/api";
import { IBackendRes, IBankAccount } from "../../types/backend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";



interface IItem {
    id: string;
    name: string;
}

interface IAccount {
    accountHolder: string;
    selectedBank: string;
    accountNumber: string;
    receivingAccountHolder: string;
    receivingSelectedBank: string;
    receivingAccountNumber: string;
    amount: string;
    description: string;
}

type PayScreenProp = NativeStackNavigationProp<
    PaymentStackParamList & MainTabParamList,
    "PaymentMain"
>;

const PaymentSTK = () => {

    const dispatch = useDispatch<AppDispatch>();

    const [accounts, setAccounts] = useState<IBankAccount[]>([]);

    const [selectedAccount, setSelectedAccount] = useState<IBankAccount | null>(null);

    const [selectedBankReceive, setSelectedBankReceive] = useState<string>("");
    const [accountNumberReceive, setAccountNumberReceive] = useState<string>("");
    const [amount, setAmount] = useState("0");


    const [accountHolder, setAccountHolder] = useState<string>("")
    const [receivingAccountHolder, setReceivingAccountHolder] = useState<string>("")

    const [isBankModalVisible, setBankModalVisible] = useState(false);
    const [isReceiveModalVisible, setReceiveModalVisible] = useState(false);
    const [connectModalVisible, setConnectModalVisible] = useState(true);

    const navigation = useNavigation<PayScreenProp>();

    // Chọn ngân hàng nhận
    const handleSelectReceiveBank = (item: IItem) => {
        setSelectedBankReceive(item.name);
        setReceiveModalVisible(false);
    };

    // Tiếp tục
    const handleContinue = () => {
        if (!selectedAccount) {
            alert("Đang tải thông tin tài khoản, vui lòng đợi");
            return;
        }

        if (
            !selectedBankReceive.trim() ||
            !accountNumberReceive.trim() ||
            !amount.trim() ||
            !description.trim()
        ) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const data: IAccount = {
            accountHolder: selectedAccount.accountHolder,
            selectedBank: selectedAccount.bankName,
            accountNumber: selectedAccount.accountNumber,
            receivingAccountHolder: receivingAccountHolder,
            receivingSelectedBank: selectedBankReceive,
            receivingAccountNumber: accountNumberReceive,
            amount: amount,
            description: description
        };
        navigation.navigate("ConfirmPaymentSTK", data);
    };



    // 1. Khi load tài khoản người dùng (nguồn chuyển tiền)
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await callBankAccountUser();
                const apiRes = res as unknown as IBackendRes<IBankAccount[]>;
                if (apiRes.data && apiRes.data.length > 0) {
                    setAccounts(apiRes.data);
                    const firstAccount = apiRes.data[0];
                    setSelectedAccount(firstAccount); // set selectedAccount
                    if (selectedAccount) {
                        setAccountHolder(selectedAccount?.accountHolder); // set luôn tên người chuyển
                    }
                    setDescription(`${accountHolder} chuyen tien`)
                }
            } catch (error: any) {
                console.error("Lỗi khi lấy tài khoản:", error);
                if (error.response?.status === 401) {
                    await AsyncStorage.removeItem("access_token");
                    dispatch(setUserLoginInfo(null));
                    (navigation as any).dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: "Login" }],
                        })
                    );
                } else {
                    alert("Không thể lấy thông tin tài khoản. Vui lòng thử lại sau.");
                }
            }
        };

        fetchAccounts();
    }, []);

    // 2. Khi người dùng chọn tài khoản khác
    useEffect(() => {
        if (selectedAccount) {
            setAccountHolder(selectedAccount.accountHolder || "");
            setDescription(`${accountHolder} chuyen tien`)
        }
    }, [selectedAccount]);


    const [description, setDescription] = useState(`${accountHolder} chuyen tien`);

    const handleReceivingBank = async (number: string) => {
        if (!number) return;

        try {
            const res = await callBankAccountNumber(number);
            const data = res.data as unknown as IBankAccount;

            if (data?.accountNumber) {
                setAccountNumberReceive(data.accountNumber);
                setSelectedBankReceive(data.bankName);
                setReceivingAccountHolder(data.accountHolder);
            } else {
                // Không tìm thấy STK
                setSelectedBankReceive("");
                setAccountHolder("");
                alert("Không tìm thấy tài khoản này.");
            }
        } catch (err) {
            setSelectedBankReceive("");
            setAccountHolder("");
            alert("Không thể kiểm tra tài khoản. Vui lòng thử lại.");
        }
    };


    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <CustomHeader title="Chuyển đến số tài khoản" />
                <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
                    {/* Nguồn chuyển tiền */}
                    <Text style={styles.sectionTitle}>Nguồn chuyển tiền</Text>
                    <TouchableOpacity
                        style={styles.infoBox}
                        onPress={() => setBankModalVisible(true)}
                    >
                        {selectedAccount ? (
                            <>
                                <View style={styles.bankInfo}>
                                    {bankLogos[selectedAccount.bankName] && (
                                        <Image
                                            source={bankLogos[selectedAccount.bankName]}
                                            style={styles.bankLogo}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <Text style={styles.bankName}>
                                        {selectedAccount.bankName} - {selectedAccount.accountNumber}
                                    </Text>
                                </View>
                                {/* Tên người chuyển */}
                                <View style={styles.accountHolderBox0}>
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color="#00339aff"
                                    />
                                    <Text style={styles.accountHolderText}>{selectedAccount.accountHolder}</Text>
                                </View>
                            </>
                        ) : (
                            <Text style={styles.placeholderText}>Đang tải...</Text>
                        )}
                    </TouchableOpacity>


                    {/* Chuyển đến */}
                    <Text style={styles.sectionTitle}>Chuyển đến</Text>
                    <View style={styles.transferBox}>
                        {/* Chọn ngân hàng nhận */}
                        <TouchableOpacity
                            style={styles.transferRow}
                            onPress={() => setReceiveModalVisible(true)}
                        >
                            <Ionicons
                                name="business-outline"
                                size={25}
                                color="#00339aff"
                                style={styles.icon}
                            />
                            {selectedBankReceive ? (
                                <View style={styles.bankInfo}>
                                    {bankLogos[selectedBankReceive] && (
                                        <Image
                                            source={bankLogos[selectedBankReceive]}
                                            style={styles.bankLogo}
                                            resizeMode="contain"
                                        />
                                    )}
                                    <Text style={styles.bankName}>{selectedBankReceive}</Text>
                                </View>
                            ) : (
                                <Text style={styles.placeholderText}>Chọn ngân hàng nhận</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Nhập số tài khoản nhận */}
                        <View style={styles.transferRow}>
                            <Ionicons
                                name="card-outline"
                                size={25}
                                color="#00339aff"
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.inputInline}
                                placeholder="Nhập số tài khoản nhận"
                                keyboardType="numeric"
                                value={accountNumberReceive}
                                onChangeText={(text) => {
                                    setAccountNumberReceive(text);
                                    setSelectedBankReceive("");   // reset ngân hàng khi nhập mới
                                    setAccountHolder("");        // reset chủ tài khoản khi nhập mới
                                }}
                                onEndEditing={() => handleReceivingBank(accountNumberReceive)} // gọi API khi kết thúc nhập
                            />
                        </View>


                        {receivingAccountHolder ? (
                            <View style={styles.accountHolderBox}>
                                <Ionicons name="person-outline" size={20} color="#00339aff" style={{ marginRight: 8 }} />
                                <Text style={styles.accountHolderText}>{receivingAccountHolder}</Text>
                            </View>
                        ) : null}

                    </View>


                    {/* Số tiền */}
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

                    {/* Nội dung chuyển tiền */}
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

                {/* Modal chọn ngân hàng nhận */}
                <CustomSelectModal
                    visible={isReceiveModalVisible}
                    title="Chọn ngân hàng nhận"
                    data={banks}
                    labelKey="name"
                    onClose={() => setReceiveModalVisible(false)}
                    onSelect={handleSelectReceiveBank}
                />

                {/* Modal chọn nguồn chuyển tiền */}
                <BankSelectModal
                    visible={isBankModalVisible}
                    onClose={() => setBankModalVisible(false)}
                    data={accounts.map((acc, idx) => ({ id: String(idx), name: acc.bankName }))}
                    onSelect={(item) => {
                        const account = accounts[parseInt(item.id)];
                        if (account) {
                            setSelectedAccount(account);
                            // số tài khoản nguồn
                        }
                        setBankModalVisible(false);
                    }}
                />

            </SafeAreaView>

            {/* Modal kết nối */}
            <ConnectPointsModal
                visible={connectModalVisible}
                onSuccess={() => setConnectModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 18, fontWeight: "400", marginTop: 16, marginBottom: 8, color: "#00339aff" },
    infoBox: { backgroundColor: "#fff", padding: 16, borderRadius: 5, borderWidth: 1, borderColor: "#e9e8e8ff" },
    transferBox: { backgroundColor: "#fff", borderRadius: 5, borderWidth: 1, borderColor: "#e9e8e8ff" },
    transferRow: { flexDirection: "row", alignItems: "center", padding: 16 },
    divider: { height: 1, backgroundColor: "#e9e8e8ff" },
    icon: { marginRight: 10 },
    inputInline: { flex: 1, fontSize: 18 },
    amountBox: { backgroundColor: "#fff", borderRadius: 5, borderWidth: 1, borderColor: "#e9e8e8ff", paddingVertical: 10, justifyContent: "center", alignItems: "center", flexDirection: "row" },
    amountInput: { fontSize: 22, fontWeight: "bold", minWidth: 100, color: "#00339aff" },
    currency: { fontSize: 18, marginLeft: 8 },
    input: { backgroundColor: "#fff", padding: 16, borderRadius: 5, borderWidth: 1, borderColor: "#eee", marginBottom: 12, fontSize: 18 },
    footer: { padding: 16, backgroundColor: "#f9f9f9", borderTopWidth: 1, borderColor: "#eee", marginBottom: 25 },
    continueButton: { backgroundColor: "#00339aff", paddingVertical: 14, borderRadius: 8, alignItems: "center" },
    continueText: { color: "#fff", fontSize: 18, fontWeight: "500" },
    bankInfo: { flexDirection: "row", alignItems: "center" },
    bankLogo: { width: 50, height: 50, marginRight: 8, borderRadius: 25 },
    bankName: { fontSize: 18, color: "#000" },
    placeholderText: { fontSize: 18, color: "#888" },
    accountHolderBox: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#f0f4ff", borderRadius: 8, marginHorizontal: 16, marginBottom: 10 },
    accountHolderBox0: { flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#f0f4ff", borderRadius: 8, marginHorizontal: 16, marginTop: 10 },
    accountHolderText: { fontSize: 16, fontWeight: "500", color: "#00339aff", },

});

export default PaymentSTK;
