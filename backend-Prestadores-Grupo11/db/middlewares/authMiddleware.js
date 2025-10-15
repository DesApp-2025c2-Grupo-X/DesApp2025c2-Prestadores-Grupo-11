function validarCredenciales(req, res, next) {
  const { username, password } = req.body;

  // Verificar que no falten campos
  if (!username || !password) {
    return res.status(400).json({ message: 'Username y password son requeridos.' });
  }

  // Eliminar espacios al inicio o fin
  const userTrim = username.trim();
  const passTrim = password.trim();

  // Verificar que no haya espacios dentro
  if (userTrim.includes(' ') || passTrim.includes(' ')) {
    return res.status(400).json({ message: 'No se permiten espacios en username o password.' });
  }

  // Validar formato de DNI o CUIT
  const dniCuitRegex = /^(\d{7,8}|\d{11})$/;
  if (!dniCuitRegex.test(userTrim)) {
    return res.status(400).json({ message: 'El username debe tener formato de DNI (7-8 dígitos) o CUIT (11 dígitos).' });
  }

  // Validar longitud mínima de la contraseña
  if (passTrim.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  next();
}

module.exports = validarCredenciales;
