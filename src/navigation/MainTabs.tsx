import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute, RouteProp } from "@react-navigation/native";
import { StyleSheet } from "react-native";

import HomeNavigator from "./HomeNavigator";
import HomeScreen from "../screens/Home/HomeScreen";

type RootTabParamList = {
    Home: undefined;
    Cards: undefined;
    QR: undefined;
    Endow: undefined;
    Account: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
                tabBarLabelStyle: { marginBottom: 5, fontWeight: "bold" },
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Endow") iconName = "gift-outline";
                    else if (route.name === "QR") iconName = "qr-code-outline";
                    else if (route.name === "Cards") iconName = "card";
                    else iconName = "person";

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarStyle: styles.tabBar, // default style
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeNavigator}
                options={({ route }) => {
                    const focusedRoute = getFocusedRouteNameFromRoute(route as RouteProp<any>) ?? "";
                    const hideTabBar = focusedRoute === "Payment"; // màn hình cần ẩn
                    return {
                        tabBarStyle: hideTabBar ? { display: "none" } : styles.tabBar,
                    };
                }}
            />
            <Tab.Screen name="Cards" component={HomeScreen} />
            <Tab.Screen name="QR" component={HomeScreen} />
            <Tab.Screen name="Endow" component={HomeScreen} />
            <Tab.Screen name="Account" component={HomeScreen} />
        </Tab.Navigator>
    );
};

export default MainTabs;

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        paddingTop: 10,
        height: 70,
        borderRadius: 10,
        backgroundColor: "#046cdbff",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        marginHorizontal: 20
    },
});
