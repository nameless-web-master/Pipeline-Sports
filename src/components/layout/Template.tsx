import { ReactNode, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../../types/navigation";
import AppBar from "../AppBar";
import AppHeader from "../AppHeader";
import { AppNavigationData } from "../../types/props";

/**
 * Template Component
 * A layout wrapper used for screens with a consistent header, scrollable content, and a bottom tab bar.
 */
export const Template: React.FC<{
    children: ReactNode,
    state?: AppNavigationData,
    setState?: React.Dispatch<React.SetStateAction<AppNavigationData>>
}> = ({ children, state, setState }) => {
    // Local state to track the currently active tab
    const [tab, setTab] = useState("profile");

    // Navigation object from React Navigation
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    /**
     * Mapping of tab names to navigation routes.
     * Using `useMemo` for performance: the mapping won't be recalculated on every render.
     * All tabs currently point to 'SettingsMain', which may be updated later for actual routing.
     */
    const tabToRoute = useMemo<Record<string, keyof RootStackParamList>>(() => ({
        home: 'SettingsMain',
        directory: 'SettingsMain',
        board: 'SettingsMain',
        profile: 'SettingsMain'
    }), []);

    return (
        <View style={styles.templateContainer}>
            {/* Fixed app header at the top */}
            <AppHeader variant="primary" {...state?.appHeader} />

            {/* Content area should expand to fill available space; avoid wrapping Navigators in ScrollView */}
            <View style={styles.contentContainer}>
                {children}
            </View>

            {/* Bottom navigation bar */}
            {
                !state?.appBar && <AppBar
                    activeTab={tab}
                    onTabPress={(tabName: string) => {
                        setTab(tabName); // Update the active tab
                        const route = tabToRoute[tabName]; // Look up the corresponding route
                        if (route) {
                            navigation.navigate(route); // Navigate to the selected route
                        }
                    }}
                />
            }
        </View>
    );
};

// Style definitions for the layout
const styles = StyleSheet.create({
    templateContainer: {
        width: "100%",
        height: '100%',
    },
    contentContainer: {
        flex: 1,
    }
});
