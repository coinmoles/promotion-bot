﻿import { readFile } from "fs/promises";
import { QuarterData } from "../../../interfaces/models/QuarterData.js";

export const getQuarterData = async (): Promise<QuarterData> => {
    const jsonRaw = await readFile("quarterData.json", "utf8")

    return JSON.parse(jsonRaw)
}

export const getQuarterDataString = async (quarterData?: QuarterData): Promise<string> => {
    if (quarterData === undefined)
        quarterData = await getQuarterData()

    return `${quarterData.year}-${quarterData.quarter}`
}

export const getQuarterDataFooter = async (quarterData?: QuarterData) => {
    if (quarterData === undefined)
        quarterData = await getQuarterData()

    return { text: `- ${quarterData.year}년도 ${quarterData.quarter}분기 승격신청` }
}