import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";

const RootNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // mock state

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainTabs /> : <AuthNavigator onLogin={() => setIsAuthenticated(true)} />}
        </NavigationContainer>
    );
}


export default RootNavigator