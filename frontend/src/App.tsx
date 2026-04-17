import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from 'react';

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
};

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function apiRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const path = deferredQuery.trim()
          ? `/search?q=${encodeURIComponent(deferredQuery)}`
          : '/products';
        const data = await apiRequest<Product[]>(path);

        if (!cancelled) {
          startTransition(() => {
            setProducts(data);
          });

          setSelectedProduct((currentSelected) => {
            if (!currentSelected) {
              return data[0] ?? null;
            }

            const stillVisible = data.find(
              (product) => product.id === currentSelected.id,
            );

            return stillVisible ?? data[0] ?? null;
          });
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No se pudo cargar la informacion.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      if (!deferredQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const data = await apiRequest<string[]>(
          `/search/autocomplete?q=${encodeURIComponent(deferredQuery)}&limit=6`,
        );

        if (!cancelled) {
          startTransition(() => {
            setSuggestions(data);
          });
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
        }
      }
    }

    void loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  const statsLabel = loading
    ? 'Consultando Mongo Atlas...'
    : `${products.length} resultado(s)`;

  async function handleSelect(productId: string) {
    try {
      const product = await apiRequest<Product>(`/products/${productId}`);
      setSelectedProduct(product);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo cargar el detalle del producto.',
      );
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">React + NestJS + Mongo Atlas</p>
        <h1>Busquedad Lab</h1>
        <p className="lead">
          Una interfaz ligera para probar listado, detalle, busqueda y
          autocomplete contra tu base real.
        </p>
      </section>

      <section className="workspace">
        <aside className="panel search-panel">
          <label className="field-label" htmlFor="search-input">
            Buscar productos
          </label>
          <input
            id="search-input"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Escribe laptop, monitor, usb-c..."
          />

          <div className="status-row">
            <span>{statsLabel}</span>
            <button className="ghost-button" onClick={() => setQuery('')}>
              Limpiar
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  className="suggestion-chip"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <div className="product-list">
            {products.map((product) => (
              <button
                key={product.id}
                className={`product-card${
                  selectedProduct?.id === product.id ? ' active' : ''
                }`}
                onClick={() => void handleSelect(product.id)}
              >
                <span className="product-category">{product.category}</span>
                <strong>{product.title}</strong>
                <span>{product.description}</span>
              </button>
            ))}

            {!loading && products.length === 0 && (
              <div className="empty-state">
                No hay resultados para esa consulta.
              </div>
            )}
          </div>
        </aside>

        <section className="panel detail-panel">
          {selectedProduct ? (
            <>
              <p className="detail-label">Detalle seleccionado</p>
              <h2>{selectedProduct.title}</h2>
              <p className="detail-description">{selectedProduct.description}</p>

              <div className="detail-meta">
                <div>
                  <span className="meta-label">ID</span>
                  <strong>{selectedProduct.id}</strong>
                </div>
                <div>
                  <span className="meta-label">Categoria</span>
                  <strong>{selectedProduct.category}</strong>
                </div>
              </div>

              <div className="tags">
                {selectedProduct.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              Selecciona un producto para ver su detalle.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
