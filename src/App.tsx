import { useEffect, useMemo, useState, type FormEvent } from 'react';

type Role = 'Colaborador' | 'Operações';
type EquipmentStatus = 'available' | 'loaned' | 'maintenance';
type CatalogFilter = 'all' | EquipmentStatus;

type Equipment = {
  id: string;
  name: string;
  category: string;
  assetTag: string;
  status: EquipmentStatus;
  holder?: string;
  dueDate?: string;
  note?: string;
};

const demoToday = new Date(2026, 7, 31);
const demoUser = 'Ana Ribeiro';

const initialEquipment: Equipment[] = [
  {
    id: 'ti-0142',
    name: 'Notebook Dell Latitude 5450',
    category: 'Notebook',
    assetTag: 'TI-0142',
    status: 'available',
  },
  {
    id: 'ti-0088',
    name: 'MacBook Pro 14 M3',
    category: 'Notebook',
    assetTag: 'TI-0088',
    status: 'loaned',
    holder: 'Marcos Lemos',
    dueDate: '07/09/2026',
  },
  {
    id: 'ti-0231',
    name: 'Monitor LG 27” 4K',
    category: 'Monitor',
    assetTag: 'TI-0231',
    status: 'available',
  },
  {
    id: 'ti-0233',
    name: 'Monitor Dell 24” FHD',
    category: 'Monitor',
    assetTag: 'TI-0233',
    status: 'maintenance',
    note: 'Painel com falha, retorna em 05/09',
  },
  {
    id: 'ti-0301',
    name: 'Câmera Sony ZV-1',
    category: 'Câmera',
    assetTag: 'TI-0301',
    status: 'loaned',
    holder: demoUser,
    dueDate: '12/09/2026',
  },
  {
    id: 'ti-0455',
    name: 'Cabo HDMI 2.1 3m',
    category: 'Cabo',
    assetTag: 'TI-0455',
    status: 'available',
  },
  {
    id: 'ti-0512',
    name: 'Dock Thunderbolt 4',
    category: 'Acessório',
    assetTag: 'TI-0512',
    status: 'loaned',
    holder: demoUser,
    dueDate: '05/09/2026',
  },
  {
    id: 'ti-0318',
    name: 'Tripé Manfrotto Befree',
    category: 'Acessório',
    assetTag: 'TI-0318',
    status: 'maintenance',
    note: 'Trava do centro quebrada',
  },
  {
    id: 'ti-0402',
    name: 'Headset Jabra Evolve2',
    category: 'Acessório',
    assetTag: 'TI-0402',
    status: 'available',
  },
];

const filters: { id: CatalogFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'available', label: 'Disponíveis' },
  { id: 'loaned', label: 'Emprestados' },
  { id: 'maintenance', label: 'Em manutenção' },
];

const statusLabels: Record<EquipmentStatus, string> = {
  available: 'Disponível',
  loaned: 'Emprestado',
  maintenance: 'Em manutenção',
};

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

function Brand() {
  return (
    <span className="brand" aria-label="Emprest.AI">
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span className="brand-word">
        EMPREST<span>.AI</span>
      </span>
    </span>
  );
}

