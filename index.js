const express = require('express');
const methodOverride = require('method-override');
require("dotenv").config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');

database.connect();

const app = express();

app.use(methodOverride('_method'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})