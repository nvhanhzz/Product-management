const express = require('express');
const methodOverride = require('method-override');
require("dotenv").config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');

const database = require("./config/database");

const systemConfig = require("./config/system");

const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');

database.connect();

const app = express();

app.use(methodOverride('_method'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('abcxyz'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());;

const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})