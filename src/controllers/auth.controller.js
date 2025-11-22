const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userRepository = require("../repositories/user.repository");
const { appConfig } = require("../config/env");

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, nombre, apellido, telefono } = req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "El correo electrónico ya está registrado" });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const userId = await userRepository.create({
        email,
        password_hash,
        nombre,
        apellido,
        telefono,
      });

      // Generar token JWT
      const token = jwt.sign(
        { id: userId, email, nombre, apellido },
        appConfig.jwtSecret,
        { expiresIn: "24h" }
      );

      // Enviar cookie httpOnly
      res.cookie("token", token, {
        httpOnly: true,
        secure: appConfig.env === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      });

      // Redirigir al catálogo después del registro exitoso
      res.redirect("/?registered=true");
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          rol: user.rol,
          nombre: user.nombre,
          apellido: user.apellido,
        },
        appConfig.jwtSecret,
        { expiresIn: "24h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: appConfig.env === "production",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Redirigir al catálogo después del login exitoso
      res.redirect("/?loggedIn=true");
    } catch (error) {
      next(error);
    }
  }

  logout(req, res) {
    res.clearCookie("token");
    // Redirigir al catálogo después del logout
    res.redirect("/?loggedOut=true");
  }
}

module.exports = new AuthController();
