const StaticContent = {
    onBoarding: [
        'Get started by adding your profile photo.',
        'New we just need a few account details.',
        'What interest you about the platform?',
        'Awesome! Let’s find your local community.'
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

// Community Commitment Agreement Content
export const COMMUNITY_COMMITMENT = {
    title: "Our Community Commitment",
    heading: "This is a space where everyone in TravelBall belongs.",
    intro: "To keep this a positive and supportive environment, we're asking you to commit to the following:",
    commitments: [
        "I agree to treat all members of the Travel Ball community, players, parents, coaches, and organizers with kindness and respect.",
        "No matter their age, background, skill level, gender, race, location, or beliefs, every member deserves to feel welcome and included.",
        "That means engaging without judgment, avoiding negativity, and helping to build a space where everyone can thrive on and off the field."
    ],
    buttonText: "Agree and continue"
};

// Notification Permission Screen Content
export const NOTIFICATION_PERMISSION = {
    title: "Turn on notifications?",
    description: [
        "Stay in the loop with tryouts, team updates, and new posts in your area.",
        "Get alerts for messages, important announcements, and upcoming events."
    ],
    primaryButtonText: "Yes, notify me",
    secondaryButtonText: "Skip"
};

export { StaticContent }