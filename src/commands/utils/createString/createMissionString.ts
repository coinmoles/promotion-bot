﻿import { Mission } from "../../../interfaces/models/Mission.js";
import { createNoteString } from "./createNoteString.js";

export const isDefaultCategory = (category: string) => (category === "공통 조건" || category === "개인 조건")

const createMissionString = (mission: Mission, targetId: string) =>
    `- ${mission.completed.includes(targetId) ? ":white_check_mark:" : ":white_square_button:"} ${mission.content} [${mission.score}점]` +
    createNoteString(mission.note)

export const createMissionMapString = (missionMap: Map<string, Mission[]>, targetId: string) =>
    missionMap.size > 0 ?
        Array.from(missionMap)
            .filter(([_, missions]) => missions.length !== 0)
            .sort(([category1, _], [__, ___]) => isDefaultCategory(category1) ? -1 : 0)
            .map(([category, missions]) => (!isDefaultCategory(category) ? `${category}\n` : "") +
                missions.map(mission => createMissionString(mission, targetId)).join("\n"))
            .join("\n") :
        "제시된 조건이 없습니다"

