var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var fs = require("fs");
var youtube = require("youtube-dl");
var dotenv = require("dotenv");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
dotenv.config();
var cwd = __dirname;



app.get("/", function(req, res) {
    res.render("home");
});

app.post("/search", function(req, res) {
    var query = req.body.query;
    res.redirect("/search/" + query);
});

app.get("/search/:query", function(req, res) {
    var query = req.params.query;
    var finalQuery = "";
    var i = 0;
    for (i = 0; i < query.length; i++) {
        if (query[i] !== " ") {
            finalQuery += query[i];
        }
        else {
            finalQuery += "+";
        }
    }

    request("https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + finalQuery + "&key=" + process.env.APICREDENTIAL,
    function(error, response, body) {
    	if (error) {
    		console.log(error);
    	}
        var data = JSON.parse(body);
        console.log(data);
        res.render("index", {data: data});
    }
);
});

app.get("/download/:videoUrl", function(req, res) {
    var video = youtube("http://www.youtube.com/watch?v=" + req.params.videoUrl, 
    ["--format=18"],
    {cwd: cwd});
    // console.log(video);
    var size, filename;
    video.on("info", function(info) {
        console.log("Download Started");
        if (info.track === null) {
            track = String(info.title + ".mp4");
        }
        else {
            track = String(info.track + ".mp4");
        }
        // console.log(track);
        size = info.size
        filename = info._filename
        res.writeHead(200, {
            "Content-Disposition": "attachment;filename=" + filename,
            'Content-Type': 'video/mp4',
            'Content-Length': size
        });
    });;

    video.on('data',(data)=>{
        res.write(data)
    })

    video.on('end',(end)=>{
        console.log('Download end')

        res.end();
    })
});

app.get("/started", function(req, res) {
    res.render("started");
});

app.get("/test", function(req, res) {
    res.send("The server is up!") ; 
});

var port = 8082;
app.listen(port, function(req, res) {
    console.log("The Server is up!\nGo to your favourite Web Browser and visit localhost:" + String(port) + " to see the Application");
});

module.exports = app; // For the testing of the application