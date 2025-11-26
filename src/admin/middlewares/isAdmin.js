const jwt = require('jsonwebtoken');
const { appConfig } = require('../../config/env');
const pool = require('../../config/database');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/admin/login');
    }

    const decoded = jwt.verify(token, appConfig.jwtSecret);
    req.user = decoded;

    // Verificar si el usuario tiene rol admin
    const [roles] = await pool.query(
      `SELECT r.nombre FROM usuario_roles ur
       JOIN roles r ON ur.rol_id = r.id
       WHERE ur.usuario_id = ? AND r.nombre = 'admin'`,
      [decoded.id]
    );

    if (!roles || roles.length === 0) {
      return res.status(403).render('error', {
        statusCode: 403,
        message: 'No tienes permisos para acceder al panel de administración'
      });
    }

    // Cargar datos del admin
    const [userData] = await pool.query(
      'SELECT id, email, nombre, apellido FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    req.admin = userData[0];
    next();
  } catch (error) {
    console.error('Error en isAdmin middleware:', error);
    res.clearCookie('token');
    res.redirect('/admin/login');
  }
};

module.exports = isAdmin;
