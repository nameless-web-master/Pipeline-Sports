// Centralized asset management for remote images

const supabaseUrl = 'https://dswptzhcmjnylautdeea.supabase.co/storage/v1/object/public/app-assets/';

const imageURL = {
    HomeLogo: 'Logo/Logo.png',
    Logo: 'Logo/Logo-small.png',
    Entry: 'onboarding/entry-screen-1.png',
    Entry1: 'onboarding/entry-screen-2.png',
    Entry2: 'onboarding/entry-screen-3.png',
    Entry3: 'onboarding/entry-screen-4.png'
} as const;

type ImageKey = keyof typeof imageURL;

export const ImagesAssets = (key: ImageKey): string => `${supabaseUrl}${imageURL[key]}`;