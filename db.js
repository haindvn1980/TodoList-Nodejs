var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Todo = new Schema({
  user_id: String,
  content: String,
  updated_at: Date
});

mongoose.model('Todo', Todo);
mongoose.connect('mongodb://admin:admin123@localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });
