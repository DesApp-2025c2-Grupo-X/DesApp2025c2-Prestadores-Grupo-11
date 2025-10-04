import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/SituacionesTerapeuticas.css";

export default function Buscador({ onSearch, delay = 500 }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  // --- Debounce ---
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  // --- Llamada a búsqueda en vivo ---
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  // --- Manejar Enter ---
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      navigate(`/prestadores/situaciones?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="buscador">
      <input
        type="text"
        placeholder="Ingresa N° de afiliado, DNI, o apellido del afiliado..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        onClick={() => query.trim() !== "" && navigate(`/prestadores/situaciones?query=${encodeURIComponent(query)}`)}
      >
        <Search size={20} />
      </button>
    </div>
  );
}
