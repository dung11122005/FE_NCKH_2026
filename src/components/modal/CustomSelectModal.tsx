import React from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

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

    return (
        <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>

                    <FlatList
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={styles.itemText}>{String(item[labelKey])}</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: '#0062caff'
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 16,
        color: '#004793ff'
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: "#016cdfff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
});


export default CustomSelectModal