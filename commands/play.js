const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMasterPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song!')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Query name or link to the song.')
                .setRequired(true)),

    async execute(interaction) {
        const player = useMasterPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply('You are not connected to a voice channel!'); // make sure we have a voice channel
        const query = interaction.options.getString('query'); // we need input/query to play

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        const searchResult = await player.search(query, { requestedBy: interaction.user });

        if (!searchResult.hasTracks()) {
            await interaction.editReply(`We found no tracks for ${query}!`);
            return;
        } else {
            try {
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

                return interaction.followUp({ embeds: [message] });
            } catch (e) {
                // let's return error if something failed
                console.log(e);
                return interaction.followUp(`Something went wrong: ${e}`);
            }
        }
    },
};