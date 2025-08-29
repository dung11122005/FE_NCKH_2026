export interface Point {
    x: number;
    y: number;
    time: number; // timestamp ms
}

export interface SwipeAnalysisResult {
    straightPercentage: number; // % điểm gần đường thẳng
    avgSpeed: number;           // px/ms
    avgAcceleration: number;    // px/ms^2
    speedJitter: number;        // độ lệch chuẩn vận tốc
    isBot: boolean;             // nghi ngờ bot
}

/**
 * Khoảng cách từ điểm đến đường thẳng start->end
 */
function pointToLineDistance(p: Point, start: Point, end: Point) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return 0;
    return Math.abs(dy * p.x - dx * p.y + end.x * start.y - end.y * start.x) / length;
}

/**
 * Tính độ lệch chuẩn
 */
function standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
}

/**
 * Phân tích hành vi vuốt
 */
export function analyzeSwipeBehavior(
    startPoint: Point,
    endPoint: Point,
    pathPoints: Point[],
    straightThreshold: number = 1.5,
    straightPercentageThreshold: number = 65,
    avgAccelerationThreshold: number = 0.005,
    speedJitterThreshold: number = 0.015
): SwipeAnalysisResult {
    // % đi theo đường thẳng
    let straightCount = 0;
    for (let p of pathPoints) {
        if (pointToLineDistance(p, startPoint, endPoint) <= straightThreshold) {
            straightCount++;
        }
    }
    const straightPercentage = (straightCount / pathPoints.length) * 100;

    // Vận tốc
    let speeds: number[] = [];
    for (let i = 1; i < pathPoints.length; i++) {
        const dx = pathPoints[i].x - pathPoints[i - 1].x;
        const dy = pathPoints[i].y - pathPoints[i - 1].y;
        const dt = pathPoints[i].time - pathPoints[i - 1].time;
        if (dt > 0) speeds.push(Math.sqrt(dx * dx + dy * dy) / dt);
    }
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / (speeds.length || 1);

    // Gia tốc
    let accs: number[] = [];
    for (let i = 1; i < speeds.length; i++) {
        const dt = pathPoints[i + 1]?.time - pathPoints[i].time || 1;
        accs.push(Math.abs(speeds[i] - speeds[i - 1]) / dt);
    }
    const avgAcceleration = accs.reduce((a, b) => a + b, 0) / (accs.length || 1);

    // Speed jitter
    const speedJitter = standardDeviation(speeds);

    // Đánh giá bot
    const isBot =
        straightPercentage > straightPercentageThreshold &&
        avgAcceleration < avgAccelerationThreshold &&
        speedJitter < speedJitterThreshold &&
        avgSpeed > 0.05;

    return { straightPercentage, avgSpeed, avgAcceleration, speedJitter, isBot };
}
