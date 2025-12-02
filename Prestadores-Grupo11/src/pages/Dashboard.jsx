import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DataGrid } from "@mui/x-data-grid";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import { getFiltrado, getKpis } from "../services/DashboardApi";
import { Container } from "@mui/material";

// === FORMATEADORES ===
const formatearFechaCorta = (fechaStr) => {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const obtenerNombreMes = (fechaStr) => {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-AR", {
    month: "long",
  });
};

const COLORS = {
  Nudesuave: "#f3e3da",
  Verdematchapastel: "#d4e9d7",
  Azulcielopastel: "#c6e7ff",
  rosa: "#fbc3c2",
  Verdepistacho: "#cfe8cf",
};

const columns = [
  { field: "fecha", headerName: "Fecha", width: 160 },
  { field: "tipo", headerName: "Tipo", width: 150 },
  { field: "descripcion", headerName: "Descripción", width: 300 },
];

const CustomActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    value,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontWeight="bold"
      >
        {value}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  // Filtros
  const [periodo, setPeriodo] = useState("semana");
  const [estado, setEstado] = useState("todos");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // Data
  const [kpis, setKpis] = useState(null);
  const [grafico, setGrafico] = useState([]);
  const [distribucion, setDistribucion] = useState([]);
  const [registros, setRegistros] = useState([]);

  // CARGA DEL DASHBOARD
  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFiltrado({ periodo, estado, desde, hasta });

      setKpis(data.kpis || {});

      setGrafico(
        (data.grafico || []).map((item) => ({
          ...item,
          fecha: formatearFechaCorta(item.fecha),
        }))
      );

      setDistribucion(data.distribucion || []);

      setRegistros(
        (data.registros || []).map((row, index) => ({
          id: row.id || `row-${index}`, // si falta id, generamos uno
          ...row,
          fecha: formatearFechaCorta(row.fecha),
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Error al cargar el dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, [periodo, estado, desde, hasta]);

  // === FORMATEO FINAL ===
  const graficoFormateado = grafico.map((item, i) => ({
    id: i,
    ...item,
    fecha:
      periodo === "mes" || periodo === "anio"
        ? obtenerNombreMes(item.fecha)
        : item.fecha,
  }));

  const registrosFormateados = registros.map((r) => ({
    ...r,
    fecha:
      periodo === "mes" || periodo === "anio"
        ? obtenerNombreMes(r.fecha)
        : r.fecha,
  }));

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: 4,
            borderRadius: "20px",
            background: "linear-gradient(145deg, #ffffff, #fff8fc)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            border: "2px solid #ff69b4",
          }}
        >
          {loading && <Typography>Cargando dashboard...</Typography>}
          {error && <Typography color="error">{error}</Typography>}

          {/* -------- FILTROS -------- */}
          <Grid container spacing={3} mb={3}>
            {/* Período */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Período</InputLabel>
                <Select
                  value={periodo}
                  label="Período"
                  onChange={(e) => setPeriodo(e.target.value)}
                >
                  <MenuItem value="hoy">Hoy</MenuItem>
                  <MenuItem value="semana">Esta semana</MenuItem>
                  <MenuItem value="mes">Este mes</MenuItem>
                  <MenuItem value="anio">Este año</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Estado */}
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estado}
                  label="Estado"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="recibido">Recibido</MenuItem>
                  <MenuItem value="analisis">En análisis</MenuItem>
                  <MenuItem value="rechazado">Rechazado</MenuItem>
                  <MenuItem value="aprobado">Aprobado</MenuItem>
                  <MenuItem value="observado">Observado</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Desde */}
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Desde"
                InputLabelProps={{ shrink: true }}
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </Grid>

            {/* Hasta */}
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Hasta"
                InputLabelProps={{ shrink: true }}
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </Grid>
          </Grid>

          {/* KPIS */}
          {kpis && (
            <Grid container spacing={3} mb={4}>
              {[
                {
                  label: "Reintegros",
                  value: kpis.reintegros,
                  color: COLORS.Azulcielopastel,
                },
                {
                  label: "Recetas",
                  value: kpis.recetas,
                  color: COLORS.Verdepistacho,
                },
                {
                  label: "Autorizaciones",
                  value: kpis.autorizaciones,
                  color: COLORS.rosa,
                },
              ].map((kpi, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={i}>
                  <Card
                    sx={{
                      padding: 4,
                      borderRadius: 5,
                      textAlign: "center",
                      backgroundColor: kpi.color,
                      marginBottom: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h3" fontWeight={700}>
                        {kpi.value}
                      </Typography>
                      <Typography variant="subtitle1">{kpi.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* GRÁFICOS */}
          <Grid container spacing={3} mb={4}>
            {/* BARRAS VERTICALES */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  padding: 4,
                  border: "2px solid #ff69b4",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-4px)", //  levanta la tarjeta
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)", // sombra más marcada
                    borderColor: "#ff69b4", // tono más fuerte al pasar el mouse
                  },
                  background: "linear-gradient(145deg, #ffffff, #fff5fb)",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Movimientos por período
                </Typography>

                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={graficoFormateado}>
                    <XAxis dataKey="fecha" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="reintegros" fill={COLORS.Azulcielopastel} />
                    <Bar dataKey="recetas" fill={COLORS.Verdepistacho} />
                    <Bar dataKey="autorizaciones" fill={COLORS.rosa} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Grid>

            {/* TORTA */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  padding: 4,
                  border: "2px solid #ff69b4",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-4px)", //  levanta la tarjeta
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)", // sombra más marcada
                    borderColor: "#ff69b4", // tono más fuerte al pasar el mouse
                  },
                  background: "linear-gradient(145deg, #ffffff, #fff5fb)",
                }}
              >
                <Typography variant="h6" mb={2}>
                  Distribución por estado
                </Typography>

                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={distribucion}
                      dataKey="total"
                      nameKey="estado"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      activeIndex={activeIndex}
                      activeShape={CustomActiveShape}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        index,
                        value,
                      }) => {
                        const RADIAN = Math.PI / 180;
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                        const fillColor = [
                          COLORS.Azulcielopastel,
                          COLORS.Verdepistacho,
                          COLORS.rosa,
                          COLORS.Verdematchapastel,
                          COLORS.Nudesuave,
                        ][index % 5];

                        return (
                          <text
                            x={x}
                            y={y}
                            fill={fillColor}
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontWeight="bold"
                          >
                            {value}
                          </text>
                        );
                      }}
                    >
                      {distribucion.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            [
                              COLORS.Azulcielopastel,
                              COLORS.Verdepistacho,
                              COLORS.rosa,
                              COLORS.Verdematchapastel,
                              COLORS.Nudesuave,
                            ][i % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #fbc3c2",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Grid>
          </Grid>

          {/* TABLA */}
          <Card
            sx={{
              padding: 3,
              border: "2px solid #ff69b4",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              background: "linear-gradient(145deg, #ffffff, #fff7fc)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 22px rgba(0,0,0,0.12)",
                borderColor: "#ff3c91",
              },
            }}
          >
            <Typography variant="h6" mb={2}>
              Detalle por período
            </Typography>

            <DataGrid
              rows={registrosFormateados}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 15, 20]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              autoHeight
              sx={{
                borderRadius: "12px",
                backgroundColor: "#fff",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#ffe6f2",
                  color: "#b30059",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#fff0f8",
                },
                "& .MuiDataGrid-cell": {
                  borderColor: "#f7d1e6",
                },
              }}
            />
          </Card>
        </Box>
      </Container>
    </PrestadoresLayout>
  );
}
