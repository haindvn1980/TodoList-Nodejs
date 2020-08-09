var utils = require('../utils');
var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');


// ** express turns the cookie key to lowercase **
module.exports.current_user = function (req, res, next) {
  var user_id = req.cookies ? req.cookies.user_id : undefined;

  if (!user_id) {
    res.cookie('user_id', utils.uid(32));
  }
  next();
};

module.exports.index = function (req, res, next) {
  var user_id = req.cookies ? req.cookies.user_id : undefined;
  Todo.
    find({ user_id: user_id }).
    sort('-updated_at').
    exec(function (err, todos) {
      if (err) return next(err);
      res.render('index', {
        title: 'Express Todo Example',
        todos: todos
      });
    });
};

module.exports.create = function (req, res, next) {
  new Todo({
    user_id: req.cookies.user_id,
    content: req.body.content,
    updated_at: Date.now()
  }).save(function (err, todo, count) {
    if (err) return next(err);

    res.redirect('/');
  });
};

module.exports.destroy = function (req, res, next) {
  //giá trị tìm by ID, trả về todo
  Todo.findById(req.params.id, function (err, todo) {
    //kiểm tra xem có phải là của User hiện tại không
    const user_id = req.cookies ? req.cookies.user_id : undefined;
    if (todo.user_id != user_id) {
      return utils.forbidden(res);
    }
    //nếu đúng thì thực hiện remove 
    todo.remove(function (err, todo) {
      if (err) return next(err);
      res.redirect('/');
    })

  })
}
//edit view content 
module.exports.edit = function (req, res, next) {

  console.log(req.params.id);

  var user_id = req.cookies ? req.cookies.user_id : undefined;

  Todo.findById(req.params.id, function (err, todo) {
    if (err) return next(err);

    res.render('edit', {
      title: 'Express Todo Example',
      todo: todo,
      current: req.params.id
    })

  });
}
//update 
module.exports.update = function (req, res, next) {
  Todo.findById(req.params.id, function (err, todo) {

    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if (todo.user_id !== user_id) {
      return utils.forbidden(res);
    }
    todo.content = req.body.content;
    todo.updated_at = Date.now();
    todo.save(function (err, todo, count) {
      if (err) return next(err);
      res.redirect('/');
    });

  });
}