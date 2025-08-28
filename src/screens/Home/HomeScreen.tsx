import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FeatureButton from "../../components/button/FeatureButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList, MainTabParamList, PaymentStackParamList } from "../../navigation/types";
import { shoppingItems, sliderImages } from "../../data/banks";
import ImageButton from "../../components/button/ImageButton";
import ImageSlider from "../../components/PromoBanner/ImageSlider";


const { width } = Dimensions.get("window");
const sliderMargin = 16;
const sliderWidth = width - sliderMargin * 2;
const sliderHeight = 200;

type HomeScreenProp = NativeStackNavigationProp<
    HomeStackParamList & MainTabParamList & PaymentStackParamList,
    "HomeMain"
>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenProp>();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % sliderImages.length;
            setActiveIndex(nextIndex);
            scrollRef.current?.scrollTo({
                x: nextIndex * (sliderWidth + sliderMargin),
                animated: true,
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const handleScroll = (event: any) => {
        const slide = Math.round(
            event.nativeEvent.contentOffset.x / (sliderWidth + sliderMargin)
        );
        if (slide !== activeIndex) setActiveIndex(slide);
    };

    return (
        <View style={styles.container}>
            {/* Header & Balance */}
            <ImageBackground
                source={require("../../assets/images/background.jpg")}
                style={styles.topSection}
                resizeMode="cover"
            >
                <View style={styles.topBar}>
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={styles.logo}
                        tintColor="#fff"
                    />
                    <View style={styles.topIcons}>
                        <Ionicons name="search" size={24} color="#fff" style={{ marginRight: 16 }} />
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                    </View>
                </View>

                <View style={styles.userRow}>
                    <View style={styles.avatarCol}>
                        <Image
                            source={require("../../assets/images/avatar.jpg")}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.balanceBox}>
                        <Text style={styles.balanceLabel}>Your Balance</Text>
                        <Text style={styles.balanceAmount}>5.000.000.000 VND</Text>
                    </View>
                </View>
            </ImageBackground>

            <ScrollView style={styles.bottomSection} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Feature Buttons */}
                <View style={styles.buttonsContainer}>
                    <FeatureButton title="Chuyển tiền" iconName="swap-horizontal-outline" onPress={() => navigation.navigate("Payment")} />
                    <FeatureButton title="Nạp tiền điện thoại" iconName="phone-portrait-outline" />
                    <FeatureButton title="Tiền gửi" iconName="wallet-outline" />
                    <FeatureButton title="Vay nhanh" iconName="cash-outline" />
                    <FeatureButton title="Thanh toán" iconName="card-outline" />
                    <FeatureButton title="Rút tiền" iconName="arrow-down-circle-outline" />
                    <FeatureButton title="Internet" iconName="globe-outline" />
                    <FeatureButton title="Bảo hiểm" iconName="shield-checkmark-outline" />
                </View>

                {/* Slider */}
                <Text style={styles.sectionTitle}>Khuyến mãi</Text>
                <ImageSlider images={sliderImages} autoScrollInterval={3000} />

                {/* Shopping Section */}
                <View>
                    <Text style={styles.sectionTitle}>Mua sắm - Giải trí - Đầu tư</Text>
                    <View style={styles.shoppingContainer}>
                        {shoppingItems.map((item, index) => (
                            <ImageButton
                                key={index}
                                title={item.label}
                                imageSource={item.image}
                                onPress={() => console.log(item.label)}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffffff" },
    topSection: {
        justifyContent: "flex-start",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 50
    },
    topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    logo: { width: 120, height: 40, resizeMode: "contain" },
    topIcons: { flexDirection: "row", alignItems: "center" },
    userRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
    avatarCol: { flex: 3, alignItems: "flex-start", justifyContent: "center" },
    avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: "#fff" },
    balanceBox: { flex: 7, backgroundColor: "rgba(255,255,255,0.2)", padding: 16, borderRadius: 12 },
    balanceLabel: { color: "#fff", fontSize: 16, marginBottom: 4 },
    balanceAmount: { color: "#fff", fontSize: 26, fontWeight: "bold" },
    bottomSection: {
        backgroundColor: "#ffffffff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginTop: -25,
    },
    buttonsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
    sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginVertical: 16 },
    sliderImage: { width: "100%", height: "100%", resizeMode: "cover" },
    shoppingContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 10 },
});

export default HomeScreen;
