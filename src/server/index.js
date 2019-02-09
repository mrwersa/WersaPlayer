var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var YoutubeMp3Downloader = require("youtube-mp3-downloader");

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('download', (videoId) => {
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "C:\\Users\\mrwersa\\Code\\ffmpeg\\bin\\ffmpeg.exe",
            "outputPath": __dirname + "\\downloads",
            "youtubeVideoQuality": "highest",
            "queueParallelism": 2,
            "progressTimeout": 2000
        });

        YD.download(videoId);

        YD.on("finished", function(err, data) {
            io.emit('download-finished', { id: videoId, data: data });
        });

        YD.on("error", function(error) {
            io.emit('download-error', { id: videoId, data: error });
        });

        YD.on("progress", function(progress) {
            io.emit('download-progress', { id: videoId, data: progress });
        });
    });
});

app.get('/dowsnloads', (req, res) => {

});


server.listen(5000, () => {
    console.log('started on port 5000');
});