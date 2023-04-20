const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue'),

    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        queue.tracks.shuffle();

        return interaction.followUp(`Shuffled the queue`);
    }
}