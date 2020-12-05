
'use strict';


// подключение модуля express
const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const dateFormat = require('dateformat');
const bodyparser = require('body-parser');


// логгирование запросов
app.use(function (request, response, next) {
    let now = new Date();
    let data = dateFormat(now, "dd.mm.yyyy HH:MM") + ` ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    fs.appendFile("request.log", data + "\n", function () { });
    next();
});

// определяем обработчик для маршрута "/"
app.get("/", (request, response) => {
//  отправляем ответ на запрос
response.send("<h3>Заполнить форму:</h3><a href='/forma'>Тестовая форма</a>");
});

app.use(express.static(__dirname + '/static'));
app.use('/static', express.static('static'));

//отправка данных на сервер - парсер для данных
const urlencodedParser = bodyparser.urlencoded({ extended: false });

app.get("/register", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + '/static/register.html');
    response.send("<h3>Мини-карта сайта:</h3></ br><h4><a href='/forma'>Тестовая форма</a></h4></ br><h4><a href='/log'>log файл</a></h4>");
});
app.get("/forma", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + '/static/form.html');
});
app.get("/log", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + '/request.log');
});
app.post("/register", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
//response.send("Данные сохранены в файле request.log");
fs.appendFile("request.log", " имя:" + `${request.body.userName}` +", возраст:"+ `${request.body.userAge}`+"\n", function () { });
});
// начинаем прослушивать подключения
app.listen(port, (err) => {
    if (err) {
         return console.log("Error", err);
         }
    console.log(`HTTP-server:${port}`);
});
