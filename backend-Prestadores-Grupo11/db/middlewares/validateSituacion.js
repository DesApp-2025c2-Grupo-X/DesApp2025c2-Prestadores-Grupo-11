module.exports = (req, res, next) => {
  const { titulo, estado, integranteId } = req.body;

  if (!titulo || !estado || !integranteId) {
    return res.status(400).json({ message: 'Faltan datos obligatorios (titulo, estado o integranteId).' });
  }

  if (typeof titulo !== 'string' || typeof estado !== 'string') {
    return res.status(400).json({ message: 'El título y el estado deben ser textos válidos.' });
  }

  if (typeof integranteId !== 'number') {
    return res.status(400).json({ message: 'El integranteId debe ser un número válido.' });
  }

  if (titulo.trim() === '' || estado.trim() === '') {
    return res.status(400).json({ message: 'El título y el estado no pueden estar vacíos.' });
  }

  next();
};
