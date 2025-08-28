import { NativeModules } from "react-native";

const { SecurityChecker } = NativeModules; // tên module Kotlin

export interface SecurityResult {
    hasSuspiciousApp: boolean;
    isAccessibilityEnabled: boolean;
    isRooted: boolean;
    hasSuspiciousRunning: boolean;
    hasNonPlayApp: boolean; // app không cài từ CH Play
}

/**
 * Kiểm tra tất cả security từ module Kotlin
 */
export const checkSecurity = async (): Promise<SecurityResult> => {
    try {
        const result: SecurityResult = await SecurityChecker.checkRemoteControl();
        return result;
    } catch (e: any) {
        console.error("Security check failed:", e.message);
        return {
            hasSuspiciousApp: true,
            isAccessibilityEnabled: true,
            isRooted: true,
            hasSuspiciousRunning: true,
            hasNonPlayApp: true,
        };
    }
};

/**
 * Kiểm tra quyền Usage Access
 */
export const hasUsagePermission = async (): Promise<boolean> => {
    try {
        return await SecurityChecker.hasUsagePermission();
    } catch (e) {
        console.error("hasUsagePermission error", e);
        return false;
    }
};

/**
 * Mở màn hình cài đặt quyền Usage Access
 */
export const openUsageSettings = async (): Promise<void> => {
    try {
        await SecurityChecker.openUsageSettings();
    } catch (e) {
        console.error("openUsageSettings error", e);
    }
};

/**
 * Kiểm tra xem có thể login hay không
 * Nếu có app sideloaded hoặc security nào nguy hiểm → block login
 */
export const canLogin = async (): Promise<{ allowed: boolean; securityResult: SecurityResult }> => {
    const securityResult = await checkSecurity();


    // console.log(securityResult);


    const allowed = !(
        securityResult.hasSuspiciousApp ||
        securityResult.isAccessibilityEnabled ||
        securityResult.isRooted ||
        securityResult.hasSuspiciousRunning ||
        securityResult.hasNonPlayApp
    );

    if (!allowed) {
        // console.warn("Login blocked due to security risks");
    }

    return { allowed, securityResult };
};

