import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, ImageBackground } from "react-native";

interface IImageButtonProps {
    title: string;
    imageSource: any; // require(...) hoặc URI
    onPress?: () => void;
};

const ImageButton = (props: IImageButtonProps) => {
    const { title, imageSource, onPress } = props;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <ImageBackground
                    source={imageSource}
                    style={styles.button}
                    imageStyle={{ borderRadius: 13 }} // bo tròn viền ảnh
                >
                    {/* Bạn có thể thêm nội dung icon/text bên trong ảnh nếu muốn */}
                </ImageBackground>
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        margin: 8,
        width: 70,
    },
    button: {
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 13,
        overflow: "hidden", // để borderRadius áp dụng cho ImageBackground
        shadowColor: "#000",
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

export default ImageButton;
