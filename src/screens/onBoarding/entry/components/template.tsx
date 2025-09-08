import React, { ReactElement } from "react";

import { Entry, Logo, Entry1, Entry2, Entry3 } from "../../../../assets";
import { Image, ImageSourcePropType, Text, View, StyleSheet } from "react-native";
import { StaticContent } from "../../../../strings";
import { aliasTokens } from "../../../../theme/alias";
import Dots from "../../../../components/dots";
import Button from "../../../../components/Button";
import { OnBoardingScreenProps, entryMain } from "../../../../types/navigation";
import FadeSlideIn from "../../../../components/FadeSlideIn";
import BottomGradient from "../../../../components/BottomGradient";

// Static list of onboarding slides: image + content string
const EntryList: Array<{ image: ImageSourcePropType; content: string }> = [
    {
        image: Entry,
        content: StaticContent.Entry[0]
    },
    {
        image: Entry1,
        content: StaticContent.Entry[1]
    },
    {
        image: Entry2,
        content: StaticContent.Entry[2]
    },
    {
        image: Entry3,
        content: StaticContent.Entry[3]
    },
];

// Component props with explicit types
type EntryTemplateProps = {
    Nr: number; // current slide index (0-based)
    setNr: (next: number) => void;
    navigation: entryMain['navigation'];
};

/**
 * Onboarding entry template that renders slides and navigation controls.
 */
export const EntryTemplate = ({ Nr, setNr, navigation }: EntryTemplateProps): ReactElement => {
    const isFirstSlide = Nr === 0;
    const isLastSlide = Nr >= EntryList.length - 1;

    return (
        <View style={styles.back}>
            <View style={isFirstSlide ? { flex: 1 } : styles.mainImageContainer}>
                <View style={styles.imageWrapper}>
                    <FadeSlideIn trigger={Nr} style={styles.mainImage}>
                        <Image
                            source={EntryList[Nr].image}
                            accessibilityLabel={`Entry${Nr}`}
                            style={styles.mainImage}
                            resizeMode="cover"
                        />
                    </FadeSlideIn>
                    <BottomGradient height={180} />
                </View>
            </View>
            <View style={{ padding: aliasTokens.spacing.Large }}>
                <View style={aliasTokens.basic.dFlexLeft}>
                    <Image source={Logo} accessibilityLabel={`Pipeline logo`} />
                    <Text style={styles.titleText}>Pipeline</Text>
                </View>
                <Text style={styles.mainText}>{EntryList[Nr].content}</Text>
                <View style={aliasTokens.basic.dFlexBetween}>
                    <Dots total={EntryList.length} count={Nr} />
                    <View style={aliasTokens.basic.dFlexBetween}>
                        <Button title="Skip" variant="dark" style={styles.defaultButton} onPress={() => navigation.navigate('Gateway')} />
                        <Button title={isLastSlide ? "Login" : "Next"} variant="primary" style={styles.defaultButton} onPress={() => isLastSlide ? navigation.navigate('Gateway') : setNr(Nr + 1)} />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    back: {
        backgroundColor: aliasTokens.color.background.Inverse,
        flex: 1
    },
    titleText: {
        ...aliasTokens.typography.entryText,
        color: aliasTokens.color.text.InversePrimary,
        marginLeft: aliasTokens.spacing.XSmall
    },
    mainText: {
        ...aliasTokens.typography.display.Medium,
        color: aliasTokens.color.text.InversePrimary,
        marginTop: aliasTokens.spacing.Small,
        marginBottom: aliasTokens.spacing.XXLarge
    },
    defaultButton: {
        width: 100,
        height: 48,
        borderRadius: aliasTokens.borderRadius.Default,
        marginLeft: aliasTokens.spacing.Small
    },
    mainImageContainer: {
        flex: 1,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 80,
    },
    mainImage: {
        ...aliasTokens.sizes.allFullSize
    },
    imageWrapper: {
        position: "relative",
        ...aliasTokens.sizes.allFullSize
    },
});