import { supabase } from "../lib/supabase";
import { DatabaseState } from "../types/props";
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
        const formattedStates: DatabaseState[] = states.map(state => ({
            id: state.id,
            code: state.content, // Database stores state codes in 'content' field
            name: state.name // Optional name from database
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
            message: 'Location request saved successfully!'
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
        const { error: insertError } = await supabase.from('users').insert([
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
