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
        await player.extractors.loadDefault();
        const queue = useQueue(interaction.guild.id);
        const channel = interaction.member.voice.channel;

        if (!channel) return interaction.reply('You are not connected to a voice channel!');

        const query = interaction.options.getString('query');

        await interaction.deferReply();

        const searchResult = await player.search(query, { requestedBy: interaction.user });

        if (!searchResult.hasTracks()) {
            await interaction.editReply(`We found no tracks for ${query}!`);
            return;
        } else {
            try {
                let fieldName = "";
                let fieldValue = "";

                if (!queue) {
                    const { track } = await player.play(channel, searchResult, {
                        nodeOptions: {
                            metadata: {
                                channel: interaction.channel,
                                client: interaction.guild.members.me,
                                requestedBy: interaction.user,
                            },
                            skipOnNoStream: true
                        }
                    });

                    const message = new EmbedBuilder()
                        .addFields(
                            { name: "Adding your track", value: track.title }
                        );

                    fieldName = "Adding your track";
                    fieldValue = track.title;
                } else {
                    queue.insertTrack(searchResult.tracks[0], 0);

                    fieldName = "Adding your track to top of queue"
                    fieldValue = searchResult.tracks[0].title
                }

                const message = new EmbedBuilder()
                    .addFields(
                        { name: fieldName, value: fieldValue }
                    );

                return interaction.followUp({ embeds: [message] });

            } catch (e) {
                // let's return error if something failed
                console.log(e);
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
    }
}