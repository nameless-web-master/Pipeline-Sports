import { Children, ReactNode } from "react";
import AppHeader from "../AppHeader";
import { Text } from "react-native";
import { SafeAreaView } from "react-native";

export const Template: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <SafeAreaView></SafeAreaView>
    )
}