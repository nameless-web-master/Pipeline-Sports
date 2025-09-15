import { StateOption } from '../types/props';

const StaticContent = {
    onBoarding: [
        'Get started by adding your profile photo.',
        'New we just need a few account details.',
        'What interest you about the platform?',
        'Awesome! Let’s find your local community.',
        'Awesome! Let’s find your local community.',
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
            value: 'LA',
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

/**
 * US States data with codes and names
 * Used for state selection in location forms
 */
export const US_STATES: StateOption[] = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
];

export { StaticContent }