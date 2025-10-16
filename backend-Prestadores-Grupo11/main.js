const express = require('express');
const cors = require('cors'); //Necesario para habilitar conexion frontend/backend
const app = express();
const PORT = process.env.PORT ?? 3001;
const {authRoute, dashboardRoute, historiasRoute, situacionesRoute, solicitudesRoute, turnosRoute} = require('./routes');

app.use(cors());
app.use(express.json());

app.use('/login', authRoute);
app.use('/dashboard', dashboardRoute);
app.use('/historias', historiasRoute);
app.use('/situaciones', situacionesRoute);
app.use('/solicitudes', solicitudesRoute);
app.use('/turnos', turnosRoute);

app.listen(PORT, async () => {
    //await db.sequelize.sync({ force: true });
    console.log(`La app arranco en el puerto ${PORT}.`);
});