const { todos, Todo } = require('../models/todo');


exports.list = (req, res) => {
  res.render('index', { title: 'Список задач', todos });
};


exports.newForm = (req, res) => {
  res.render('new', { title: 'Новая задача' });
};


exports.create = (req, res) => {
  const { title } = req.body;
  if (title && title.trim()) {
    todos.push(new Todo(title.trim()));
  }
 
  res.redirect('/');
};


exports.toggle = (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (todo) todo.completed = !todo.completed;
  res.redirect('/');
};


exports.remove = (req, res) => {
  const id = Number(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx !== -1) todos.splice(idx, 1);
  res.redirect('/');
};
