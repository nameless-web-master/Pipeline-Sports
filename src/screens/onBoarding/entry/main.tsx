import React, { useState } from "react";

import { EntryTemplate } from "./components/template";
import { entryMain } from "../../../types/navigation";


export const EntryMain = ({ navigation }: entryMain) => {
    const [Nr, setNr] = useState<number>(0);

    return <EntryTemplate Nr={Nr} setNr={setNr} navigation={navigation} />
}