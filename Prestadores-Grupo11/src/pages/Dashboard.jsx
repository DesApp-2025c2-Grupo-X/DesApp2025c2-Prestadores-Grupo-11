
import React, { useEffect, useState } from "react";
import DashboardApi from "../services/DashboardApi";
import HeaderPrestadores from "../components/HeaderPrestadores";
import PrestadoresLayout from "../components/PrestadoresLayout";

import Grid from "@mui/material/Grid"; 
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Recharts
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [periodo, setPeriodo] = useState("semana");
  const [estado, setEstado] = useState("todos");

  const [kpis, setKpis] = useState(null);
  const [grafico, setGrafico] = useState([]);
  const [distribucion, setDistribucion] = useState([]);
  const [registros, setRegistros] = useState([]);

  // columnas de la tabla 
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "fecha",
      headerName: "Fecha",
      width: 160,
      valueGetter: (params) => {
        const f = params?.row?.fecha;
        if (!f) return "";
        try {
          return new Date(f).toLocaleString("es-AR");
        } catch {
          return "";
        }
      },
    },
    { field: "tipo", headerName: "Tipo", width: 150 },
    { field: "estado", headerName: "Estado", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
  ];

  // colores CSS
  const COLORS = {
    rosa: "var(--rosa)",
    verdeAgua: "var(--verde-agua)",
    verdeMenta: "var(--verde-menta)",
    azulProfundo: "var(--azul-profundo)",
    azulPetroleo: "var(--azul-petroleo)",
    celeste: "var(--celeste)",
    verdeSuave: "var(--verde-suave)",
    grisClaro: "var(--gris-claro)",
  };

  const cargarFiltrado = async (p = periodo, e = estado) => {
    try {
      setLoading(true);
      const data = await DashboardApi.getFiltrado(p, e);

      setKpis(data.kpis || null);

      setGrafico(
        (data.grafico || []).map((g) => ({
          fecha: g.fecha,
          reintegros: g.reintegros || 0,
          recetas: g.recetas || 0,
          autorizaciones: g.autorizaciones || 0,
        }))
      );

      setDistribucion(data.distribucion || []);

      setRegistros(
        (data.registros || []).map((r, i) => ({
          id: i + 1,
          fecha: r.fecha ?? null,
          tipo: r.tipo ?? "",
          estado: r.estado ?? "",
          descripcion: r.descripcion ?? "",
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFiltrado();
  }, []);

  useEffect(() => {
    cargarFiltrado(periodo, estado);
  }, [periodo, estado]);

  return (
    <PrestadoresLayout header={<HeaderPrestadores />}>
      <Box p={3}>
        {loading && <Typography>Cargando dashboard...</Typography>}
        {error && <Typography color="error">{error}</Typography>}

        {/* FILTROS */}
        <Grid container spacing={2} mb={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select value={periodo} label="Período" onChange={(e) => setPeriodo(e.target.value)}>
                <MenuItem value="hoy">Hoy</MenuItem>
                <MenuItem value="semana">Esta semana</MenuItem>
                <MenuItem value="mes">Este mes</MenuItem>
                <MenuItem value="anio">Este año</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select value={estado} label="Estado" onChange={(e) => setEstado(e.target.value)}>
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="recibido">Recibido</MenuItem>
                <MenuItem value="analisis">En análisis</MenuItem>
                <MenuItem value="rechazado">Rechazado</MenuItem>
                <MenuItem value="aprobado">Aprobado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* KPIS */}
        {kpis && (
          <Grid container spacing={2} mb={4}>
            {[
              { label: "Reintegros", value: kpis.reintegros, color: COLORS.azulProfundo },
              { label: "Recetas", value: kpis.recetas, color: COLORS.verdeAgua },
              { label: "Autorizaciones", value: kpis.autorizaciones, color: COLORS.rosa },
            ].map((kpi, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card sx={{ background: "white", borderRadius: 2, textAlign: "center", padding: 2 }}>
                  <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>{kpi.value}</Typography>
                    <Typography variant="subtitle1">{kpi.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Grid container spacing={2}>
          {/* Gráfico de barras */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" mb={2} color={COLORS.azulPetroleo}>
                Movimientos por período
              </Typography>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={grafico}>
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reintegros" stackId="a" fill="var(--azul-profundo)" />
                  <Bar dataKey="recetas" stackId="a" fill="var(--verde-agua)" />
                  <Bar dataKey="autorizaciones" stackId="a" fill="var(--rosa)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          {/* torta */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" mb={2} color={COLORS.azulPetroleo}>
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
                    label={({ estado }) => estado}
                  >
                    {distribucion.map((_, i) => (
                      <Cell
                        key={i}
                        fill={[
                          "var(--azul-profundo)",
                          "var(--verde-agua)",
                          "var(--celeste)",
                          "var(--rosa)",
                          "var(--verde-menta)",
                        ][i % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>

        {/* tabla */}
        <Box mt={3}>
          <Card sx={{ padding: 2 }}>
            <Typography variant="h6" mb={2} color={COLORS.azulPetroleo}>
              Detalle por día / periodo
            </Typography>

            <DataGrid
              rows={registros}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[8, 16, 32,48]}
              initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
              autoHeight
            />
          </Card>
        </Box>
      </Box>
    </PrestadoresLayout>
  );
}
