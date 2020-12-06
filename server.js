var express = require("express");

const fs = require('fs');


var app = express();
var PORT = process.env.PORT || 8080;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//include html file in the server the app that we are passing in a specific function


var noteList = require('./db/db.json');

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) =>{
        if(err) throw err;
        return res.json(JSON.parse(data))
    })
})

app.post("/api/notes", (req, res) => {
    req.body["id"] = Math.floor(Math.random() * 111111111111)
    var newNote = req.body;
    noteList.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(noteList), err => {
        if (err) throw err;
        return res.json(newNote)
    })
})

app.delete("/api/notes/:id", (req, res) => {
    let toBeDeleted = req.params.id;
    for(i=0; i<noteList.length; i++){
        if(toBeDeleted == noteList[i].id){
            noteList.splice(i, 1);

            fs.writeFile("./db/db.json", JSON.stringify(noteList), err => {
                if (err) throw err;
                return;
            })
        }
    }
    res.end();
})
require('./routing/html-routes.js')(app);


app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
