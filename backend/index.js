require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model")

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin:"*",
    })
)

app.get("/", (req,res) =>{
    res.json({data: "hello"})
})

app.post("/create-account", async (req,res) => {
    const {fullName, email, password} = req.body;

    if(!fullName){
        return res.status(400).json({error:true, message:"Imię i nazwisko jest wymagane"})
    }

    if(!email){
        return res.status(400).json({error:true, message:"Email jest wymagany"})
    }

    if(!password){
        return res.status(400).json({error:true, message:"Hasło jest wymagane"})
    }

    const user = new User({
        fullName,
        email,
        password,
    });
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m"
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Rejestracja udana",
    });
});

app.post("/login", async (req,res) => {
    const {email, password} = req.body;

    if(!email){
        return res.status(400).json({error:true, message:"Email jest wymagany"})
    }

    if(!password){
        return res.status(400).json({error:true, message:"Hasło jest wymagane"})
    }

    const userInfo = await User.findOne({email:email})

    if(!userInfo){
        return res.status(400).json({error:true, message:"Nie znaleziono użytkownika"})
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        })

        return res.json({
            error:false,
            message: "Zalogowano pomyślnie",
            email,
            accessToken,
        })
    }
    else{
        return res.status(400).json({
            error:true,
            message:"Nieprawidłowe dane logowania"
        })
    }
})

app.get("/get-user", authenticateToken, async (req,res) => {
    const {user} = req.user
    const isUser = await User.findOne({_id:user._id})

    if(!user){
        return res.sendStatus(401)
    }

    return res.json({
        user: {fullName:isUser.fullName, email:isUser.email, "_id":isUser._id, createdOn:isUser.createdOn},
        message: "",
    })
})

app.post("/add-note", authenticateToken, async (req,res) => {
    const {title, content, tags} = req.body;
    const {user} = req.user;

    if(!title){
        return res.status(400).json({error:true, message:"Tytuł jest wymagany"})
    }

    if(!content){
        return res.status(400).json({error:true, message:"Treść jest wymagana"})
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        })

        await note.save()

        return res.json({
            error: false,
            note,
            message: "Notatka dodana pomyślnie"
        })
    }
    catch(error){
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        })
    }
})

app.put("/edit-note/:noteId", authenticateToken, async (req,res) => {
    const noteId = req.params.noteId
    const {title, content, tags} = req.body

    if(!title && !content && !tags){
        return res.status(400).json({error:true, message:"Nie wprowadzono zmian"})
    }

    try{
        const note = await Note.findOne({_id:noteId})

        if(!note){
            return res.status(400).json({error:true, message:"Nie znaleziono wpisu"})
        }

        if(title) note.title = title
        if(content) note.content = content
        if(tags) note.tags = tags

        await note.save()

        return res.json({
            error: false,
            note,
            message: "Zaktualizowano pomyślnie"
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message: "Internal Error",
        })
    }
})

app.get("/get-all-notes/", authenticateToken, async (req,res) => {
    

    try{
        const notes = await Note.find()

        return res.json({
            error:false,
            notes,
            message: "Pobrano notatki pomyslnie"
        })
    }
    catch (error){
        return res.status(500).json({
            error:true,
            message:"Internal Error",
        })
    }
})

app.delete("/delete-note/:noteId", authenticateToken, async (req,res) => {
    const noteId = req.params.noteId;

    try{
        const note = await Note.findOne({_id:noteId})

        if(!note){
            return res.status(400).json({error:true, message:"Nie znaleziono wpisu"})
        }

        await Note.deleteOne({_id:noteId})

        return res.json({
            error: false,
            message: "Usunięto pomyślnie",
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message: "Internal Error",
        })
    }
})

app.get("/search-notes/", authenticateToken, async (req,res) => {
    
    const {query} = req.query

    if(!query){
        return res.status(400).json({
            error:true, 
            message:"Wyszukiwanie jest wymagane"
        })
    }

    try{
        const matchingNotes = await Note.find({
            $or:[
                {title:{$regex: RegExp(query,"i")}},
                {context:{$regex: new RegExp(query,"i")}},
            ]
        })

        return res.json({
            error:false,
            notes:matchingNotes,
            message:"Pomyślnie wyciągnięto dane"
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Error"
        })
    }
})

app.listen(8000);

module.exports=app;