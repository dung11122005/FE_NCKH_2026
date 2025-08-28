import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    PanResponder,
    Dimensions,
} from "react-native";

interface IConnectPointsModalProps {
    visible: boolean;
    onSuccess: (data: {
        startPoint: { x: number; y: number };
        endPoint: { x: number; y: number };
        pathPoints: { x: number; y: number }[];
    }) => void;
}

const { width, height } = Dimensions.get("window");

const ConnectPointsModal = ({ visible, onSuccess }: IConnectPointsModalProps) => {
    const [dragging, setDragging] = useState(false);
    const [pathPoints, setPathPoints] = useState<{ x: number; y: number }[]>([]);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const lastTimeRef = useRef(0);
    const swipeThreshold = 200; // khoảng cách tối thiểu để tính là vuốt lên
    const timeInterval = 10; // ms

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const touchX = evt.nativeEvent.pageX;
            const touchY = evt.nativeEvent.pageY;
            setDragging(true);
            setStartPoint({ x: touchX, y: touchY });
            setPathPoints([{ x: touchX, y: touchY }]);
            lastTimeRef.current = Date.now();

            console.log(`👉 Start Point: x=${touchX}, y=${touchY}`);
        },
        onPanResponderMove: (evt) => {
            if (dragging) {
                const now = Date.now();
                if (now - lastTimeRef.current >= timeInterval) {
                    const touchX = evt.nativeEvent.pageX;
                    const touchY = evt.nativeEvent.pageY;
                    setPathPoints((prev) => [...prev, { x: touchX, y: touchY }]);
                    lastTimeRef.current = now;

                    // Log realtime path
                    // console.log(`✏ Path: x=${touchX}, y=${touchY}`);
                }
            }
        },
        onPanResponderRelease: (evt) => {
            if (dragging && startPoint) {
                const touchX = evt.nativeEvent.pageX;
                const touchY = evt.nativeEvent.pageY;

                const endPoint = { x: touchX, y: touchY };
                const deltaY = startPoint.y - touchY;

                // console.log(`✅ End Point: x=${touchX}, y=${touchY}`);
                // console.log(`📐 Total Path Points: ${pathPoints.length}`);

                if (deltaY >= swipeThreshold) {
                    console.log("✔ Vuốt lên hợp lệ!");
                    onSuccess({
                        startPoint,
                        endPoint,
                        pathPoints,
                    });
                } else {
                    console.log("❌ Vuốt không đủ hoặc không phải hướng lên");
                }

                setDragging(false);
                setPathPoints([]);
            }
        },
    });

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay} {...panResponder.panHandlers}>
                <Text style={styles.title}>Vuốt lên để tiếp tục</Text>

                {/* Vẽ đường di chuyển */}
                {pathPoints.map((p, i) => {
                    if (i === 0) return null;
                    const prev = pathPoints[i - 1];
                    const dx = p.x - prev.x;
                    const dy = p.y - prev.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) + "rad";
                    return (
                        <View
                            key={i}
                            style={{
                                position: "absolute",
                                left: prev.x,
                                top: prev.y,
                                width: length,
                                height: 4,
                                // backgroundColor: "green",
                                transform: [{ rotate: angle }],
                            }}
                        />
                    );
                })}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(68, 68, 68, 0.46)",
    },
    title: {
        color: "#fbfbfbff",
        fontSize: 22,
        textAlign: "center",
        marginTop: 40,
    },
});

export default ConnectPointsModal;