function App() {
  const [screen, setScreen] = useState<'login' | 'catalog'>('login');
  const [role, setRole] = useState<Role>('Colaborador');
  const [notice, setNotice] = useState('');
  const [equipment, setEquipment] = useState(initialEquipment);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [toast, setToast] = useState('');

  const myActiveLoans = equipment.filter(
    (item) => item.status === 'loaned' && item.holder === demoUser,
  );
  const hasOverdueLoan = myActiveLoans.some((item) => {
    if (!item.dueDate) return false;
    const [day, month, year] = item.dueDate.split('/').map(Number);
    return new Date(year, month - 1, day) < demoToday;
  });
  const availableCount = equipment.filter((item) => item.status === 'available').length;

  const visibleEquipment = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('pt-BR');

    return equipment.filter((item) => {
      const matchesFilter = filter === 'all' || item.status === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item.name} ${item.assetTag}`.toLocaleLowerCase('pt-BR').includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [equipment, filter, query]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    if (!selectedEquipment) return undefined;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectedEquipment(null);
    }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedEquipment]);

  function enterDemo(nextRole: Role) {
    setRole(nextRole);
    setScreen('catalog');
    setNotice('');
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    enterDemo('Colaborador');
  }

  function requestButtonLabel(item: Equipment) {
    if (item.status === 'maintenance') return 'Indisponível';
    if (item.status === 'loaned') {
      return item.holder === demoUser ? 'Está com você' : 'Emprestado';
    }
    if (hasOverdueLoan) return 'Bloqueado por atraso';
    if (myActiveLoans.length >= 3) return 'Limite de 3 itens';
    return 'Solicitar empréstimo';
  }

  function isRequestDisabled(item: Equipment) {
    return (
      item.status !== 'available' ||
      hasOverdueLoan ||
      myActiveLoans.length >= 3
    );
  }

  function confirmRequest() {
    if (!selectedEquipment || isRequestDisabled(selectedEquipment)) return;
    const dueDate = formatDate(addDays(demoToday, 14));
    setEquipment((current) =>
      current.map((item) =>
        item.id === selectedEquipment.id
          ? { ...item, status: 'loaned', holder: demoUser, dueDate }
          : item,
      ),
    );
    setSelectedEquipment(null);
    setToast(`${selectedEquipment.name} solicitado. Devolução até ${dueDate}.`);
  }

  if (screen === 'catalog') {
    return (
      <main className="app-shell">
        <header className="app-nav">
          <div className="nav-inner">
            <Brand />
            <nav className="nav-tabs" aria-label="Navegação principal">
              <button className="nav-tab is-active" type="button" aria-current="page">
                Catálogo
              </button>
              <button className="nav-tab" type="button" disabled title="Disponível na próxima etapa">
                Meus empréstimos
              </button>
              {role === 'Operações' && (
                <>
                  <button className="nav-tab" type="button" disabled title="Disponível na próxima etapa">
                    Operações
                  </button>
                  <button className="nav-tab" type="button" disabled title="Disponível na próxima etapa">
                    Equipamentos
                  </button>
                </>
              )}
            </nav>
            <div className="nav-user">
              <span className="role-tag">{role}</span>
              <span className="user-avatar" aria-hidden="true">AR</span>
              <span className="user-name">{demoUser}</span>
              <button className="sign-out" type="button" onClick={() => setScreen('login')}>
                Sair
              </button>
            </div>
          </div>
        </header>

        <section className="catalog-page" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <p className="page-kicker">EMPREST.AI / EQUIPAMENTOS</p>
              <h1 id="catalog-title">Catálogo</h1>
              <p className="page-subtitle">
                {availableCount} de {equipment.length} equipamentos disponíveis agora
              </p>
            </div>
            <label className="search-field">
              <span className="sr-only">Buscar por nome ou patrimônio</span>
              <svg aria-hidden="true" viewBox="0 0 20 20">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="m13 13 4 4" />
              </svg>
              <input
                type="search"
                placeholder="Buscar equipamento..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {hasOverdueLoan && (
            <aside className="overdue-banner" role="alert">
              <span className="alert-mark" aria-hidden="true">!</span>
              <span>Você tem um empréstimo em atraso. Regularize a devolução antes de solicitar outro item.</span>
              <button type="button" disabled title="Disponível na próxima etapa">Ver empréstimo →</button>
            </aside>
          )}

          <div className="catalog-toolbar">
            <div className="filter-list" role="group" aria-label="Filtrar equipamentos por situação">
              {filters.map((option) => (
                <button
                  className={`filter-chip${filter === option.id ? ' is-selected' : ''}`}
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  type="button"
                  aria-pressed={filter === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="catalog-result-count">
              {visibleEquipment.length} {visibleEquipment.length === 1 ? 'item' : 'itens'}
            </p>
          </div>

          {visibleEquipment.length > 0 ? (
            <div className="equipment-grid">
              {visibleEquipment.map((item, index) => {
                const buttonLabel = requestButtonLabel(item);
                const disabled = isRequestDisabled(item);
                return (
                  <article
                    className="equipment-card"
                    key={item.id}
                    style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}
                  >
                    <div className="equipment-card-topline">
                      <span className="equipment-category">{item.category}</span>
                      <span className={`status-pill status-${item.status}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {statusLabels[item.status]}
                      </span>
                    </div>
                    <h2>{item.name}</h2>
                    <p className="asset-tag">Patrimônio · {item.assetTag}</p>
                    <p className={`equipment-detail${item.status === 'maintenance' ? ' is-muted' : ''}`}>
                      {item.status === 'available' && 'Pronto para retirada no balcão'}
                      {item.status === 'loaned' && `Com ${item.holder} · devolver até ${item.dueDate}`}
                      {item.status === 'maintenance' && item.note}
                    </p>
                    <button
                      className={`button catalog-action${disabled ? ' button-secondary' : ' button-primary'}`}
                      disabled={disabled}
                      onClick={() => setSelectedEquipment(item)}
                      type="button"
                    >
                      {buttonLabel}
                      {!disabled && <span aria-hidden="true">→</span>}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="catalog-empty" role="status">
              <span className="empty-mark" aria-hidden="true">⌕</span>
              <h2>Nenhum equipamento encontrado</h2>
              <p>Tente outro nome, patrimônio ou filtro.</p>
              <button
                className="button button-quiet"
                type="button"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
              >
                Limpar busca e filtros
              </button>
            </div>
          )}
        </section>

        {selectedEquipment && (
          <div className="modal-backdrop" onClick={() => setSelectedEquipment(null)}>
            <section
              aria-labelledby="request-modal-title"
              aria-modal="true"
              className="confirm-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <p className="page-kicker">SOLICITAÇÃO DE EMPRÉSTIMO</p>
              <h2 id="request-modal-title">Confirmar solicitação?</h2>
              <p className="modal-copy">
                O equipamento ficará associado ao seu nome após a confirmação.
              </p>
              <dl className="modal-summary">
                <div>
                  <dt>Equipamento</dt>
                  <dd>{selectedEquipment.name}</dd>
                </div>
                <div>
                  <dt>Devolver até</dt>
                  <dd>{formatDate(addDays(demoToday, 14))}</dd>
                </div>
              </dl>
              <div className="modal-actions">
                <button className="button button-quiet" onClick={() => setSelectedEquipment(null)} type="button">
                  Cancelar
                </button>
                <button className="button button-primary modal-confirm" onClick={confirmRequest} type="button">
                  Confirmar solicitação
                </button>
              </div>
            </section>
          </div>
        )}

        {toast && <div className="toast-message" role="status">{toast}</div>}
      </main>
    );
  }

  return (
    <main className="login-shell" id="inicio">
      <section className="welcome-panel" aria-labelledby="welcome-title">
        <div className="welcome-glow" aria-hidden="true" />
        <div className="welcome-content">
          <Brand />
          <div className="welcome-copy">
            <p className="eyebrow">Equipamentos de TI, sem planilhas</p>
            <h1 id="welcome-title">
              Tudo no lugar.
              <br />
              Todo mundo conectado.
            </h1>
            <p className="welcome-lead">
              Encontre o que precisa, acompanhe seus empréstimos e deixe a operação fluir.
            </p>
          </div>
          <dl className="stat-list" aria-label="Regras rápidas de empréstimo">
            <div className="stat"><dt>itens por pessoa</dt><dd>3</dd></div>
            <div className="stat"><dt>dias de prazo</dt><dd>14</dd></div>
            <div className="stat"><dt>linhas para preencher</dt><dd>0</dd></div>
          </dl>
          <p className="welcome-footer">Operações · TI interno</p>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="login-title">
        <div className="login-card">
          <div className="form-heading">
            <p className="eyebrow">Acesso ao seu espaço</p>
            <h2 id="login-title">Entrar</h2>
            <p>Use seu e-mail corporativo para continuar.</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input autoComplete="username" id="email" name="email" placeholder="voce@empresa.com.br" type="email" required />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input autoComplete="current-password" id="password" name="password" placeholder="Digite sua senha" type="password" required />
            </div>
            <button className="button button-primary" type="submit">
              Entrar <span aria-hidden="true">↗</span>
            </button>
          </form>
          <div className="form-divider" aria-hidden="true"><span /><span>ou</span><span /></div>
          <button className="button button-operations" onClick={() => enterDemo('Operações')} type="button">
            Entrar como Operações <span aria-hidden="true">→</span>
          </button>
          <p className="privacy-note">
            <span className="privacy-icon" aria-hidden="true">◈</span>
            Cada pessoa vê apenas os próprios empréstimos.
          </p>
          <p className="form-notice" aria-live="polite">{notice}</p>
          <p className="demo-disclaimer">Demonstração local · sem autenticação ou persistência</p>
        </div>
      </section>
    </main>
  );
}

export default App;
