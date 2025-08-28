import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ICustomButtonProps {
    title?: string; // Text bên ngoài nút
    iconName?: keyof typeof Ionicons.glyphMap; // Icon optional
    onPress?: () => void;
    width?: number;
    height?: number;
    innerText?: string; // Text bên trong nút
    backgroundColor?: string;
    borderRadius?: number;
}

const CustomButton = (props: ICustomButtonProps) => {
    const {
        title,
        iconName,
        onPress,
        width = 60,
        height = 60,
        innerText,
        backgroundColor = "#fff",
        borderRadius = 5,
    } = props;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    { width, height, backgroundColor, borderRadius },
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                {iconName && <Ionicons name={iconName} size={25} color="#007bff" />}
                {innerText && (
                    <Text style={[styles.innerText, { fontSize: 16 }]}>
                        {innerText}
                    </Text>
                )}
            </TouchableOpacity>
            {title && <Text style={styles.text}>{title}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 8,
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#0062caff",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
        flexDirection: "column",
    },
    text: {
        color: "#0062caff",
        fontSize: 14,
        marginTop: 6,
        textAlign: "center",
    },
    innerText: {
        color: "#000000ff",
        marginTop: 4,
    },
});

export default CustomButton;
