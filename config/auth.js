const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('./../models/user');

passport.use(new LocalStrategy(
    (username,password,done) => {
        //done es un callback
        //- err
        //- user
        //- info

        if (!username || username === '' || !password || password === '') {
            //false means user login failed
            return done(null,false,{ message: 'Invalid username or password' });
        }

        try {
            (async () => {
                let user = await User.findOne({
                    where: {
                        username: username
                    }
                });

                //Check if user doesn't exist
                if (user === null) {
                    return done(null,false,{ message: 'Invalid username or password' });
                }

                //User exists, check password

                //generateHash
                //checkPassword
                if (user.checkPassword(password)) {
                    return done(null,user);
                } else {
                    return done(null,false,{ message: 'Invalid username or password' });
                }

            })();
        } catch (err) {
            return done(err,false,{ message: 'An unexpected error ocurred.' });
        }

        //Consultar en base de datos
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function (id,done) {
    try {
        (async () => {
            let user = await User.findByPk(id);
            done(null, user);
        })();
    } catch (err) {
        done(err);
    }
});



// passport.serializeUser(function (user,done) {
//     console.log('user @serialize', user);
//     done(null,user.id);
// });

// passport.deserializeUser(function (id,done) {
//     console.log('done', done);

//     User.findByPk(id).then((user) => {
//         console.log('user @deserialize', user);
//         done(null, user);
//     }).catch((err) => {
//         if (done !== null && typeof(done) === 'function') {

//             done(err);
//         }
//     });
// });