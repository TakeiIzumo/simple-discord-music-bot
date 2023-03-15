const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the bot'),

    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        queue.node.setPaused(!queue.node.isPaused());

        switch (queue.node.isPaused()) {
            case true:
                return interaction.followUp(`Paused the bot`);
            case false:
                return interaction.followUp(`Unpaused the bot`);
            default:
                return interaction.followUp(`Something went wrong`);
        }
    }
}