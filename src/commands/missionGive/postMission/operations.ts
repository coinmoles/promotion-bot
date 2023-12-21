﻿import { ButtonInteraction, ChatInputCommandInteraction, ComponentType, EmbedBuilder, InteractionResponse, Message, ModalSubmitInteraction, User } from "discord.js"
import { postMission } from "../../../db/actions/missionActions.js"
import { Mission } from "../../../interfaces/models/Mission.js"
import { checkAssociate } from "../../utils/checks/checkAssociate.js"
import { confirmCollect, confirmFilter, confirmTimeout, createConfirmActionRow } from "../../utils/components/confirmActionRow.js"
import { createMissionModal, createMissionModalId, getMissionModalValue } from "../../utils/components/missionModal.js"
import { createMissionPreviewString, createMissionPreviewTitle } from "../../utils/createString/createMissionPreviewString.js"
import { errorEmbed } from "../../utils/errorEmbeds.js"
import { getQuarterDataFooter } from "../../utils/quarterData/getQuarterData.js"
import builders from "./builders.js"

const {
    commandId,
    replyEmbedPrototype,
    successEmbedPrototype,
    cancelEmbedPrototype,
} = builders

export const readOptions = (interaction: ChatInputCommandInteraction) => ({
    target: interaction.options.getUser("대상", true)
})

const onConfirm = (modalInteraction: ModalSubmitInteraction, target: User, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferReply({ ephemeral: true })

        const success = await postMission(mission)

        if (success) {
            const successEmbed = new EmbedBuilder(successEmbedPrototype.toJSON())
                .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

            await buttonInteraction.deleteReply()
            await modalInteraction.editReply({ embeds: [successEmbed.setFooter(await getQuarterDataFooter())], components: [] })
        }
        else
            await buttonInteraction.editReply({ embeds: [errorEmbed] })
    }

const onCancel = (modalInteraction: ModalSubmitInteraction, target: User, mission: Mission) =>
    async (buttonInteraction: ButtonInteraction) => {
        await buttonInteraction.deferUpdate()

        const cancelEmbed = new EmbedBuilder(cancelEmbedPrototype.toJSON())
            .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })

        await modalInteraction.editReply({ embeds: [cancelEmbed.setFooter(await getQuarterDataFooter())], components: [] })
    }

const addCollector = async (
    modalInteraction: ModalSubmitInteraction, reply: Message<boolean> | InteractionResponse<boolean>,
    target: User, mission: Mission
) => {
    const collector = reply.createMessageComponentCollector({
        filter: confirmFilter(commandId, modalInteraction.user),
        componentType: ComponentType.Button, time: 10_000, max: 1
    })

    collector.on("collect", confirmCollect(commandId, modalInteraction.user,
        onConfirm(modalInteraction, target, mission), onCancel(modalInteraction, target, mission)))
    collector.on('end', confirmTimeout(modalInteraction));
}

export const doReply = async (interaction: ChatInputCommandInteraction, target: User, isEditing: boolean = false) => {
    if (!await checkAssociate(interaction, target.id, true))
        return

    await interaction.showModal(createMissionModal(commandId, interaction.user, target))

    const modalInteraction = await interaction.awaitModalSubmit({
        filter: mI => mI.customId === createMissionModalId(commandId, interaction.user),
        time: 60_000
    }).catch(_ => null)
    if (modalInteraction === null)
        return

    const mission = getMissionModalValue(modalInteraction, target)
    if (mission === undefined) {
        await modalInteraction.reply("점수가 숫자가 아닙니다!")
        return
    }

    const replyEmbed = EmbedBuilder.from(replyEmbedPrototype)
        .addFields({ name: createMissionPreviewTitle(mission, target), value: createMissionPreviewString(mission, target) })
        .setFooter(await getQuarterDataFooter())

    const reply = await modalInteraction.reply({
        embeds: [replyEmbed],
        components: [createConfirmActionRow(commandId, modalInteraction.user)],
        ephemeral: true,
        fetchReply: true
    });

    await addCollector(modalInteraction, reply, target, mission)
}