const express = require("express");
const { appConfig } = require("./config/env");
const apiRoutes = require("./routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const productosRoutes = require("./routes/productos");
const adminRoutes = require("./admin/routes");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const iaRoutes = require("./admin/routes/ia.routes");

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Method Override - permite usar PUT/DELETE en formularios
app.use(methodOverride("_method"));

// Flash Messages
app.use(
  session({
    secret: appConfig.jwtSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: appConfig.env === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());

// Flash messages middleware
const flashMiddleware = require("./middlewares/flash.middleware");
app.use(flashMiddleware);

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

app.get("/checkout", (req, res) => {
  const token = req.cookies.token;

  // Verificar que el usuario esté autenticado
  if (!token) {
    return res.redirect("/login");
  }

  try {
    jwt.verify(token, appConfig.jwtSecret);
    res.render("Home/checkout");
  } catch (error) {
    // Token inválido o expirado
    res.clearCookie("token");
    res.redirect("/login");
  }
});

app.use("/", productosRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(appConfig.apiPrefix, apiRoutes);
app.use("/api/ia", iaRoutes); // IA routes con Mistral

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
