const { body } = require("express-validator");

const usuarioValidator = {
  crear: [
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
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("Debe ser un email válido")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),

    body("telefono")
      .optional()
      .trim()
      .isMobilePhone("es-PE")
      .withMessage("Debe ser un número de teléfono válido"),

    body("roles")
      .optional()
      .isArray()
      .withMessage("Los roles deben ser una lista"),
  ],

  editar: [
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
      .withMessage("El email es obligatorio")
      .isEmail()
      .withMessage("Debe ser un email válido")
      .normalizeEmail(),

    body("telefono")
      .optional()
      .trim()
      .isMobilePhone("es-PE")
      .withMessage("Debe ser un número de teléfono válido"),

    body("roles").optional(),
  ],

  cambiarPassword: [
    body("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),

    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Las contraseñas no coinciden");
      }
      return true;
    }),
  ],
};

module.exports = usuarioValidator;
