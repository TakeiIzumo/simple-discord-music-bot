const { useQueue } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the music queue'),
    async execute(interaction) {
        await interaction.deferReply();

        const queue = useQueue(interaction.guild.id);
        const tracks = queue.tracks.toArray();
        const currentTrack = queue.currentTrack;

        let message = ``;
        message += `**Current track playing:** ${currentTrack}\n`;
        let pos = 1;
        for (const track of tracks) {
            message += `${pos}. ${track.title}. Requested by ${track.requestedBy}\n`;
            pos++;
        }
        interaction.followUp(message);
    }
}