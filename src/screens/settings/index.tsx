import { useContext, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageUploader from "../../components/ImageUploader";
import { aliasTokens } from "../../theme/alias";
import { ChevronRight, LogOut } from "lucide-react-native";

import { AuthContext } from "../../context/AuthContext";
import { Version } from "../../components/Version";
import type { ShowToast } from "../../types/toast";
import { signOut, updateEmail } from "../../hooks/useAuth";

import { SettingsMain } from "../../types/navigation";

import { Template } from "../../components/layout/Template";
import EmailBottomSheet from "../../components/EmailBottomSheet";
import validateEmail from "../../utils/validateEmail";
import { uploadImageToStorage, updateUserProfile } from "../../hooks/useProfile";
import NoteBottomSheet from "../../components/NoteBottomSheet";

import * as Linking from 'expo-linking';
import { supabase } from "../../lib/supabase";


/**
 * SettingsScreen
 * Renders user profile summary, pages list, and account settings actions.
 * The layout follows the provided design while leveraging shared tokens/components.
 */
interface SettingsScreenProps extends SettingsMain {
    showToast: ShowToast;
}

export const SettingsScreen = ({ showToast, navigation }: SettingsScreenProps) => {
    const { user, profile, setState, state } = useContext(AuthContext);
    // Controls the visibility of the email change bottom sheet
    const [emailSheetVisible, setEmailSheetVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    // In a real app use user's email from context. Using placeholder here.
    const currentEmail = useMemo(() => user?.email ?? '', [state]);

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

    /**
     * Handles avatar change from the ImageUploader
     * 1) Validate session user
     * 2) Upload image to storage
     * 3) Update `users.avatar` with the new public URL
     * 4) Provide user feedback via toasts
     */
    const handleAvatarChange = async (localUri: string) => {
        try {
            if (!user?.id) {
                showToast({ message: 'User session not found.', type: 'danger' });
                return;
            }

            setIsLoading(true);

            // Step 1: Upload image
            const uploadResult = await uploadImageToStorage(localUri, user.id);
            if (!uploadResult.success || !uploadResult.publicUrl) {
                showToast({ message: uploadResult.error || 'Upload failed', type: 'danger' });
                return;
            }

            // Step 2: Persist avatar URL to user profile
            const updateResult = await updateUserProfile(user.id, { avatar: uploadResult.publicUrl });
            if (!updateResult.success) {
                showToast({ message: updateResult.error || 'Failed to update profile photo', type: 'danger' });
                return;
            }

            // Success
            showToast({ message: 'Profile photo updated.', type: 'success' });
        } catch (error: any) {
            showToast({ message: error.message, type: "danger" });
        } finally {
            setIsLoading(false);
            setState?.(prev => !prev);
        }
    };

    // Handle deep link navigation
    useEffect(() => {
        const handleDeepLink = async (url: string | null) => {
            if (!url) return;

            console.log('Deep link URL:', url);

            if (url.includes('SettingsMain')) {
                // Re-fetch the user instead of exchangeCodeForSession
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    showToast({
                        message: "Failed to fetch user. Try again.",
                        type: "danger"
                    });
                    return;
                }

                if (data?.user) {
                    // Check if email changed
                    if (data.user.email === currentEmail) {
                        showToast({
                            message: "You should verify your Old and New Email with.",
                            type: "info",
                            duration: 2400
                        });
                    } else if (!isSuccess) {
                        // Only set success if not already showing
                        setIsSuccess(true);
                    }
                }

                setState?.((prev) => !prev);
            }
        };

        // Get initial URL and listen for new URLs
        Linking.getInitialURL().then(handleDeepLink);
        const subscription = Linking.addEventListener('url', (event) => {
            handleDeepLink(event.url);
        });

        return () => subscription.remove();
    }, [currentEmail, isSuccess, showToast, setState]);

    /**
      * Handles email change from the Bottom
      * 1) Validate session user
      * 2) Validate new email
      * 3) Update the email
      */

    const handleEmailChange = async (newEmail: string) => {
        try {
            // Example handler: validate again, then show toast. Replace with API call.
            if (!validateEmail(newEmail)) {
                showToast({ message: 'Invalid email.', type: 'danger' });
                return;
            }

            if (!user?.id) {
                showToast({ message: 'User session not found.', type: 'danger' });
                return;
            }

            const updateEmailResult = await updateEmail(user.id, newEmail);

            if (!updateEmailResult.success) {
                showToast({ message: updateEmailResult.error as string, type: 'danger' });
                return;
            }

            showToast({ message: 'Check and verify your emails', type: 'success' });
        } catch (error: any) {
            showToast({ message: error.message, type: 'danger' });
        } finally {
            setState?.(prev => !prev);
        }
    }

    const HandleNoteClose = () => {
        setIsSuccess(false);
        showToast({
            message: 'You should Login again',
            type: "info"
        });
        navigation.navigate("Gateway");
    }

    return (
        <Template>
            <ScrollView>
                {/* Profile header */}
                <View style={styles.profileHeader}>
                    <ImageUploader
                        initialImageUri={profile?.avatar}
                        onImageSelected={handleAvatarChange}
                    />
                    <Text style={styles.profileName}>{profile?.first_name} {profile?.last_name}</Text>
                    <Text style={styles.profileEmail}>{currentEmail}</Text>
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
                currentEmail={currentEmail ?? ''}
                onConfirm={handleEmailChange}
                onClose={() => setEmailSheetVisible(false)}
                showToast={showToast}
            />
            {/* After Success Email Verification */}
            {
                isSuccess && <NoteBottomSheet
                    visible={isSuccess}
                    onClose={HandleNoteClose}
                    successTitle="Email Verified"
                    successMessage="Your new email has been successfully set and verified"
                />
            }
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