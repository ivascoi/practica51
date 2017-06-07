var express = require('express');
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: './uploads/' });

var quizController = require('../controllers/quiz_controller');
var tipController = require('../controllers/tip_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var favouriteController = require('../controllers/favourite_controller');

//-----------------------------------------------------------

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------


//-----------------------------------------------------------

// History

function redirectBack(req, res, next) {

    var url = req.session.backURL || "/";
    delete req.session.backURL;
    res.redirect(url);
}

router.get('/goback', redirectBack);

// Rutas GET que no acaban en /new, /edit, /play, /check, /session, o /:id.
router.get(/(?!\/new$|\/edit$|\/play$|\/check$|\/session$|\/(\d+)$)\/[^\/]*$/, function (req, res, next) {

    req.session.backURL = req.url;
    next();
});

//-----------------------------------------------------------

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

// Pagina de creditos
router.get('/author', function (req, res, next) {
    res.render('author');
});


// Pagina de ayuda
router.get('/help', function (req, res, next) {
    res.render('help');
});


// Autoload de rutas que usen :quizId
router.param('quizId', quizController.load);
router.param('userId', userController.load);
router.param('tipId',  tipController.load);


// Definición de rutas de sesion
router.get('/session', sessionController.new);     // formulario login
router.post('/session', sessionController.create);  // crear sesión
router.delete('/session', sessionController.destroy); // destruir sesión


// Definición de rutas de cuenta
router.get('/users',
    sessionController.loginRequired,
    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',
    sessionController.loginRequired,
    userController.show);    // ver un usuario
router.get('/users/new',
    userController.new);     // formulario sign un
router.post('/users',
    userController.create);  // registrar usuario
router.get('/users/:userId(\\d+)/edit',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',
    sessionController.loginRequired,
    sessionController.adminOrMyselfRequired,
    userController.destroy);  // borrar cuenta

router.get('/users/:userId(\\d+)/quizzes', quizController.index);     // ver las preguntas de un usuario



// Definición de rutas de /quizzes
router.get('/quizzes',                     quizController.index);
router.get('/quizzes/:quizId(\\d+)',       quizController.show);
router.get('/quizzes/new',                 quizController.new);
router.post('/quizzes',                    quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',  quizController.edit);
router.put('/quizzes/:quizId(\\d+)',       quizController.update);
router.delete('/quizzes/:quizId(\\d+)',    quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',  quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

//----LO MIO----

//Definicion de rutas de /randomplay
router.get('/quizzes/randomplay',  quizController.randomplay);
router.get('/quizzes/randomcheck/:quizId(\\d+)', quizController.randomcheck);




module.exports = router;
