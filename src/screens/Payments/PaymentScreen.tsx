import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomHeader from "../../components/button/CustomHeader";
import CustomButton from "../../components/button/CustomButton"; // Import nút custom
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { recentRecipients, savedRecipients } from "../../data/banks";


type PayScreenProp = NativeStackNavigationProp<
    PaymentStackParamList & MainTabParamList,
    "PaymentMain"
>;


const PaymentScreen = () => {

    const navigation = useNavigation<PayScreenProp>();

    const renderRecentItem = ({ item }: { item: typeof recentRecipients[0] }) => (
        <TouchableOpacity style={styles.recentItem}>
            <Image source={item.bankLogo} style={styles.recentLogo} />
            <Text
                style={styles.recentName}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    );


    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title="" />
            <ScrollView style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#e7f0ffff", padding: 16 }}>
                    {/* Tiêu đề */}
                    <Text style={styles.title}>Chuyển tiền</Text>

                    <View style={styles.row}>
                        <CustomButton
                            innerText="Số TK"
                            width={110}
                            height={80}
                            iconName="card"
                            onPress={() => navigation.navigate("PaymentSTK")}
                        />
                        <CustomButton
                            innerText="SĐT"
                            width={110}
                            height={80}
                            iconName="call"
                            onPress={() => navigation.navigate("PaymentWarning")}
                        />
                        <CustomButton
                            innerText="Số thẻ"
                            width={110}
                            height={80}
                            iconName="card-outline"
                            onPress={() => console.log("Số thẻ")}
                        />
                    </View>

                    {/* Hàng dưới: 2 nút */}
                    <View style={styles.row}>
                        <CustomButton
                            innerText="Truy vấn Giao dịch"
                            width={236} // Gấp đôi 100 + margin
                            height={80}
                            iconName="search"
                            onPress={() => console.log("Truy vấn giao dịch")}
                        />
                        <CustomButton
                            innerText="Đối tác"
                            width={110}
                            height={80}
                            iconName="people"
                            onPress={() => console.log("Đối tác")}
                        />
                    </View>

                    {/* Gần đây */}
                    <Text style={styles.sectionTitle}>Gần đây</Text>
                    <FlatList
                        data={recentRecipients}
                        horizontal
                        keyExtractor={(item) => item.id}
                        renderItem={renderRecentItem}
                        showsHorizontalScrollIndicator={false}
                        style={{ marginVertical: 10 }}
                    />
                </View>


                {/* Đã lưu */}
                <View style={{ marginBottom: 30, padding: 16, backgroundColor: "#fff" }}>
                    <Text style={styles.sectionTitle}>Đã lưu</Text>
                    {savedRecipients.map((item) => (
                        <View key={item.id} style={styles.savedItem}>
                            <Image source={item.bankLogo} style={styles.savedBankLogo} />
                            <View>
                                <Text style={styles.savedName}>{item.name}</Text>
                                <Text style={styles.savedInfo}>{item.accountNumber} • {item.bankName}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    title: { fontSize: 25, margin: 10, fontWeight: '400' },
    sectionTitle: { fontSize: 18, fontWeight: '400', marginTop: 20, marginBottom: 10 },
    recentItem: { alignItems: "center", marginRight: 15 },
    recentLogo: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#eee" },
    recentName: {
        textTransform: 'uppercase',
        marginTop: 6,
        fontSize: 14,
        textAlign: "center",
        width: 80
    },

    savedItem: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 15
    },
    savedBankLogo: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    savedName: { fontSize: 16, fontWeight: "500", textTransform: 'uppercase', },
    savedInfo: { fontSize: 14, color: "#666" },
});

export default PaymentScreen;
