var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var fileSystem = require('fs');
var path = require('path');
var downloading = [];

io.on('connection', (socket) => {
    console.log('connected');

    socket.on('download', (videoId) => {
        var YD = new YoutubeMp3Downloader({
            "ffmpegPath": process.env.FFMPEG_PATH,
            "outputPath": __dirname + path.sep,
            "youtubeVideoQuality": "highest",
            "queueParallelism": 2,
            "progressTimeout": 2000
        });

        YD.download(videoId, videoId + ".mp3");
        downloading.push(videoId);

        YD.on("finished", function(err, data) {
            var index = downloading.indexOf(videoId);
            if (index > -1) {
                downloading.splice(index, 1);
            }
            socket.emit('download-finished', { id: videoId, data: data });
        });

        YD.on("error", function(error) {
            var index = downloading.indexOf(videoId);
            if (index > -1) {
                downloading.splice(index, 1);
            }
            socket.emit('download-error', { id: videoId, data: error });
        });

        YD.on("progress", function(progress) {
            socket.emit('download-progress', { id: videoId, data: progress });
        });
    });

    socket.on('download-status', (videoId) => {
        var status = 'downloaded';
        if (downloading.indexOf(videoId) > -1) {
            status = 'downloading';
        }

        socket.emit('download-status', { id: videoId, status: status });
    });
});

app.get('/downloads/:id', (req, res) => {
    var filePath = path.join(__dirname, path.sep + req.params.id + ".mp3");
    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    var readStream = fileSystem.createReadStream(filePath);
    readStream.pipe(res);
});


var port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log('started on port ' + port);
});