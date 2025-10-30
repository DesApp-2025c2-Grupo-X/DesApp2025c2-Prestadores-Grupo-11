import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/SituacionesTerapeuticas.css";

export default function Buscador({
  onSearch,
  delay = 500,
  basePath = "/prestadores/situaciones",
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const prevQuery = useRef("");

  // --- Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed !== prevQuery.current) {
        prevQuery.current = trimmed;
        setDebouncedQuery(trimmed);
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [query, delay]);

  // --- Ejecuta la búsqueda ---
  useEffect(() => {
    if (!onSearch) return;
    if (debouncedQuery.length >= 2 || debouncedQuery === "") {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`${basePath}?query=${encodeURIComponent(query)}`);
    }
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
        placeholder="Buscar por nombre o DNI..."
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
        onClick={() =>
          query.trim() &&
          navigate(`${basePath}?query=${encodeURIComponent(query)}`)
        }
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
    </motion.div>
  );
}
