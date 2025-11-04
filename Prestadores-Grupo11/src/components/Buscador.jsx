import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SituacionesTerapeuticas.css";

export default function Buscador({
  onSearch,
  basePath = "/prestadores/situaciones",
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  // --- Verifica si es un nombre (solo letras y espacios) ---
  const esNombre = (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor);

  // --- Verifica si es un número de afiliado válido: letras + "-" + números ---
  const esNumeroAfiliado = (valor) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+-\d{4,}$/.test(valor);

  // --- Lógica de búsqueda centralizada ---
  const ejecutarBusqueda = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      toast.error("Por favor, ingresa un nombre o número de afiliado");
      return;
    }

    if (trimmed.length < 8) {
      toast.warning("Debe tener al menos 8 caracteres para buscar");
      return;
    }

    if (esNombre(trimmed) || esNumeroAfiliado(trimmed)) {
      console.log(`${basePath}?query=${encodeURIComponent(trimmed)}`) // de prueba
      navigate(`${basePath}?query=${encodeURIComponent(trimmed)}`);
      if (onSearch) onSearch(trimmed);
    } else {
      toast.error(
        "Formato no válido. Usa solo letras para nombres o formato LETRAS-NÚMEROS (ej: IOMA-00111222)"
      );
    }
  };

  // --- Ejecuta búsqueda solo al presionar Enter ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      ejecutarBusqueda();
    }
  };

  // --- Permite buscar también con el botón ---
  const handleSearchClick = () => {
    ejecutarBusqueda();
  };

  return (
    <motion.div
      className="buscador"
      animate={{
        scale: isFocused ? 1.05 : 1,
        boxShadow: isFocused
          ? "0 0 15px rgba(251, 195, 194, 0.6)"
          : "0 3px 6px rgba(0,0,0,0.1)",
        borderColor: isFocused ? "var(--verde-agua)" : "var(--rosa)",
      }}
      transition={{ duration: 0.3 }}
    >
      <input
        type="text"
        placeholder="Buscar por nombre o número de afiliado (ej: IOMA-00111222)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />

      <motion.button
        type="button"
        whileHover={{ scale: 1.15, backgroundColor: "var(--verde-agua)" }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSearchClick}
      >
        <Search size={20} />
      </motion.button>

      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            className="sugerencia"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
          >
            Presiona <strong>Enter</strong> para buscar
          </motion.div>
        )}
      </AnimatePresence>
      {/* === Toasts globales === */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </motion.div>
  );
}

