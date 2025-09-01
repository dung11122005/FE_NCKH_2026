import React from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

interface BankSelectModalProps {
    visible: boolean;
    data: { id: string; name: string }[];
    onSelect: (item: { id: string; name: string }) => void;
    onClose: () => void;
}

const BankSelectModal: React.FC<BankSelectModalProps> = ({
    visible,
    data,
    onSelect,
    onClose,
}) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Chọn ngân hàng nguồn</Text>
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={styles.itemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "85%",
        maxHeight: "70%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 16,
    },
    closeBtn: {
        marginTop: 15,
        padding: 12,
        backgroundColor: "#00339a",
        borderRadius: 8,
        alignItems: "center",
    },
    closeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default BankSelectModal;
