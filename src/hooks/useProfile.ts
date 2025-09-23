import { supabase } from "../lib/supabase";
import { DatabaseState, DatabaseStateProps } from "../types/props";
import { US_STATES } from "../strings";
import { getCurrentSession } from "./useSession";

/**
 * Fetch all states from the database
 * Retrieves state information from the 'states' table in Supabase
 * @returns Promise with success status and states data or error
 */
export const fetchStatesFromDB = async () => {
    try {
        const { data: states, error } = await supabase
            .from('states')
            .select('*')
            .neq('content', "LA")
            .order('content', { ascending: true });


        if (error) {
            console.log('Error fetching states from database:', error);
            return {
                success: false,
                states: null,
                error: error.message
            };
        }

        if (!states || states.length === 0) {
            return {
                success: false,
                states: null,
                error: 'No states found in database'
            };
        }

        // Transform database states to match the expected format
        const formattedStates: DatabaseStateProps[] = states.map(state => ({
            id: state.id,
            code: state.content, // Database stores state codes in 'content' field
            name: US_STATES.find(s => s.code === state.content)?.name || state.content,
        }));

        return {
            success: true,
            states: formattedStates,
            error: null
        };

    } catch (error) {
        console.log('Failed to fetch states from database:', error);
        return {
            success: false,
            states: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

/**
 * Fetch states that have at least one related local_area
 * Uses two queries for portability: first collect distinct state IDs from `local_area.match`,
 * then fetch those states from `states` and map to `DatabaseState`.
 */
export const fetchStatesWithLocalAreas = async () => {
    try {
        // 1) Get distinct state ids referenced by local_area.match
        const { data: areaRows, error: areasError } = await supabase
            .from('local_area')
            .select('match')

        if (areasError) {
            console.log('Error reading local_area state references:', areasError);
            return { success: false, states: null, error: areasError.message };
        }

        const distinctStateIds = Array.from(new Set((areaRows ?? []).map(r => r.match as number))).filter(Boolean);

        if (distinctStateIds.length === 0) {
            return { success: true, states: [], error: null };
        }

        // 2) Fetch only those states
        const { data: stateRows, error: statesError } = await supabase
            .from('states')
            .select('id, content')
            .in('id', distinctStateIds)
            .order('content', { ascending: true });

        if (statesError) {
            console.log('Error fetching states with local areas:', statesError);
            return { success: false, states: null, error: statesError.message };
        }

        const formatted: DatabaseState[] = (stateRows ?? []).map(s => ({
            id: s.id,
            code: s.content,
            name: US_STATES.find(us => us.code === s.content)?.name || s.content,
        }));

        return { success: true, states: formatted, error: null };
    } catch (error) {
        console.log('Failed to fetch states with local areas:', error);
        return {
            success: false,
            states: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

/**
 * Fetch local areas for a given state id (local_area.match === stateId)
 */
export const fetchLocalAreasByStateId = async (stateId: number) => {
    try {
        const { data, error } = await supabase
            .from('local_area')
            .select('id, content, match')
            .eq('match', stateId)
            .order('content', { ascending: true });

        if (error) {
            console.log('Error fetching local areas by stateId:', error);
            return { success: false, areas: null, error: error.message };
        }

        return { success: true, areas: data ?? [], error: null };
    } catch (error) {
        console.log('Failed to fetch local areas by stateId:', error);
        return {
            success: false,
            areas: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

/**
 * Fetch state information by ID
 * @param stateId - The state ID to look up
 * @returns Promise with state data or error
 */
export const getStateById = async (stateId: number) => {
    try {
        const { data: state, error } = await supabase
            .from('states')
            .select('*')
            .eq('id', stateId)
            .maybeSingle();

        if (error) {
            console.log('Error fetching state by ID:', error);
            return {
                success: false,
                state: null,
                error: error.message
            };
        }

        if (!state) {
            return {
                success: false,
                state: null,
                error: 'State not found'
            };
        }

        return {
            success: true,
            state: {
                id: state.id,
                code: state.content,
                name: state.name
            },
            error: null
        };
    } catch (error) {
        console.log('Failed to fetch state by ID:', error);
        return {
            success: false,
            state: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

/**
 * Fetch local area information by ID
 * @param areaId - The local area ID to look up
 * @returns Promise with area data or error
 */
export const getLocalAreaById = async (areaId: number) => {
    try {
        const { data: area, error } = await supabase
            .from('local_area')
            .select('*')
            .eq('id', areaId)
            .maybeSingle();

        if (error) {
            console.log('Error fetching local area by ID:', error);
            return {
                success: false,
                area: null,
                error: error.message
            };
        }

        if (!area) {
            return {
                success: false,
                area: null,
                error: 'Local area not found'
            };
        }

        return {
            success: true,
            area: {
                id: area.id,
                content: area.content,
                match: area.match
            },
            error: null
        };
    } catch (error) {
        console.log('Failed to fetch local area by ID:', error);
        return {
            success: false,
            area: null,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
};

/**
 * Get location data by area name
 * Fetches area and corresponding state information from the database
 * @param area - The area name to look up
 * @returns Promise with state and area IDs or error
 */
export const getLocation = async (area: string) => {
    try {
        // First, get the area information
        const { data: areaRow, error: areaError } = await supabase
            .from('local_area')
            .select('*')
            .eq('content', area);

        if (areaError || !areaRow || areaRow.length === 0) {
            console.log('Area lookup failed:', areaError);
            return Error;
        }

        // Then, get the corresponding state information
        const { data: stateRow, error: stateError } = await supabase
            .from('states')
            .select('*')
            .eq('id', areaRow[0].match);

        if (stateError || !stateRow || stateRow.length === 0) {
            console.log('State lookup failed:', stateError);
            return Error;
        }

        return {
            state: stateRow[0].id,
            area: areaRow[0].id
        };

    } catch (error) {
        console.log('Location lookup error:', error);
        return error;
    }
}

/**
 * Upload image to Supabase storage
 * @param imageUri - Local URI of the image to upload
 * @param userId - User ID for the file path
 * @returns Promise with upload result containing public URL or error
 */


export const uploadImageToStorage = async (imageUri: string, userId: string) => {
    try {
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `avatar_${userId}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;


        // Convert image URI to Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer(); // Convert to ArrayBuffer


        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('app-assets') // Make sure this is your bucket name
            .upload(filePath, arrayBuffer, {
                contentType: `image/${fileExt}`,
                upsert: false,
            });

        if (error) {
            console.log('Image upload error:', error);
            return { success: false, error: error.message };
        }

        // Get public URL for uploaded image
        const { data: publicData } = supabase.storage
            .from('app-assets')
            .getPublicUrl(filePath);

        return {
            success: true,
            publicUrl: publicData.publicUrl,
            filePath,
        };
    } catch (error) {
        console.log('Image upload failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed',
        };
    }
};

/**
 * Save location request to database
 * Inserts a new location request record with user ID, state, and city information
 * @param locationData - Location data containing state, city, and user ID
 * @returns Promise with success status and message
 */
export const saveLocationToDB = async (locationData: {
    city: string;
    stateId: number;
    userId: string;
}) => {
    try {
        const { city, stateId, userId } = locationData;

        // Validate required data
        if (!city?.trim() || !stateId || !userId) {
            return {
                success: false,
                message: 'Missing required location information'
            };
        }

        // Insert location into the basic table in the database
        const { data, error: insertError } = await supabase
            .from('local_area')
            .insert([
                {
                    content: city.trim(),
                    match: stateId,
                }
            ])
            .select('id');

        if (insertError) {
            console.log('Location request insert error:', insertError);
            return {
                success: false,
                message: 'Failed to save location request. Please try again.'
            };
        }

        // Insert Location Request into special table in database
        const { error: locationRequestError } = await supabase
            .from('location_requests')
            .insert([
                {
                    city: data[0].id,
                    state: stateId
                }
            ]);

        if (locationRequestError) {
            console.log('Location request insert error:', insertError);
            return {
                success: false,
                message: 'Failed to save location request. Please try again.'
            };
        }

        return {
            success: true,
            message: 'Location request saved successfully!',
            cityID: data[0].id
        };

    } catch (error) {
        console.log('Save location request error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.'
        };
    }
};

/**
 * Complete user onboarding process
 * Handles image upload, location lookup, and user data insertion
 * @param data - Onboarding data containing photo, profile, interests, and location
 * @returns Promise with success status and message
 */
export const OnBoarding = async (data: any) => {
    try {
        // Extract onboarding data
        const { photo, profile, interests, location } = data;

        // Validate required data
        if (!photo?.uri || !profile?.firstName || !profile?.lastName || !profile?.role) {
            return {
                success: false,
                message: 'Missing required profile information'
            };
        }

        // Get current session and validate
        const session = await getCurrentSession();
        if (!session.session?.user?.id) {
            return {
                success: false,
                message: 'User session not found. Please log in again.'
            };
        }

        const userId = session.session.user.id;

        // Get location data
        const locationResult = await getLocation(location.area);
        if (!locationResult || locationResult instanceof Error || typeof locationResult !== 'object' || !('state' in locationResult) || !('area' in locationResult)) {
            return {
                success: false,
                message: 'Invalid location selected. Please try again.'
            };
        }

        // Upload image to storage if provided
        let avatarUrl = null;
        if (photo.uri) {
            const uploadResult = await uploadImageToStorage(photo.uri, userId);
            if (!uploadResult.success) {
                return {
                    success: false,
                    message: `Image upload failed: ${uploadResult.error}`
                };
            }
            avatarUrl = uploadResult.publicUrl;
        }

        // Insert user data into database
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: userId,
                    first_name: profile.firstName.trim(),
                    last_name: profile.lastName.trim(),
                    avatar: avatarUrl, // Use uploaded image URL
                    role: profile.role,
                    birthday: new Date(
                        profile.dateOfBirth.year,
                        profile.dateOfBirth.month - 1, // JavaScript months are 0-indexed
                        profile.dateOfBirth.day,
                    ),
                    interest: interests.join(','),
                state: Number(locationResult.state),
                local_area: Number(locationResult.area)
                }
            ]);

        if (insertError) {
            console.log('Database insert error:', insertError);
            return {
                success: false,
                message: 'Failed to save profile. Please try again.'
            };
        }

        return {
            success: true,
            message: 'Profile created successfully!'
        };

    } catch (error) {
        console.log('Onboarding error:', error);
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.'
        };
    }
}

/**
 * Get User profile
 * @param Id - user id 
 * @returns Promise with success status, message and data
 */
export const getUserProfile = async (userid: string) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userid)
            .maybeSingle();

        if (error) {
            console.log('Database insert error:', error);
            return {
                success: false,
                message: 'Getting User Profile Error',
                data: null
            };
        }

        return {
            success: true,
            message: 'Getting User Profile with ID is success',
            data
        };

    } catch (error) {
        console.log('Getting User Profile with userid:', error);
        return {
            success: false,
            message: 'An unexpected error occurred. Please try again.',
            data: null
        };
    }
}

/**
 * Update a user's profile row in the `users` table
 * Validates active session and that the session user matches the target row
 * @param rowId - The `users.id` to update (must match current session user)
 * @param newData - Key/value pairs to update (e.g., { first_name: 'John' })
 * @returns Promise with success status, message and the updated row
 */
export const updateUserProfile = async (
    rowId: string,
    newData: Record<string, unknown>
): Promise<{ success: boolean; error: string | null }> => {
    try {
        // Validate input
        if (!rowId || typeof rowId !== 'string') {
            return {
                success: false,
                error: 'Invalid rowId provided.'
            };
        }

        if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
            return {
                success: false,
                error: 'Invalid update payload provided.'
            };
        }

        // Ensure we do not allow updating restricted fields
        const { id: _omitId, created_at: _omitCreatedAt, updated_at: _omitUpdatedAt, ...sanitizedData } = newData as Record<string, unknown>;

        if (Object.keys(sanitizedData).length === 0) {
            return {
                success: false,
                error: 'No fields provided to update.'
            };
        }

        // Validate active session
        const session = await getCurrentSession();
        const sessionUserId = session.session?.user?.id;
        if (!sessionUserId) {
            return {
                success: false,
                error: 'User session not found. Please log in again.'
            };
        }

        // Ensure the session user is updating their own row
        if (sessionUserId !== rowId) {
            return {
                success: false,
                error: 'You are not authorized to update this profile.'
            };
        }

        // Perform update
        const { data, error } = await supabase
            .from('users')
            .update(sanitizedData)
            .eq('id', rowId)
            .select('*')
            .maybeSingle();

        if (error) {
            console.log('User update error:', error);
            return {
                success: false,
                error: 'Failed to update profile. Please try again.'
            };
        }

        return {
            success: true,
            error: null
        };
    } catch (error) {
        console.log('Update profile unexpected error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'
        };
    }
};