import { NavigatorScreenParams } from "@react-navigation/native";
import { PaymentSTKStackParamList } from "./payment/PayNavigatorSTK";

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    HomeTab: undefined;
    Endow: undefined;
    CardsTab: undefined;
    AccountTab: undefined;
};

export type HomeStackParamList = {
    HomeMain: undefined;
    Payment: NavigatorScreenParams<PaymentSTKStackParamList> | undefined;
};


export type PaymentStackParamList = {
    PaymentMain: undefined;
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
    PaymentWarning: undefined;
    PaymentSDT: undefined;
    PaymentSTHE: undefined;
    PaymentQuery: undefined;
    PaymentPartner: undefined;
};




