import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface IFeatureButtonProps {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress?: () => void;
};

const FeatureButton = (props: IFeatureButtonProps) => {

    const { title, iconName, onPress } = props

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
                <Ionicons name={iconName} size={28} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 8,
        width: 70
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#005bbbff",
        shadowColor: "#000000ff",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        color: "#005bbbff",
        fontSize: 14,
        marginTop: 6,
        textAlign: "center",
        flexWrap: "wrap",
    },
});


export default FeatureButton