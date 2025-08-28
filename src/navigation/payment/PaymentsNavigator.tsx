import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentScreen from "../../screens/Payments/PaymentScreen";
import PayNavigatorSTK from "./PayNavigatorSTK";
import PaymentWarning from "../../screens/Payments/PaymentWarning";



export type PaymentStackParamList = {
    PaymentMain: undefined;
    PaymentSTK: { id: string } | undefined;
    PaymentSuccess: undefined;
    PaymentWarning: undefined;
};

const Stack = createNativeStackNavigator<PaymentStackParamList>();

const PaymentsNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PaymentMain" component={PaymentScreen} />
            <Stack.Screen name="PaymentSTK" component={PayNavigatorSTK} />
            <Stack.Screen name="PaymentWarning" component={PaymentWarning} />
        </Stack.Navigator>
    );
}


export default PaymentsNavigator
