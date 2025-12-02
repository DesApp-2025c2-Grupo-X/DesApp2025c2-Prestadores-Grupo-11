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
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DataGrid } from "@mui/x-data-grid";
import PrestadoresLayout from "../components/PrestadoresLayout";
import HeaderPrestadores from "../components/HeaderPrestadores";
import api from "../services/Api";

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
  { field: "reintegros", headerName: "Reintegros", width: 140 },
  { field: "recetas", headerName: "Recetas", width: 120 },
  { field: "autorizaciones", headerName: "Autorizaciones", width: 160 },
  { field: "total", headerName: "Total", width: 120 },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filtros
  const [periodo, setPeriodo] = useState("hoy");
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

      const res = await api.get(
        `/dashboard/filtrado?periodo=${periodo}&estado=${estado}&desde=${desde}&hasta=${hasta}`
      );

      // === KPIS ===
      setKpis(res.data.kpis || {});

      // === GRAFICO ===
      setGrafico(
        (res.data.grafico || []).map((item) => ({
          ...item,
          fecha: formatearFechaCorta(item.fecha),
        }))
      );

      // === DISTRIBUCION ===
      setDistribucion(res.data.distribucion || []);

      // === TABLA ===
      setRegistros(
        (res.data.registros || []).map((row, index) => ({
          id: index + 1,
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

  // Cargar cada vez que cambian los filtros
  useEffect(() => {
    cargarDashboard();
  }, [periodo, estado, desde, hasta]);

  // === FORMATEOS PARA GRÁFICOS ===
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
      <Box p={3}>
        {loading && <Typography>Cargando dashboard...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {/* -------- FILTROS -------- */}
        <Grid container spacing={4} mb={3}>
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
                <MenuItem value="observado">Aprobado</MenuItem>
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
          <Grid container spacing={2}>
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
                    marginBottom: 4,
                    backgroundColor: kpi.color,
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
        <Grid container spacing={3}>
          {/* BARRAS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ padding: 4 }}>
              <Typography variant="h6" mb={2}>
                Movimientos por período
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={graficoFormateado} layout="vertical">
                  <YAxis dataKey="fecha" type="category" />
                  <XAxis type="number" />
                  <Tooltip />
                  <Bar
                    dataKey="reintegros"
                    fill={COLORS.Azulcielopastel}
                    stackId="a"
                  />
                  <Bar
                    dataKey="recetas"
                    fill={COLORS.Verdepistacho}
                    stackId="a"
                  />
                  <Bar
                    dataKey="autorizaciones"
                    fill={COLORS.rosa}
                    stackId="a"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* TORTA */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" mb={2}>
                Distribución por estado
              </Typography>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={distribucion}
                    dataKey="total"
                    nameKey="estado"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
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
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* TABLA */}
        <Box mt={3}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" mb={2}>
              Detalle por período
            </Typography>

            <DataGrid
              rows={registrosFormateados}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[8, 16, 32]}
              initialState={{
                pagination: { paginationModel: { pageSize: 8 } },
              }}
              autoHeight
            />
          </Card>
        </Box>
      </Box>
    </PrestadoresLayout>
  );
}
