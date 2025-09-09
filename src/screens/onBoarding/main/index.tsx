import React, { useState } from "react";
import Header from "./header";
import { StyleSheet, Text, View } from "react-native";
import { aliasTokens } from "../../../theme/alias";
import PhotoUpload from "./components/photoUpload";
import SetProfile from "./components/SetProfile";
import SetInterest from "./components/SetInterest";

export const OnBoardingMain = () => {
    const [state, setState] = useState(1);
    return (
        <View style={styles.container}>
            <Header
                onBackPress={() => setState(prev => prev - 1)}
                progress={state}
            />
            {/* <PhotoUpload onNext={() => setState(prev => prev + 1)} /> */}
            {/* <SetProfile /> */}
            <SetInterest />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: aliasTokens.color.background.Primary,
        paddingTop: aliasTokens.spacing.XLarge,
        paddingHorizontal: aliasTokens.spacing.Large,
        paddingBottom: aliasTokens.spacing.Medium,
    }
})