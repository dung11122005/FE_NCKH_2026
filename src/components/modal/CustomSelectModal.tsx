import React from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
} from "react-native";
import { bankLogos } from "../../data/banks";


// Nếu bạn dùng react-native-svg-transformer thì có thể import svg như component
// import TechcombankLogo from "../assets/logobank/logo-techcombank.svg";

interface CustomSelectModalProps<T> {
    visible: boolean;
    title?: string;
    data: T[];
    labelKey: keyof T;
    onClose: () => void;
    onSelect: (item: T) => void;
}

const CustomSelectModal = <T,>(props: CustomSelectModalProps<T>) => {
    const { visible, title = "Chọn mục", data, labelKey, onClose, onSelect } = props;

    const renderLogo = (bankName: string) => {
        const logo = bankLogos[bankName];
        if (!logo) return null;

        // Nếu logo là PNG/JPG thì render bằng Image
        if (typeof logo === "number") {
            return <Image source={logo} style={styles.bankLogo} resizeMode="contain" />;
        }
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <FlatList
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                            const bankName = String(item[labelKey]);

                            return (
                                <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
                                    <View style={styles.itemContent}>
                                        {renderLogo(bankName)}
                                        <Text style={styles.itemText}>{bankName}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        maxHeight: "70%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#0062caff",
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    bankLogo: {
        width: 35,
        height: 35,
        marginRight: 10,
        borderRadius: 17.5,
    },
    itemText: {
        fontSize: 18,
        color: "#004793ff",
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "#016cdfff",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
});

export default CustomSelectModal;
