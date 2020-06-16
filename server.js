//Dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

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
        res.json(JSON.parse(data));
    })

});

//new notes

app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNotes = req.body;
        const newNotesId = notes.length + 1;
        const notesData = {
            id: newNotesId,
            title: newNotes.title,
            text: newNotes.text
        }
        notes.push(notesData);
        console.log(notesData);

        const createNotes = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNotes, function (err, data) {
            if (err) throw err;
        })


    })

})







//Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});