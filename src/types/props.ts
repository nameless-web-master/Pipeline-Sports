import { ReactNode } from "react";

export type checkEmailPropsType = 'login' | 'verify' | 'signup' | 'error';

/**
 * State data interface for state selection components
 */
export interface StateOption {
    /** State abbreviation (e.g., 'CA', 'NY') */
    code: string;
    /** Full state name (e.g., 'California', 'New York') */
    name: string;
    /** Optional database ID for states fetched from database */
    id?: number;
}

/**
 * Database state interface for states fetched from Supabase
 */
export interface DatabaseState {
    id: number;
    code: string;
}


export interface DatabaseStateProps {
    id: number;
    code: string;
    name: string
}


/**
 * Location data interface for state and city selection
 */
export interface LocationType {
    state: string;
    city: string;
    id: number;
    cityID: number | null
}


/**
 * Onboarding data structure
 */
export interface OnboardingData {
    photo: {
        isUploaded: boolean;
        uri: string | null;
    };
    profile: {
        firstName: string;
        lastName: string;
        role: string | undefined;
        dateOfBirth: {
            year: number | undefined;
            month: number | undefined;
            day: number | undefined;
        };
    };
    interests: string[];
    location: {
        state: string | undefined;
        area: string | undefined;
    };
}

/**
 * App Navigation Props Data type
 */

export interface AppHeaderProps {
    // Common props
    variant?: 'primary' | 'secondary' | 'search';

    // Primary variant props
    onNotificationPress?: () => void;

    // Secondary variant props
    title?: string;
    leftComponent?: ReactNode;
    rightComponent?: ReactNode;

    // Search variant props
    searchPlaceholder?: string;
    onSearchChange?: (text: string) => void;
    searchValue?: string;
}

export interface AppNavigationData {
    appHeader: AppHeaderProps
    appBar: boolean
}