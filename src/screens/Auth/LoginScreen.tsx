import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Alert
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import { canLogin, SecurityResult, hasUsagePermission, openUsageSettings } from "../../utils/SecurityService";
import { callLogin } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserLoginInfo } from "../../redux/slice/accountSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { IAccount } from "../../types/backend";




interface IProps extends NativeStackScreenProps<AuthStackParamList, "Login"> {
    onLogin: () => void;
}

const POLL_INTERVAL = 1000; // 5 giây

const LoginScreen = (props: IProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loadingPermissionCheck, setLoadingPermissionCheck] = useState(true);
    const [isBlocked, setIsBlocked] = useState(false);
    const [securityResult, setSecurityResult] = useState<SecurityResult | null>(null);

    const [loadingLogin, setLoadingLogin] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { navigation, onLogin } = props;

    const user = useSelector((state: RootState) => state.account.user);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let mounted = true;

        const startPolling = () => {
            if (intervalRef.current) return;

            intervalRef.current = setInterval(async () => {
                try {
                    const { securityResult } = await canLogin();
                    if (!mounted) return;

                    // Chỉ block khi app khả nghi đang chạy
                    const shouldBlock =
                        securityResult.hasSuspiciousRunning ||
                        securityResult.hasNonPlayApp ||
                        securityResult.isRooted ||
                        securityResult.isAccessibilityEnabled;

                    setIsBlocked(shouldBlock);


                    setSecurityResult(securityResult);

                    if (securityResult.hasSuspiciousApp && !securityResult.hasSuspiciousRunning) {
                        //console.warn("Ứng dụng điều khiển từ xa đã cài nhưng chưa chạy:", securityResult);
                    }

                } catch (e) {
                    console.error("Polling error:", e);
                }
            }, POLL_INTERVAL);

        };

        const stopPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const init = async () => {
            setLoadingPermissionCheck(true);
            const granted = await hasUsagePermission();
            if (!mounted) return;

            setLoadingPermissionCheck(false);

            if (!granted) {
                Alert.alert(
                    "Cần cấp quyền Usage Access",
                    "Ứng dụng cần quyền Usage Access để phát hiện ứng dụng điều khiển từ xa.",
                    [
                        {
                            text: "Mở cài đặt",
                            onPress: openUsageSettings
                        }
                    ],
                    { cancelable: false }
                );
                return;
            }

            startPolling();
        };

        init();

        return () => {
            mounted = false;
            stopPolling();
        };
    }, []);


    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu");
            return;
        }

        try {
            setLoadingLogin(true);
            const res = await callLogin(email, password);
            // console.log("res: ", (res.data as unknown as IAccount).access_token)
            if ((res.data as unknown as IAccount).access_token) {
                await AsyncStorage.setItem("access_token", String((res.data as unknown as IAccount).access_token));
                dispatch(setUserLoginInfo((res.data as unknown as IAccount).user));
                onLogin();
            }
        } catch (e: any) {
            Alert.alert("Đăng nhập thất bại", "Sai tài khoản hoặc mật khẩu");
        }
    };



    if (loadingPermissionCheck) {
        return (
            <View style={styles.center}>
                <Text style={{ color: "#fff" }}>Đang kiểm tra quyền Usage Access...</Text>
            </View>
        );
    }

    // if (isBlocked) {
    //     return (
    //         <View style={styles.center}>
    //             <Text style={styles.alertText}>
    //                 Ứng dụng phát hiện phần mềm nguy hiểm hoặc sideloaded app. Vui lòng tắt kết nối để tiếp tục.
    //             </Text>
    //             <TouchableOpacity style={styles.button} onPress={() => setIsBlocked(false)}>
    //                 <Text style={styles.buttonText}>Làm mới</Text>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // }

    return (
        <ImageBackground
            source={require("../../assets/images/background.jpg")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.welcome}>Chào mừng bạn{'\n'}đến NCKH Bank</Text>

                    {!isBlocked && (
                        <>
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#fff"
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TextInput
                                placeholder="Mật khẩu"
                                placeholderTextColor="#fff"
                                style={styles.input}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />

                            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                                <Text style={styles.link}>Bạn chưa có tài khoản? Đăng ký</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {isBlocked && (
                        <Text style={styles.alertText}>
                            Ứng dụng phát hiện phần mềm nguy hiểm hoặc sideloaded app. Vui lòng tắt kết nối và xóa app để tiếp tục.
                        </Text>
                    )}
                </View>

                {!isBlocked && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleLogin()}
                    >
                        <Text style={styles.buttonText}>Đăng nhập</Text>
                    </TouchableOpacity>
                )}
            </View>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        padding: 20
    },
    alertText: {
        color: "red",
        fontSize: 22,
        textAlign: "center",
        marginHorizontal: 20
    },
    background: { flex: 1, justifyContent: "center" },
    container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
    card: { width: "100%", backgroundColor: "rgba(209, 209, 209, 0.14)", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 25 },
    welcome: { fontSize: 35, color: "#fff", textAlign: "left", marginBottom: 30, paddingVertical: 20, lineHeight: 28 },
    input: { borderBottomWidth: 1, borderBottomColor: "#fff", fontSize: 20, paddingVertical: 8, marginBottom: 25, color: "#fff" },
    link: { color: "#fff", textAlign: "center", fontSize: 16, marginTop: 10 },
    button: { width: "100%", backgroundColor: "#007bff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingVertical: 15 },
    buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 16 }
});

export default LoginScreen;
