const express = require("express");
const { appConfig } = require("./config/env");
const apiRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const path = require("path");
const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", env: appConfig.env });
});

const jwt = require("jsonwebtoken");

app.get("/", (req, res) => {
  let user = null;
  const token = req.cookies.token;

  if (token) {
    try {
      user = jwt.verify(token, appConfig.jwtSecret);
    } catch (error) {
      // Token inválido o expirado, ignorar
    }
  }

  res.render("Home/index", {
    currencyApiKey: appConfig.currencyApiKey,
    user,
  });
});

app.get("/login", (_req, res) => {
  res.render("Auth/login");
});

app.get("/registro", (_req, res) => {
  res.render("Auth/registro");
});

app.use("/auth", authRoutes);
app.use(appConfig.apiPrefix, apiRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
