/**
 * Utilidad para generar slugs desde texto
 */
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
        .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
};

module.exports = { generateSlug };
