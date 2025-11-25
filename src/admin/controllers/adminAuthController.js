const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { appConfig } = require('../../config/env');
const pool = require('../../config/database');

const adminAuthController = {
  loginPage(req, res) {
    res.render('admin/pages/login', {
      layout: false,
      title: 'Acceso Panel Admin'
    });
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const [users] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
      );

      if (!users.length) {
        req.flash('error', 'Credenciales inválidas');
        return res.redirect('/admin/login');
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        req.flash('error', 'Credenciales inválidas');
        return res.redirect('/admin/login');
      }

      // Verificar que sea admin
      const [roles] = await pool.query(
        `SELECT r.nombre FROM usuario_roles ur
         JOIN roles r ON ur.rol_id = r.id
         WHERE ur.usuario_id = ? AND r.nombre = 'admin'`,
        [user.id]
      );

      if (!roles.length) {
        req.flash('error', 'No tienes permisos de administrador');
        return res.redirect('/admin/login');
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nombre: user.nombre
        },
        appConfig.jwtSecret,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: appConfig.env === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });

      // Actualizar último acceso
      await pool.query(
        'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
        [user.id]
      );

      req.flash('success', 'Bienvenido al panel de administración');
      res.redirect('/admin');
    } catch (error) {
      console.error('Error en login admin:', error);
      req.flash('error', 'Error al procesar el login');
      res.redirect('/admin/login');
    }
  }
};

module.exports = adminAuthController;
