const { Prestador } = require('../../models');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const prestador = await Prestador.findOne({ where: { username } });

    if (!prestador) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (prestador.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta.' });
    }

    // Si todo está bien:
    return res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      user: {
        id: prestador.id,
        username: prestador.username,
        role: prestador.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
