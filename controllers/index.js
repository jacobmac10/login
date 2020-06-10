const passport = require('passport');
const { User } = require('./../models/user');
const { Image } = require('./../models/image');
const multer = require('multer');
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

let controller = {};

controller.index = (req, res, next) => {
    res.render('index',{ title: 'Login test' });
};

controller.home = function (req,res,next) {
    res.render('home', {
        user: req.user
    });
};

controller.checkLogin = (req, res, next) => {
    //Revisar si la sesión de usuario existe
    let isLoggedIn = req.user;

    //Si existe, continúa al siguiente middleware
    if (isLoggedIn) {
        return next();
    }

    //Si no existe, enviar al usuario a la página principal
    return res.redirect('/login');
};

controller.login = (req,res,next) => {
    return res.render('login');
};

controller.loginPost = (req, res, next) => {
    passport.authenticate('local',(err,user,info) => {
        console.log('user', JSON.stringify(user));
        //{message: 'Invalid username or password'} => info
    
        //Si hubo un error, o si no hay un usuario para el username+password introducidos
        if (err || !user) {
            
            return res.render('login', {
                errorMessage: info.message || 'Error trying to login. Please try again'
            });
        }

        req.login(user,function (err) {
            if (err) { return next(err); }
            return res.redirect('/home');
        });
    
        // return res.redirect('/home');
    })(req, res, next);
};

controller.register = (req,res,next) => {
    return res.render('register');
};

controller.registerPost = (req,res,next) => {
    //Extraer valores del formulario
    let username = req.body.username;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    //Verificar que los campos no vengan vacíos
    if (!username || username === '' || !password || password === '') {
        //Incomplete values
        res.render('register',{
            errorMessage: 'Please type a username and a password',
            username,
            password,
            confirmPassword,
        });
    }

    //Verificar que el password y su confirmación coincidan
    if (password !== confirmPassword) {
        //Passwords do not match!
        res.render('register',{
            errorMessage: 'Passwords must match',
            username,
            password,
            confirmPassword,
        });
    }

    //Crear objeto con estructura de modelo
    let userToCreate = {
        username: username,
        password: User.generateHash(password)
    };

    //Habilitar palabra "await"
    try {
        (async () => {
            let user = await User.create(userToCreate);

            req.login(user,function (err) {
                if (err) { return next(err); }
                return res.redirect('/home');
            });

            // return res.render('login',{ successMessage: 'User created successfully. Please login to continue.' });
        })();
    } catch (err) {
        console.error('Error al intentar crear User',err);
        res.render('register',{
            errorMessage: 'An unexpected error occurred',
            username,
            password,
            confirmPassword,
        });
    }
};

controller.logout = (req, res, next) => {
    req.logout();
    res.redirect('/');
};

controller.profile = (req, res, next) => {
    return res.render('profile', {
        user: req.user
    });
};

controller.profileUpdate = (req, res, next) => {
    let username = req.body.username;
    
    //Leer información de archivo cargado
    //req.file
    let mimetype = req.file.mimetype;
    let buffer = req.file.buffer;

    //TODO: validate username

    (async () => {

        //Crear un Image
        let image = Image.build({
            data: buffer,
            mimetype: mimetype,
        });

        //Guardar Image en la base de datos
        await image.save();

        //Asignar image creada al User
        req.user.setImage(image);

        //Actualizar username
        req.user.username = username;

        //Actualizar user en la base de datos
        await req.user.save();

        return res.redirect('/home');
    })();
};

controller.uploadProfilePicture = upload.single('profilePicture');

controller.image = (req, res, next) => {
    let id = req.params.id;

    (async () => {
        let image = await Image.findByPk(id);

        //Indicar que el contenido es una imagen (mimetype)
        res.set('Content-Type', image.mimetype);
        //Enviar imagen
        res.end(image.data, 'binary');
    })();
};

module.exports = controller;