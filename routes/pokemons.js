var router = require('express').Router();

var Pokemon = require('./../models/Pokemon');
var Photos = require('./../models/Photos');
var Country = require('./../models/Country');
var Admin = require('./../models/Admin');
var Type = require('./../models/Type');
var nodemailer = require('./../node_modules/nodemailer');



var smtpTransport = nodemailer.createTransport("SMTP", {

    service: 'Gmail',
    host: "smtp.gmail.com",
    auth: {
        // enter your gmail account
        user: 'dododream7780@gmail.com',
        // enter your gmail password
        pass: 'r6tvy654'
    }
});

router.get('/send', function (req, res) {

    var mailOptions = {
        to: "dododream7780@gmail.com",
        subject: 'Contact Form Message',
        from: "Contact Form Request" + "<" + req.query.from + '>',
        html:  "From: " + req.query.name + "<br>" +
               "User's email: " + req.query.user + "<br>" +     "Message: " + req.query.text
    }

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (err, response) {
        if (err) {
            console.log(err);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });

});

router.get('/', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Pokemon.find({}).populate('types').then(pokemons => {
            if (req.session.passport) {
                res.render('pokemons/index.html', { admins: admins, pokemons: pokemons, user: req.session.passport.user });
            } else {
               res.render('pokemons/index.html', { admins: admins, pokemons: pokemons});
            }
        });
    });
});

router.get('/new', (req, res) => {
    Type.find({}).then(types => {
        var pokemon = new Pokemon();
        if (req.session.passport) {
            res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/', user: req.session.passport.user });
        } else {
           res.render('pokemons/index.html', { admins: admins, pokemons: pokemons});
        }
    })
});


router.get('/admin', (req, res) => {
    Type.find({}).then(types => {
        var admin = new Admin();
        Pokemon.find({}).populate('types').then(pokemons => {
            if (req.session.passport) {
                res.render('pokemons/admin.html', {admin: admin, endpoint: '/admin', pokemons: pokemons, user: req.session.passport.user });
            } else {
               res.render('pokemons/index.html', { admins: admins, pokemons: pokemons});
            }
        });
    })
});

router.get('/travel', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Country.find({}).then(country => {
            if (req.session.passport) {
                res.render('pokemons/travel.html', { admins: admins, country: country, user: req.session.passport.user });
            } else {
               res.render('pokemons/travel.html', { admins: admins, country: country});
            }
        });
    });
});

router.get('/map', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Pokemon.find({}).then(pokemons => {
            var query = Pokemon.where({ pays: req.query.country });
            query.findOne(function (err, Pokemon) {
                if (!Pokemon) {
                    if (req.session.passport) {
                        res.render('pokemons/one_day.html', { admins: admins, user: req.session.passport.user });
                    } else {
                        res.render('pokemons/one_day.html', { admins: admins});
                    }              
                }
                else {
                    if (req.session.passport) {
                        res.render('pokemons/map.html', { admins: admins, pokemons: pokemons, user: req.session.passport.user, country: req.query.country });
                    } else {
                        res.render('pokemons/map.html', { admins: admins, pokemons: pokemons, country: req.query.country});
                    }
                }
            });
        });
    });
});

router.get('/presentation', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        if (req.session.passport) {
            res.render('pokemons/presentation.html', { user: req.session.passport.user });
        } else {
           res.render('pokemons/presentation.html', { admins: admins});
        }
    });
});

router.get('/contact', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        if (req.session.passport) {
            res.render('pokemons/contact.html', { user: req.session.passport.user });
        } else {
           res.render('pokemons/contact.html', { admins: admins});
        }
    });
});

router.get('/photos', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Photos.find({}).then(photos => {
            if (req.session.passport) {
                res.render('pokemons/photos.html', { photos: photos, user: req.session.passport.user });
            } else {
               res.render('pokemons/photos.html', { photos: photos, admins: admins});
            }
        });
    });
});

router.get('/edit/:id', (req, res) => {
            Pokemon.findById(req.params.id).then(pokemon => {
                if (req.session.passport) {
                    res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/' + pokemon._id.toString(), user: req.session.passport.user });
                } else {
                   res.render('pokemons/index.html', { admins: admins, pokemon: pokemon});
                }
            });
});

router.get('/delete/:id', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Pokemon.findOneAndRemove({ _id: req.params.id }).then(() => {
            if (req.session.passport) {
                res.redirect('/', { user: req.session.passport.user });
            } else {
               res.render('/', { admins: admins, pokemons: pokemons});
            }
        });
    });
});

router.get('/:id', (req, res) => {
    Admin.find({}).limit(1).then(admins => {
        Pokemon.findById(req.params.id).populate('types').then(pokemon => {
            if (req.session.passport) {
                res.render('pokemons/show.html', { pokemon: pokemon , user: req.session.passport.user });
            } else {
               res.render('pokemons/show.html', { admins: admins, pokemons: pokemons});
            }
        },
        err => res.status(500).send(err));
    });
});

router.post('/photos', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(new Photos())
    }).then(photos => {
        photos.name = req.body.name;
        photos.description = req.body.description;
        /*admin.number = req.body.number;
        admin.types = req.body.types;*/

        if(req.file) photos.picture = req.file.filename;

        return photos.save();
    }).then(() => {
        res.redirect('/');
    }, err => console.log(err));
});

router.post('/country', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(new Country())
    }).then(country => {
        country.name = req.body.name;
        country.latitude = req.body.latitude;
        country.longitude = req.body.longitude;

        return country.save();
    }).then(() => {
        res.redirect('/');
    }, err => console.log(err));
});

router.post('/admin', (req, res) => {
    new Promise((resolve, reject) => {
        resolve(new Admin())
    }).then(admin => {
        console.log(req)
        /*admin.name = req.body.name;
        admin.description = req.body.description;
        admin.number = req.body.number;
        admin.types = req.body.types;*/

        if(req.files) admin.picture = req.files[0].filename;

        return admin.save();
    }).then(() => {
        res.redirect('/');
    }, err => console.log(err));
});

router.post('/:id?', (req, res) => {

    new Promise((resolve, reject) => {
        if(req.params.id) {
            Pokemon.findById(req.params.id).then(resolve, reject);
        }
        else {
            resolve(new Pokemon())
        }
    }).then(pokemon => {
        pokemon.pays = req.body.pays;
        pokemon.name = req.body.name;
        pokemon.description = req.body.description;
        pokemon.number = req.body.number;
        pokemon.types = req.body.types;
        pokemon.latitude = req.body.latitude;
        pokemon.longitude = req.body.longitude;
        console.log(req.files[0]);
        if(req.files) {
            pokemon.picture = req.files[0].filename;
            pokemon.picture2 = req.files[1].filename;
            pokemon.picture3 = req.files[2].filename;
        }

        return pokemon.save();
    }).then(() => {
        res.redirect('/admin');
    }, err => console.log(err));
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        res.locals.login = req.isAuthenticated();
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;