//Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");


//Sets up the Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Routes

// HTML routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});


//API routes

app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })

});

//new notes

app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = req.body;
        newNotes.id = uuid.v4();
        notes.push(newNotes);


        const createNotes = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNotes, function (err, data) {
            if (err) throw err;
        });
        res.json(newNotes);
        console.log("Adding notes!");

    })

});


//Delete notes

app.delete("/api/notes/:id", function (req, res) {
    const noteId = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== noteId
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), function (err, data) {
            console.log("Delete notes!")
            if (err) throw err;
            res.json(notesArray)

        });
    });

});



//Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});