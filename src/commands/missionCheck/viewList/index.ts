﻿import { SlashCommandSubcommandBuilder } from "discord.js";
import { SlashCommandSubcommandContainer } from "../../../interfaces/commands/CommandContainer.js";
import reply from "./reply.js";

const name = "목록"
const description = "승격조건 목록을 확인합니다"

const viewList: SlashCommandSubcommandContainer = {
    builder: new SlashCommandSubcommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(option => option.setName("정회원").setDescription("승격조건 목록을 확인할 정회원")),
    callback: reply
}

export default viewList