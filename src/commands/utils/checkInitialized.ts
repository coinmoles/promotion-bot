import { ChatInputCommandInteraction } from "discord.js"
import { getRoleIds } from "./roleId/getRoleIds.js"
import { notInitializedEmbed } from "./embeds/errorEmbed.js"

export const checkInitialized = async (interaction: ChatInputCommandInteraction): Promise<boolean> => {
    const roleIds = await getRoleIds()
    if (roleIds.chiefRole === "") {
        await interaction.reply({ embeds: [notInitializedEmbed] })
        return false
    }

    return true
}