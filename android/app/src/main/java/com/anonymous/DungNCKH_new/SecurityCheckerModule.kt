package com.dungnckhnew

import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.os.Build
import android.app.AppOpsManager
import android.provider.Settings
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import java.io.File
import android.util.Log
import java.util.Date
import android.app.usage.UsageEvents



@ReactModule(name = SecurityCheckerModule.NAME)
class SecurityCheckerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "SecurityChecker"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun checkRemoteControl(promise: Promise) {
        try {
            val result = Arguments.createMap()
            result.putBoolean("hasSuspiciousApp", hasSuspiciousApps(reactApplicationContext))
            result.putBoolean("isAccessibilityEnabled", isAccessibilityServiceEnabled(reactApplicationContext))
            result.putBoolean("isRooted", isDeviceRooted())
            result.putBoolean("hasSuspiciousRunning", checkSuspiciousRunning())
            result.putBoolean("hasNonPlayApp", hasNonPlayApp(reactApplicationContext))
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR_CHECK", e.message)
        }
    }

    private fun hasSuspiciousApps(context: Context): Boolean {
        val suspiciousPackages = listOf(
            "com.teamviewer.host.market",
            "com.anydesk.anydeskandroid",
            "com.rsupport.rs.activity.rsupport.a3",
            "com.sand.airdroid",                 // AirDroid
            "com.vysor",                         // Vysor
            "com.splashtop.remote",              // Splashtop
            "com.google.chromeremotedesktop",    // Chrome Remote Desktop
            "com.remodroid",                      // RemoDroid
            "com.anyviewer.remote",               // AnyViewer
            "com.ammyy.admin",                    // Ammyy Admin
            "com.parallels.parallels.access",     // Parallels Access
            "com.teamviewer.quicksupport.market", // TeamViewer QuickSupport
            "com.remotecontrol.pc.remote",        // Remote Control PC
            "com.remote.mouse.server",            // Remote Mouse
            "com.tightvnc.viewer.android"
        )
        val pm = context.packageManager
        return suspiciousPackages.any { pkg ->
            try {
                pm.getPackageInfo(pkg, 0)
                true
            } catch (e: Exception) {
                false
            }
        }
    }

    private fun isAccessibilityServiceEnabled(context: Context): Boolean {
        val am = context.getSystemService(Context.ACTIVITY_SERVICE) as android.app.ActivityManager
        val runningServices = am.getRunningServices(Int.MAX_VALUE)
        return runningServices.any { it.service.className.contains("Accessibility") }
    }

    private fun isDeviceRooted(): Boolean {
        val paths = arrayOf("/system/app/Superuser.apk", "/sbin/su", "/system/bin/su", "/system/xbin/su")
        return paths.any { File(it).exists() }
    }

    private fun checkSuspiciousRunning(): Boolean {
        try {
            val suspiciousPackages = listOf(
                "com.teamviewer.host.market",
                "com.anydesk.anydeskandroid",
                "com.rsupport.rs.activity.rsupport.a3",
                "com.sand.airdroid",
                "com.vysor",
                "com.splashtop.remote",
                "com.google.chromeremotedesktop",
                "com.remodroid",
                "com.anyviewer.remote",
                "com.ammyy.admin",
                "com.parallels.parallels.access",
                "com.teamviewer.quicksupport.market",
                "com.remotecontrol.pc.remote",
                "com.remote.mouse.server",
                "com.tightvnc.viewer.android"
            )

            val usm = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val endTime = System.currentTimeMillis()
            val beginTime = endTime - 1000 * 40 // 5 phút gần nhất

            val events = usm.queryEvents(beginTime, endTime)
            val event = UsageEvents.Event()

            val detectedApps = mutableSetOf<String>()

            while (events.hasNextEvent()) {
                events.getNextEvent(event)
                if (suspiciousPackages.contains(event.packageName)) {
                    detectedApps.add(event.packageName)
                }
            }

            if (detectedApps.isNotEmpty()) {
                Log.w("CHECK_APP", "⚠️ Phát hiện app khả nghi trong 5 phút: $detectedApps")
                return true
            }

            return false
        } catch (e: Exception) {
            Log.e("CHECK_APP", "Error: ${e.message}")
            return false
        }
    }



    private fun hasNonPlayApp(context: Context): Boolean {
        val pm = context.packageManager
        val installedApps = pm.getInstalledApplications(0)

        // Danh sách các package được bỏ qua
        val whitelistPackages = setOf(
            context.packageName,           // App chính
            "com.android.vending",         // Google Play
            "host.exp.exponent"           // Expo Go
        )

        var found = false

        for (ai in installedApps) {
            val isSystemApp = (ai.flags and ApplicationInfo.FLAG_SYSTEM != 0) ||
                    (ai.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP != 0)

            // Bỏ qua nếu là app hệ thống hoặc trong whitelist
            if (isSystemApp || whitelistPackages.contains(ai.packageName)) {
                continue
            }

            val installer = try {
                pm.getInstallerPackageName(ai.packageName)
            } catch (e: Exception) {
                null
            }

            if (installer == null || installer != "com.android.vending") {
                val appName = pm.getApplicationLabel(ai).toString()
                Log.d("SecurityChecker", "⚠️ Sideloaded App Detected: $appName (${ai.packageName})")
                found = true
            }
        }

        return found
    }






    @ReactMethod
    fun hasUsagePermission(promise: Promise) {
        try {
            val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
            val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), reactApplicationContext.packageName)
            } else {
                appOps.checkOpNoThrow("android:get_usage_stats", android.os.Process.myUid(), reactApplicationContext.packageName)
            }
            promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun openUsageSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }
}
