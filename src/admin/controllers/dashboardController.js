const pool = require('../../config/database');

const dashboardController = {
  async index(req, res) {
    try {
      // Total de productos
      const [productsCount] = await pool.query(
        'SELECT COUNT(*) as total FROM productos WHERE activo = true'
      );

      // Stock total
      const [totalStock] = await pool.query(
        `SELECT SUM(cantidad) as total, SUM(cantidad_reservada) as reservado 
         FROM stock`
      );

      // Productos sin stock
      const [outOfStock] = await pool.query(
        `SELECT COUNT(DISTINCT p.id) as total FROM productos p
         JOIN variantes_producto vp ON p.id = vp.producto_id
         LEFT JOIN stock s ON vp.id = s.variante_id
         WHERE p.activo = true AND (s.cantidad IS NULL OR s.cantidad = 0)`
      );

      // Productos destacados
      const [featured] = await pool.query(
        'SELECT COUNT(*) as total FROM productos WHERE destacado = true AND activo = true'
      );

      // Categorías
      const [categoriesCount] = await pool.query(
        'SELECT COUNT(*) as total FROM categorias WHERE activo = true'
      );

      // Usuarios activos
      const [activeUsers] = await pool.query(
        'SELECT COUNT(*) as total FROM usuarios WHERE activo = true'
      );

      // Marcas
      const [marcasCount] = await pool.query(
        'SELECT COUNT(*) as total FROM marcas'
      );

      const stats = {
        totalProducts: productsCount[0].total,
        totalStock: totalStock[0].total || 0,
        reservedStock: totalStock[0].reservado || 0,
        outOfStock: outOfStock[0].total,
        featured: featured[0].total,
        totalCategories: categoriesCount[0].total,
        totalUsers: activeUsers[0].total,
        totalBrands: marcasCount[0].total
      };

      res.render('admin/dashboard', {
        layout: 'layouts/admin',
        title: 'Dashboard',
        currentPage: 'dashboard',
        user: req.user,
        stats
      });
    } catch (error) {
      console.error('Error en dashboard:', error);
      req.flash('error', 'Error al cargar el dashboard');
      res.redirect('/admin');
    }
  }
};

module.exports = dashboardController;
