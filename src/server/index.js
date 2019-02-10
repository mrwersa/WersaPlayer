var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var fileSystem = require('fs');
var path = require('path');

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('download', (videoId) => {
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": "/usr/local/Cellar/ffmpeg/4.1_6/bin/ffmpeg",
            "outputPath": __dirname + path.sep + "downloads",
            "youtubeVideoQuality": "highest",
            "queueParallelism": 2,
            "progressTimeout": 2000
        });

        YD.download(videoId, videoId + ".mp3");

        YD.on("finished", function(err, data) {
            socket.emit('download-finished', { id: videoId, data: data });
        });

        YD.on("error", function(error) {
            socket.emit('download-error', { id: videoId, data: error });
        });

        YD.on("progress", function(progress) {
            socket.emit('download-progress', { id: videoId, data: progress });
        });
    });
});

app.get('/downloads/:id', (req, res) => {
    var filePath = path.join(__dirname, "downloads" + path.sep + req.params.id + ".mp3");
    var stat = fileSystem.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(response);
});


server.listen(5000, () => {
    console.log('started on port 5000');
});