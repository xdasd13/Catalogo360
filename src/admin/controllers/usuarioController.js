const UsuarioService = require("../services/usuarioService");
const { validationResult } = require("express-validator");

class UsuarioController {
  // Listar usuarios
  async listar(req, res) {
    try {
      const usuarios = await UsuarioService.getAll();
      res.render("Admin/pages/usuarios/lista", {
        currentPage: "usuarios",
        usuarios,
      });
    } catch (error) {
      console.error(error);
      req.flash("error", "Error al cargar usuarios");
      res.redirect("/admin");
    }
  }

  // Formulario de creación
  async crearForm(req, res) {
    try {
      const roles = await UsuarioService.getAllRoles();
      res.render("Admin/pages/usuarios/nuevo", {
        currentPage: "usuarios",
        roles,
        usuario: {}, // Para mantener datos si falla validación
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/usuarios");
    }
  }

  // Procesar creación
  async crear(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const roles = await UsuarioService.getAllRoles();
        return res.render("Admin/pages/usuarios/nuevo", {
          currentPage: "usuarios",
          roles,
          usuario: req.body,
          error: errors.array()[0].msg, // Pasamos error explícito aquí porque es de validación local
        });
      }

      const nuevoUsuario = await UsuarioService.create(req.body);

      // Asignar roles si se seleccionaron
      if (req.body.roles) {
        const roles = Array.isArray(req.body.roles)
          ? req.body.roles
          : [req.body.roles];
        await UsuarioService.assignRoles(nuevoUsuario.id, roles);
      }

      req.flash("message", "Usuario creado correctamente");
      res.redirect("/admin/usuarios");
    } catch (error) {
      const roles = await UsuarioService.getAllRoles();
      res.render("Admin/pages/usuarios/nuevo", {
        currentPage: "usuarios",
        roles,
        usuario: req.body,
        error: error.message,
      });
    }
  }

  // Formulario de edición
  async editarForm(req, res) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.getById(id);
      const roles = await UsuarioService.getAllRoles();
      const userRoles = await UsuarioService.getUserRoles(id);

      // Mapear roles del usuario a un array de IDs para fácil verificación en la vista
      const userRoleIds = userRoles.map((r) => r.id);

      res.render("Admin/pages/usuarios/editar", {
        currentPage: "usuarios",
        usuario,
        roles,
        userRoleIds,
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/usuarios");
    }
  }

  // Procesar edición
  async editar(req, res) {
    try {
      const { id } = req.params;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect(`/admin/usuarios/${id}/editar`);
      }

      await UsuarioService.update(id, req.body);

      // Actualizar roles
      if (req.body.roles) {
        const roles = Array.isArray(req.body.roles)
          ? req.body.roles
          : [req.body.roles];
        await UsuarioService.assignRoles(id, roles);
      } else {
        await UsuarioService.assignRoles(id, []);
      }

      req.flash("message", "Usuario actualizado correctamente");
      res.redirect("/admin/usuarios");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/admin/usuarios/${req.params.id}/editar`);
    }
  }

  // Eliminar (Desactivar) usuario
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await UsuarioService.delete(id);
      req.flash("message", "Usuario desactivado correctamente");
      res.redirect("/admin/usuarios");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/admin/usuarios");
    }
  }

  // Cambiar contraseña
  async cambiarPassword(req, res) {
    try {
      const { id } = req.params;
      const { password, confirm_password } = req.body;

      if (password !== confirm_password) {
        req.flash("error", "Las contraseñas no coinciden");
        return res.redirect(`/admin/usuarios/${id}/editar`);
      }

      if (password.length < 6) {
        req.flash("error", "La contraseña debe tener al menos 6 caracteres");
        return res.redirect(`/admin/usuarios/${id}/editar`);
      }

      await UsuarioService.changePassword(id, password);
      req.flash("message", "Contraseña actualizada correctamente");
      res.redirect(`/admin/usuarios/${id}/editar`);
    } catch (error) {
      req.flash("error", error.message);
      res.redirect(`/admin/usuarios/${req.params.id}/editar`);
    }
  }
}

module.exports = new UsuarioController();
