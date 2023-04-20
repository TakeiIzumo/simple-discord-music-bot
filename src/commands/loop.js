const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Choose the loop option')
        .addNumberOption(option =>
            option.setName('option')
                .setDescription('Loop options')
                .setRequired(true)
                .addChoices(
                    { name: 'No loop', value: 0 },
                    { name: 'Current track', value: 1 },
                    { name: 'Current queue', value: 2 }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        const queueOption = interaction.options.getNumber('option');

        const queue = useQueue(interaction.guild.id);
        queue.setRepeatMode(queueOption);

        switch (queueOption) {
            case 0:
                return interaction.followUp(`Disable loop`);
            case 1:
                return interaction.followUp(`Looping the current track`);
            case 2:
                return interaction.followUp(`Looping the current queue`);
            default:
                return interaction.followUp(`Something went wrong`);
        }
    }
}