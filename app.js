const express = require('express');
const app = express()
const passport = require("passport");
const localStrategy = require("passport-local");
const expressSession = require("express-session");
const User = require("./models/userModel");
const mongoose = require("mongoose");
const nodemon = require("nodemon");
const indexRoutes = require("./routes/indexRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const PORT = process.env.PORT;

const dbURL = 'mongodb+srv://duhanbayrak:348415Duhan@duhandb.pylk5.mongodb.net/medikarPersonel?retryWrites=true&w=majority';

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true, useCreateIndex: true })
    .then((result) => {
        console.log("Bağlantı Kuruldu");
    }).catch((err) => {
        console.log("hata")
        console.log(err);
    });
    
const conn = mongoose.connection;

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: dbURL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = req.body.dosyaAd + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo)
            });
        });
    }
});
const upload = multer({ storage })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(require("express-session")({
    secret: "güvenlik cümlesi",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride("_method"));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

//************************************ DOKÜMANLAR ************************************//

app.get("/dokumanEkle", (req, res) => {
    res.render("dokumanEkle")
})

app.post("/upload", upload.single('document'), (req, res) => {
   
    res.redirect("/dokumanEkle");
});

app.get("/dokuman", (req, res) => {
    gfs.files.find().sort({uploadDate:-1}).toArray((err, files) => {
        if (!files || files.length === 0) {
            res.render("dokuman",{files: false});
        }else{
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                    file.isImage = true;
                }else{
                    file.isImage = false;
                }
            });
            res.render('dokuman',{files:files});
        }
        
    });
});
app.get("/dokuman/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "Dosya Bulunamadı!"
            });
        }
        if (file.contentType === 'application/pdf') {
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        }
        if (file.contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        }
    });
});

app.get("/image/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "Dosya Bulunamadı!"
            });
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readStream = gfs.createReadStream(file.filename);
            readStream.pipe(res);
        }
        else{
            res.status(404).json({
                err: "Resim Bulunamadı"
            })
        }
    });
});

app.delete("/files/:id", (req, res) => {
    gfs.remove({ _id: req.params.id, root:'uploads'}, (err, gridStore) => {
        if (err) {
            return res.status(404).json({
                err: err
            });
        }
       res.redirect("/dokuman")
    });
});


app.use(indexRoutes);
app.use(adminRoutes);



app.listen(PORT, () => console.log(`Example app listening on port port!`));


