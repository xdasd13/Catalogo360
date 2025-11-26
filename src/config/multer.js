const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Crear directorios si no existen
const uploadsDir = path.join(__dirname, "../../public/uploads");
const productsDir = path.join(uploadsDir, "products");

[uploadsDir, productsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración de almacenamiento temporal (en memoria)
const storage = multer.memoryStorage();

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)"
      )
    );
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: fileFilter,
});

module.exports = upload;
