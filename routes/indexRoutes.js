const express = require('express'),
    router = express.Router(),
    Personel = require("../models/personelModel"),
    Duyuru = require("../models/duyuruModel");


//--------------------HOME--------------------
router.get("/", (req, res) => {
    Duyuru.find().sort({ date: -1 })
        .then((result) => {
            res.render("index", { duyuru: result })
        }).catch((err) => {
            console.log(err)
        });
});

//--------------------REHBER--------------------

router.get("/rehber", (req, res) => {

    const name = req.query.name

    Personel.find({ name: { $regex: new RegExp("^" + name + ".*", "i") } }).sort({ name: 1 })
        .then((result) => {
            res.render("rehber", { personel: result })
        }).catch((err) => {
            console.log(err)
        });
});

//--------------------PERSONEL EKLE--------------------
router.get("/personelEkle", isLoggedIn, (req, res) => {
    res.render("personelEkle");
});
router.post("/personelEkle", (req, res) => {

    console.log(req.body)
    const newPersonel = new Personel(req.body);
    console.log(newPersonel)

    newPersonel.save()
        .then((result) => {
            console.log(result)
            res.render("personelEkle")
        }).catch((err) => {
            console.log(err);
        });
});

//--------------------PERSONEL LİSTELE--------------------
router.get("/personel_yonetim", isLoggedIn, (req, res) => {
    res.render("allpersonels")
    const name = req.query.name;

    Personel.find({ name: { $regex: new RegExp("^" + name + ".*", "i") } }).sort({ name: 1 })
        .then((result) => {
            res.render("personel_yonetim", { personel: result })
        }).catch((err) => {
            console.log(err)
        });
})
//--------------------PERSONEL--------------------
router.get("/personel/:id", isLoggedIn, (req, res) => {
    const id = req.params.id;
    Personel.findById(id)
        .then((result) => {
            res.render('personel', { personel: result })
        }).catch((err) => {
            console.log(err);
        });
});
router.post("/personel/:id", (req, res) => {
    const id = req.params.id;
    console.log(id)
    Personel.deleteOne({ _id: id })
        .then(() => {
            res.redirect('/allPersonels')
        }).catch((err) => {
            console.log(err);
        });
});

//--------------------DUYURU EKLE--------------------

router.get("/duyuruEkle", isLoggedIn, (req, res) => {
    res.render("duyuruEkle")
})

router.post("/duyuruEkle", (req, res) => {

    console.log(req.body)
    const newDuyuru = new Duyuru(req.body);
    newDuyuru.save()
        .then((result) => {
            console.log(result)
            res.redirect("/duyuruEkle")
        }).catch((err) => {
            console.log(err);
        });
})
//--------------------TÜM DUYURULAR--------------------

router.get("/allDuyuru", (req, res) => {
    Duyuru.find().sort({ date: -1 })
        .then((result) => {
            res.render("allDuyuru", { duyuru: result })
        }).catch((err) => {
            console.log(err)
        });

})
//--------------------DUYURU--------------------
router.get("/duyuru/:id", isLoggedIn, (req, res) => {
    const id = req.params.id;
    Duyuru.findById(id)
        .then((result) => {
            res.render('duyuru', { duyuru: result })
        }).catch((err) => {
            console.log(err);
        });
});
router.post("/duyuru/:id", (req, res) => {
    const id = req.params.id;
    console.log(id)
    Duyuru.deleteOne({ _id: id })
        .then(() => {
            res.redirect('/allDuyuru')
        }).catch((err) => {
            console.log(err);
        });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

module.exports = router;