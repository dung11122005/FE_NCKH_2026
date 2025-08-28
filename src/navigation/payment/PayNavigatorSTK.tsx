import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentSTK from "../../screens/Payments/PaymentSTK";
import ConfirmPaymentSTK from "../../screens/Payments/ConfirmPaymentSTK";
import PaymentSuccess from "../../screens/Payments/PaymentSuccess";
import PaymentWarning from "../../screens/Payments/PaymentWarning";


export type PaymentSTKStackParamList = {
    PaymentSTK: { id: string } | undefined;
    ConfirmPaymentSTK: {
        selectedBank: string;
        accountNumber: string;
        amount: string;
        description: string;
    };
    PaymentSuccess: {
        amount: string;
        receiver: {
            name: string;
            account: string;
            bank: string;
        };
        description: string;
    };
    // PaymentWarning: undefined;
};

const Stack = createNativeStackNavigator<PaymentSTKStackParamList>();

const PayNavigatorSTK = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PaymentSTK" component={PaymentSTK} />
            <Stack.Screen name="ConfirmPaymentSTK" component={ConfirmPaymentSTK} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        </Stack.Navigator>
    );
}


export default PayNavigatorSTK

