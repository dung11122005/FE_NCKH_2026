import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, Modal, PanResponder, Dimensions } from "react-native";
import { Point, analyzeSwipeBehavior } from "../../utils/SwipeBehaviorCheck";

interface IConnectPointsModalProps {
    visible: boolean;
    onSuccess: (data: {
        startPoint: Point;
        endPoint: Point;
        pathPoints: Point[];
    }) => void;
}

const { width, height } = Dimensions.get("window");

const ConnectPointsModal = ({ visible, onSuccess }: IConnectPointsModalProps) => {
    const [dragging, setDragging] = useState(false);
    const [pathPoints, setPathPoints] = useState<Point[]>([]);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const lastTimeRef = useRef(0);
    const swipeThreshold = 200;
    const timeInterval = 10;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const touchX = evt.nativeEvent.pageX;
            const touchY = evt.nativeEvent.pageY;
            const now = Date.now();
            setDragging(true);
            setStartPoint({ x: touchX, y: touchY, time: now });
            setPathPoints([{ x: touchX, y: touchY, time: now }]);
            lastTimeRef.current = now;
        },
        onPanResponderMove: (evt) => {
            if (dragging) {
                const now = Date.now();
                if (now - lastTimeRef.current >= timeInterval) {
                    const touchX = evt.nativeEvent.pageX;
                    const touchY = evt.nativeEvent.pageY;
                    setPathPoints((prev) => [...prev, { x: touchX, y: touchY, time: now }]);
                    lastTimeRef.current = now;
                }
            }
        },
        onPanResponderRelease: () => {
            if (dragging && startPoint) {
                const endPoint = pathPoints[pathPoints.length - 1];
                const deltaY = startPoint.y - endPoint.y;

                if (deltaY >= swipeThreshold) {
                    // Phân tích hành vi
                    const result = analyzeSwipeBehavior(startPoint, endPoint, pathPoints);
                    console.log("Straight %:", result.straightPercentage.toFixed(2));
                    console.log("Avg Speed:", result.avgSpeed.toFixed(4));
                    console.log("Avg Acceleration:", result.avgAcceleration.toFixed(4));
                    console.log(result.isBot ? "⚠ Bot detected" : "✅ Human");

                    onSuccess({ startPoint, endPoint, pathPoints });
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
