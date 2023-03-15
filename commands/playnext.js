const { useMasterPlayer, useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnext')
        .setDescription('Queue the track next to the current play track')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Query name or link to the song.')
                .setRequired(true)),

    async execute(interaction) {
        const player = useMasterPlayer();
        const queue = useQueue(interaction.guild.id);
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        const query = interaction.options.getString('query');

        await interaction.deferReply();

        try {
            const searchResult = await player.search(query, { requestedBy: interaction.user });
            queue.insertTrack(searchResult.tracks[0], 0);

            const message = new EmbedBuilder()
                .addFields(
                    { name: `${searchResult.tracks[0].title} will play next` }
                );

            return interaction.followUp({ embeds: [message] });
        } catch (e) {
            console.log(e);
            return interaction.followUp(`Something went wrong: ${e}`);
        }
    }
}