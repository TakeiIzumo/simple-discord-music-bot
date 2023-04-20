const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),

    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        queue.node.skip();

        return interaction.followUp(`Skipped the current song`);
    }
}