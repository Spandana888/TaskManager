import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "../context/AuthContext";
import AppTabs from "./AppTabs";

export default function RootNavigator(){
    return(
        <AppTabs />
    )
}