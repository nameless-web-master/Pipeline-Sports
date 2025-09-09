import React, { useState } from "react";

import { EntryTemplate } from "./components/template";
import { entryMain } from "../../../types/navigation";

/**
 * Main entry screen component for onboarding flow
 * 
 * Manages the slide state and renders the EntryTemplate with:
 * - Current slide index state management
 * - Navigation prop passing
 * - Slide progression controls
 * 
 * @param props - Navigation props from the entry screen type
 * @returns JSX element containing the onboarding template
 */
export const EntryMain = ({ navigation }: entryMain) => {
    // State management for current slide index (0-based)
    const [Nr, setNr] = useState<number>(0);

    return <EntryTemplate Nr={Nr} setNr={setNr} navigation={navigation} />
}