const { body } = require("express-validator");

const registerValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("apellido").optional().trim(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),

  body("terms").custom((value) => {
    if (value !== "on") {
      throw new Error("Debes aceptar los términos y condiciones");
    }
    return true;
  }),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = {
  registerValidator,
  loginValidator,
};