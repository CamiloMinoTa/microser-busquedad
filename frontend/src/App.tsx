import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

function App() {
  const [status, setStatus] = useState<string>('Verificando...');
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_URL = 'http://localhost:3001/api/v1/search';

  useEffect(() => {
    fetch(`${API_URL}?q=test&limit=1`)
      .then(res => res.ok ? setStatus('✅ Conectado') : setStatus('❌ Error HTTP'))
      .catch(() => setStatus('❌ Sin conexión'));
  }, []);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error en el microservicio');
      const data: Product[] = await res.json();
      setResults(data);
      if (data.length === 0) setError('⚠️ Conexión OK, pero la BD está vacía o no coincide la búsqueda.');
    } catch (err: any) {
      setError('❌ ' + (err.message || 'Desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <h1>🔍 Validación Univalle Shop</h1>
      
      <div style={{
        padding: '8px 12px', marginBottom: '15px', borderRadius: '6px',
        background: status.includes('✅') ? '#d1fae5' : status.includes('❌') ? '#fee2e2' : '#e5e7eb',
        color: status.includes('✅') ? '#065f46' : status.includes('❌') ? '#991b1b' : '#374151',
        fontWeight: 'bold'
      }}>
        {status}
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input
          type="text" value={query} onChange={handleInputChange}
          placeholder="Ej: Camiseta, Libro..."
          style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" disabled={loading}
          style={{ padding: '8px 16px', borderRadius: '4px', background: '#2563eb', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {error && <p style={{ color: '#b91c1c', background: '#fee2e2', padding: '8px', borderRadius: '4px' }}>{error}</p>}
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {results.map(item => (
          <li key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{item.name}</strong> <small>({item.category})</small></span>
            <span>${item.price.toLocaleString()} | Stock: {item.stock}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;