var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: {id: Number(quizId) },
			include: [{model: models.Comment}]
		}).then(
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
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	}).catch(function(error){ next(error);});

};

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes');
				}); // Redireccion HTTP (URL relativo) lista de preguntas
			}
		}
	
	);
};

//PUT /quizes/:id
exports.update	 = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
					res.redirect('/quizes');
				}); // Redireccion HTTP (URL relativo) lista de preguntas
			}
		}
	
	);
};

//GET /quizes/:id/edit
exports.edit = function(req, res) {	
	var quiz = req.quiz; // autoload de instancia quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){ next(error);});
};

//GET /quizes/:id
exports.show = function(req, res) {	
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
	  if (req.query.respuesta.trim().toUpperCase() === req.quiz.respuesta.trim().toUpperCase()) {
	    resultado = 'Correcto';
	  }
	  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
	})
};



//GET /author
exports.author = function(req, res) {
	res.render('author',{author: {name: 'Manuel Merino Escribano', pathImgAuthor: 'author-photo.jpg'}, errors: []})
};