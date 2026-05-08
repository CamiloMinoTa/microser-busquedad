import { useState } from 'react';

const categories = ['Ropa', 'Papeleria', 'Accesorios', 'Libros'];

interface ProductSearchResult {
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  seller: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [status, setStatus] = useState('Ingrese una consulta y presione Buscar.');

  const handleSearch = async () => {
    setStatus('Conectando a la base de datos...');
    setResults([]);

    try {
      const url = new URL('/api/search', window.location.origin);
      if (query.trim().length) {
        url.searchParams.set('q', query.trim());
      }
      if (category.length) {
        url.searchParams.set('category', category);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results ?? []);
      setStatus(`Conexion exitosa. Resultado(s): ${data.total}`);
    } catch (error) {
      setStatus(`Error de conexion: ${error instanceof Error ? error.message : 'desconocido'}`);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>UnivalleShop</h1>
        <p>Busca productos disponibles en el catalogo del e-commerce.</p>

        <label htmlFor="query">Consulta de busqueda</label>
        <input
          id="query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Escribe un termino para buscar..."
        />

        <label htmlFor="category">Categoria</label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Todas las categorias</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

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
                <li key={`${item.productId}-${index}`}>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <small>
                    {item.category} - ${item.price.toLocaleString('es-CO')} - Stock:{' '}
                    {item.stock} - {item.seller}
                  </small>
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
