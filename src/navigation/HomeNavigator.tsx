import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home/HomeScreen";
import PaymentsNavigator from "./payment/PaymentsNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";
import { PaymentSTKStackParamList } from "./payment/PayNavigatorSTK";


type HomeStackParamList = {
    HomeMain: undefined;
    Payment: NavigatorScreenParams<PaymentSTKStackParamList>;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="Payment" component={PaymentsNavigator} />
        </Stack.Navigator>
    );
}

export default HomeNavigator
