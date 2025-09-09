const StaticContent = {
    onBoarding: [
        'Get started by adding your profile photo.',
        'New we just need a few account details.',
        'What interest you about the platform?'
    ]
}

export const INTERESTS: string[] = [
    'Baseball',
    'Softball',
    'Tryouts',
    'Tournaments',
    'Discovering Teams',
    'Training Sessions',
    'Player Pickups',
    'Camps',
    'Nutrition',
    'Recruiting',
    'Equipment Reviews',
    'Practice Drills',
    'Coaching Tips',
    'Community',
    'Strength & Conditioning',
];

export const ROLE_OPTIONS = [
    { label: 'Athlete', value: 'athlete' },
    { label: 'Parent', value: 'parent' },
    { label: 'Coach', value: 'coach' },
    { label: 'Trainer', value: 'trainer' },
    { label: 'Other', value: 'other' },
];

export const ENTRY_SLIDES: Array<{ image: 'Entry' | 'Entry1' | 'Entry2' | 'Entry3'; content: string }> = [
    { image: 'Entry', content: 'The new home of Louisiana baseball and softball' },
    { image: 'Entry1', content: 'Connect and engage with your local sports community' },
    { image: 'Entry2', content: 'Find teams, trainers, and training facilities throughout Louisiana' },
    { image: 'Entry3', content: 'Highlight and gain more exposure for your  team' },
];

// Location constants used by LocalCommunity screen
// Extend this list as more states/areas are supported
export const LOCATION_STATES: Array<{
    label: string;
    value: string;
    areas: Array<{ label: string; value: string }>;
}> = [
    {
        label: 'Louisiana',
        value: 'la',
        areas: [
            { label: 'New Orleans Area', value: 'new_orleans' },
            { label: 'Baton Rouge', value: 'baton_rouge' },
            { label: 'Houma & Thibodaux', value: 'houma_thibodaux' },
            { label: 'Lafayette', value: 'lafayette' },
            { label: 'Lake Charles', value: 'lake_charles' },
            { label: 'Shreveport & Bossier City', value: 'shreveport_bossier' },
            { label: 'Alexandria', value: 'alexandria' },
            { label: 'Monroe', value: 'monroe' },
        ],
    },
];

export { StaticContent }