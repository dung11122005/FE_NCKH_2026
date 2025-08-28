import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface IProps {
    title?: string;
    showBack?: boolean;
    rightIcon?: React.ReactNode;
};

const CustomHeader = (iprops: IProps) => {
    const { title, showBack = true, rightIcon } = iprops;
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require("../../assets/images/background.jpg")}
            style={[
                styles.header,
                { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44 } // Safe Area
            ]}
            resizeMode="cover"
        >
            <View style={styles.row}>
                {showBack && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{title}</Text>
                <View style={{ marginLeft: "auto" }}>{rightIcon}</View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 90, // header lớn hơn để có padding cho safe area
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        marginRight: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default CustomHeader;
