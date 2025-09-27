const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todoController');
const aboutController = require('../controllers/aboutController');

// список задач
router.get('/', todoController.list);

// форма создания
router.get('/new', todoController.newForm);

// создание задачи
router.post('/new', todoController.create);

// переключение статуса
router.post('/:id/toggle', todoController.toggle);

// удаление задачи
router.post('/:id/delete', todoController.remove);

// статическая «о нас»
router.get('/about', aboutController.about);

module.exports = router;
