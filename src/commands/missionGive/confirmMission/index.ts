﻿import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "완료"
const description = "승격조건 달성 처리를 합니다"

const confirmMission: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("대상").setDescription("승격조건을 달성한 준회원").setRequired(true))
        .addBooleanOption(option => option.setName("공통조건여부").setDescription("달성한 승격조건이 공통 조건이면 True, 개인 조건이면 False").setRequired(true))
        .addStringOption(option => option.setName("카테고리").setDescription("달성한 승격조건 카테고리, 카테고리가 없는 경우 \"공통 조건\" 또는 \"개인 조건\" 입력").setRequired(true))
        .addNumberOption(option => option.setName("번호").setDescription("달성한 승격조건 번호 (1-base)").setRequired(true)),
    callback: reply
}

export default confirmMission