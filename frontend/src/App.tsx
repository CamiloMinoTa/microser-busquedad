import { useState } from 'react';

interface SearchResult {
  title: string;
  snippet: string;
  source: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState('Ingrese una consulta y presione Buscar.');

  const handleSearch = async () => {
    setStatus('Conectando a la base de datos...');
    setResults([]);

    try {
      const url = new URL('http://localhost:3000/search');
      if (query.trim().length) {
        url.searchParams.set('q', query.trim());
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results ?? []);
      setStatus(`Conexión exitosa. Resultado(s): ${data.total}`);
    } catch (error) {
      setStatus(`Error de conexión: ${error instanceof Error ? error.message : 'desconocido'}`);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Verificador MongoDB Atlas</h1>
        <p>Este frontend prueba la conexión al endpoint del microservicio y muestra resultados.</p>

        <label htmlFor="query">Consulta de búsqueda</label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Escribe un término para buscar..."
        />

        <button type="button" onClick={handleSearch}>
          Buscar
        </button>

        <div className="status-box">
          <strong>Estado:</strong> {status}
        </div>

        {results.length > 0 && (
          <div className="results">
            <h2>Resultados</h2>
            <ul>
              {results.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  <strong>{item.title}</strong>
                  <p>{item.snippet}</p>
                  <small>{item.source}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
