var models = require('../models/models.js');
var q1 = 0, q2 = 0, q3 = 0, q4 = 0, q5 = 0;
exports.show = function (req, res,next) {
    models.Quiz.count().then(function (count) {
        q1 = count;
    }
    ).catch(function (error) { next(error) });
    models.Comment.count().then(function (count) {
        q2 = count; 
    }
    ).catch(function (error) { next(error) });
    
    models.Comment.count( { group : '"QuizId"'}).then(function (comments) {
        q5 = comments.length;
        q4 = q1 - q5;
        q3 = (q2 / q1).toFixed(2);
        res.render('stats/show.ejs', { sol1: q1, sol2: q2, sol3: q3, sol4: q4, sol5: q5, errors: [] });
    }
    ).catch(function (error) { next(error) });
};