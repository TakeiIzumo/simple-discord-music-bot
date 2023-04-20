const { useMasterPlayer } = require("discord-player");
const { EmbedBuilder } = require("discord.js");
const player = useMasterPlayer();

player.events.on('error', (queue, error) => {
    // Emitted when the player queue encounters error
    console.log(`General player error event: ${error.message}`);
    console.log(error);
});

player.events.on('playerError', (queue, error) => {
    // Emitted when the audio player errors while streaming audio track
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});

player.events.on('playerStart', (queue, track) => {
    // Emitted when the player starts to play a song

    const message = new EmbedBuilder()
        .setTitle(track.title)
        .setURL(track.url)
        .setAuthor({ name: track.author, url: track.url })
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: `Requested by`, value: track.requestedBy.username },
            { name: `Duration`, value: track.duration }
        )
        .setTimestamp()

    queue.metadata.channel.send({ embeds: [message] });
});

player.events.on('audioTrackAdd', (queue, track) => {
    // Emitted when the player adds a single song to its queue

    const message = new EmbedBuilder()
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: `New track added!`, value: `${track.title}` },
            { name: `Requested by`, value: track.requestedBy.username }
        )

    queue.metadata.channel.send({ embeds: [message] });
});

player.events.on('audioTracksAdd', (queue, track) => {
    // Emitted when the player adds multiple songs to its queue

    const message = new EmbedBuilder()
        .addFields(
            { name: `Multiple track added!`}
        )
        
    queue.metadata.channel.send(`Multiple Track's queued`);
});

player.events.on('playerSkip', (queue, track) => {
    // Emitted when the audio player fails to load the stream for a song
    queue.metadata.channel.send(`Skipping **${track.title}** due to an issue!`);
});

player.events.on('disconnect', (queue) => {
    // Emitted when the bot leaves the voice channel
    queue.metadata.channel.send('Looks like my job here is done, leaving now!');
});
player.events.on('emptyChannel', (queue) => {
    // Emitted when the voice channel has been empty for the set threshold
    // Bot will automatically leave the voice channel with this event
    queue.metadata.channel.send(`Leaving because no vc activity for the past 5 minutes`);
});
player.events.on('emptyQueue', (queue) => {
    // Emitted when the player queue has finished
    queue.metadata.channel.send('Queue finished!');
});