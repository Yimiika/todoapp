const express = require("express");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const userModel = require("./models/users");
const session = require("express-session");
const flash = require("connect-flash");
const logger = require("./utils/logger");
require("dotenv").config();

const db = require("./db");

const PORT = 3000;
const app = express();

db.connectToMongoDB();

const tasksRoute = require("./routes/tasks");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      console.log(method, req.body._method);
      delete req.body._method;
      return method;
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/tasks", connectEnsureLogin.ensureLoggedIn(), tasksRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  const user = req.body;
  userModel.register(
    new userModel({ username: user.username }),
    user.password,
    (err, user) => {
      if (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/tasks");
        });
      }
    }
  );
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error", err.message);
      return next(err);
    }
    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error", err.message);
        return next(err);
      }
      console.log("User logged in:", req.user);
      return res.redirect("/tasks");
    });
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "You have been logged out successfully.");
  res.redirect("/");
});

app.use((req, res, next) => {
  if (!req.isAuthenticated()) {
    res.status(404).render("error", {
      message: "Page not found",
      url: req.originalUrl,
      redirectTo: "/",
      buttonText: "Go back to homepage",
    });
  } else {
    res.status(404).render("error", {
      message: "Page not found",
      url: req.originalUrl,
      redirectTo: "/tasks",
      buttonText: "Go back to tasks",
    });
  }
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("An unexpected error occurred. Please try again later.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
