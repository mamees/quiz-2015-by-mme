var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId =' + quizId));
			}
		}).catch(function(error){ next(error);});
}

//GET /quizes
exports.index = function(req, res) {
	var search = req.query.search;

	if (search) {
		search = '%'+search.replace(/s/g, "%")+'%';
	} else {
		// En caso que no se introduzcan datos
		search = '%';
	}
	models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes});
	}).catch(function(error){ next(error);});

};

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');
	}); // Redireccion HTTP (URL relativo) lista de preguntas
};

//GET /quizes/question
exports.show = function(req, res) {	
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
	  if (req.query.respuesta === req.quiz.respuesta) {
	    resultado = 'Correcto';
	  }
	  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
	})
};

//GET /author
exports.author = function(req, res) {
	res.render('author',{author: {name: 'Manuel Merino Escribano', pathImgAuthor: 'author-photo.jpg'}})
};