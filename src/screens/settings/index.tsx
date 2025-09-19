import { useContext, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageUploader from "../../components/ImageUploader";
import { aliasTokens } from "../../theme/alias";
import { ChevronRight, LogOut } from "lucide-react-native";

import { AuthContext } from "../../context/AuthContext";
import { Version } from "../../components/Version";
import type { ShowToast } from "../../types/toast";
import { signOut } from "../../hooks/useAuth";

import { SettingsMain } from "../../types/navigation";

import { Template } from "../../components/layout/Template";
import EmailBottomSheet from "../../components/EmailBottomSheet";
import validateEmail from "../../utils/validateEmail";

/**
 * SettingsScreen
 * Renders user profile summary, pages list, and account settings actions.
 * The layout follows the provided design while leveraging shared tokens/components.
 */
interface SettingsScreenProps extends SettingsMain {
    showToast: ShowToast;
}

export const SettingsScreen = ({ showToast, navigation }: SettingsScreenProps) => {
    const { user } = useContext(AuthContext);
    console.log(user);

    // Controls the visibility of the email change bottom sheet
    const [emailSheetVisible, setEmailSheetVisible] = useState(false);
    // In a real app use user's email from context. Using placeholder here.
    const currentEmail = "daniel.martinez1995@gmail.com";

    const SignOutHandle = async () => {
        if (!user) {
            showToast({
                message: "User Invalid!",
                type: "danger"
            });
            return;
        }

        const signOutResult = await signOut();
        if (!signOutResult.success)
            showToast({
                message: signOutResult.error as string,
                type: "danger"
            });
        else {
            showToast({
                message: "Sign Out Success!",
                type: "success"
            });
            navigation.navigate('Gateway');
        }
    }

    return (
        <Template>
            <ScrollView>
                {/* Profile header */}
                <View style={styles.profileHeader}>
                    <ImageUploader initialImageUri={"dfg"} />
                    <Text style={styles.profileName}>Daniel Martinez</Text>
                    <Text style={styles.profileEmail}>daniel.martinez1995@gmail.com</Text>
                </View>

                {/* My Pages section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Pages (2)</Text>
                    <View style={styles.listGroup}>
                        <ListItem
                            leading={<PlaceholderBadge label="Nola" background="#1e2a78" />}
                            title="NOLA Fastpitch 2013"
                            onPress={() => { /* navigate to page details */ }}
                        />
                        <ListItem
                            leading={<PlaceholderBadge label="UBJ" background="#0f4c3a" />}
                            title="Untied Baseball Jones"
                            onPress={() => { /* navigate to page details */ }}
                        />
                    </View>
                </View>

                {/* Account Settings section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.listGroup}>
                        <ListItem title="User Information" onPress={() => { navigation.navigate('UserInformation'); }} />
                        <ListItem title="Location" subtitle="New Orleans" onPress={() => { navigation.navigate('LocationSetting'); }} />
                        <ListItem title="Email" onPress={() => setEmailSheetVisible(true)} />
                        <ListItem title="Password" onPress={() => { navigation.navigate('PasswordHandle'); }} />
                    </View>
                </View>

                {/* Logout */}

                <View style={styles.section}>
                    <View style={styles.listGroup}>
                        <TouchableOpacity activeOpacity={0.8} style={styles.logoutRow} onPress={SignOutHandle}>
                            <Text style={styles.logoutText}>Logout</Text>
                            <LogOut size={24} color={aliasTokens.color.text.Primary} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={[styles.logoutText, { color: aliasTokens.color.text.Error }]}>
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Version />
            </ScrollView>
            {/* Email change bottom sheet */}
            <EmailBottomSheet
                visible={emailSheetVisible}
                currentEmail={currentEmail}
                onConfirm={async (newEmail) => {
                    // Example handler: validate again, then show toast. Replace with API call.
                    if (!validateEmail(newEmail)) {
                        showToast({ message: 'Invalid email.', type: 'danger' });
                        return;
                    }
                    showToast({ message: 'Check and verify your new email', type: 'success' });
                }}
                onClose={() => setEmailSheetVisible(false)}
                showToast={showToast}
            />
        </Template>
    );
};

// -----------------------------
// Internal presentational pieces
// -----------------------------

interface ListItemProps {
    title: string;
    subtitle?: string;
    leading?: React.ReactNode;
    onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, leading, onPress }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.listItem}>
            {/* Optional left content (e.g., page badge) */}
            {leading && <Image style={styles.leading} src="https://dswptzhcmjnylautdeea.supabase.co/storage/v1/object/public/app-assets/pages/NOLA%20Fastpitch.png" />}

            {/* Title and optional subtitle */}
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle ? <Text style={styles.itemSubtitle}>({subtitle})</Text> : null}
            </View>

            {/* Chevron */}
            <ChevronRight size={24} color={aliasTokens.color.text.Primary} />
        </TouchableOpacity>
    );
};

const PlaceholderBadge: React.FC<{ label: string; background: string; }> = ({ label, background }) => {
    return (
        <View style={[styles.badge, { backgroundColor: background }]}>
            <Text style={styles.badgeText}>{label}</Text>
        </View>
    );
};

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
    profileHeader: {
        flexDirection: 'column',
        gap: aliasTokens.spacing.XSmall,
        alignItems: 'center',
        backgroundColor: aliasTokens.color.background.Primary,
        padding: aliasTokens.spacing.Medium
    },
    profileName: {
        ...aliasTokens.typography.display,
        color: aliasTokens.color.text.Primary,
    },
    profileEmail: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
    },
    section: {
        backgroundColor: aliasTokens.color.background.Primary,
        marginTop: aliasTokens.spacing.XXSmall,
        paddingHorizontal: aliasTokens.spacing.Medium,
        paddingVertical: aliasTokens.spacing.Small
    },
    sectionTitle: {
        ...aliasTokens.typography.labelText.Small,
        lineHeight: 16,
        fontSize: 11,
        color: aliasTokens.color.text.Tertiary,
    },
    card: {
        backgroundColor: aliasTokens.color.background.Primary,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: aliasTokens.color.border.Light,
    },
    listGroup: {
        marginTop: aliasTokens.spacing.XSmall,
        gap: aliasTokens.spacing.XSmall
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: aliasTokens.spacing.Small,
    },
    leading: {
        width: 42,
        height: 42,
        borderRadius: aliasTokens.borderRadius.Small
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: aliasTokens.spacing.XXSmall,
    },
    itemTitle: {
        ...aliasTokens.typography.labelText.Medium,
        color: aliasTokens.color.text.Primary,
        paddingVertical: 10
    },
    itemSubtitle: {
        ...aliasTokens.typography.body.Small,
        color: aliasTokens.color.text.Secondary,
    },
    divider: {
        height: 1,
        backgroundColor: aliasTokens.color.border.Light,
        marginLeft: aliasTokens.spacing.Medium + 44, // align with text after badge
    },
    badge: {
        width: 36,
        height: 36,
        borderRadius: aliasTokens.borderRadius.Full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        ...aliasTokens.typography.labelText.Small,
        color: aliasTokens.color.text.InversePrimary,
    },
    logoutRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoutText: {
        ...aliasTokens.typography.labelText.Medium,
        color: aliasTokens.color.text.Primary,
        paddingVertical: 9
    },
});