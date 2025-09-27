require('dotenv').config();
const express = require('express');
const path = require('path');
const routes = require('./routes');         
const errorController = require('./controllers/errorController');

const app = express();


app.locals.appName = process.env.APP_NAME || 'TodoApp';

// 2) шаблонизатор Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));   
app.use(express.static(path.join(__dirname, 'public'))); 


app.use('/', routes);


app.use(errorController.notFound);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${app.locals.appName} запущен: http://localhost:${PORT}`);
});
