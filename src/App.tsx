import { useEffect, useMemo, useState, type FormEvent } from 'react';

type EquipmentStatus = 'available' | 'on_loan' | 'maintenance';
type Equipment = { id: string; assetTag: string; name: string; category: string; status: EquipmentStatus; imageUrl: string | null };
type Loan = { id: string; equipmentId: string; borrowedAt: string; dueAt: string; equipment: { id: string; name: string; assetTag: string; imageUrl: string | null } };
type Session = { access_token: string; user: { email?: string } };
const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const authUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const authKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const labels: Record<EquipmentStatus, string> = { available: 'Disponível', on_loan: 'Emprestado', maintenance: 'Em manutenção' };
const date = (value: string) => new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(value));

function Brand() {
  return <span className="brand" aria-label="Emprest.AI"><span className="brand-mark" aria-hidden="true"><span /></span><span className="brand-word">EMPREST<span>.AI</span></span></span>;
}

async function api<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  if (!apiUrl) throw new Error('O endereço da API não foi configurado.');
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(typeof body?.message === 'string' ? body.message : 'Não foi possível concluir a operação. Tente novamente.');
  return body as T;
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [page, setPage] = useState<'catalog' | 'loans'>('catalog');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | EquipmentStatus>('all');
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);

  const refresh = async (token: string) => {
    const [items, activeLoans] = await Promise.all([api<Equipment[]>('/equipment', token), api<Loan[]>('/loans', token)]);
    setEquipment(items); setLoans(activeLoans);
  };
  useEffect(() => {
    if (!session) return;
    let active = true;
    setLoading(true); setNotice('');
    Promise.all([api<Equipment[]>('/equipment', session.access_token), api<Loan[]>('/loans', session.access_token)])
      .then(([items, activeLoans]) => { if (active) { setEquipment(items); setLoans(activeLoans); } })
      .catch((error: unknown) => { if (active) setNotice(error instanceof Error ? error.message : 'Não foi possível carregar os dados.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session]);
  const visible = useMemo(() => equipment.filter((item) => (filter === 'all' || item.status === filter) && `${item.name} ${item.assetTag}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))), [equipment, filter, query]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setNotice('');
    if (!authUrl || !authKey) { setNotice('O acesso não foi configurado.'); return; }
    const form = new FormData(event.currentTarget);
    setLoginBusy(true);
    try {
      const response = await fetch(`${authUrl}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: authKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      if (!response.ok) throw new Error('Não foi possível entrar. Confira seu e-mail e sua senha.');
      const result = await response.json() as Session;
      if (!result.access_token || !result.user) throw new Error('Resposta de autenticação inválida.');
      setSession(result); setPage('catalog');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível entrar.'); }
    finally { setLoginBusy(false); }
  }
  async function signOut() {
    const token = session?.access_token;
    setSession(null); setEquipment([]); setLoans([]); setNotice(''); setSelected(null);
    if (token && authUrl && authKey) {
      try { await fetch(`${authUrl}/auth/v1/logout`, { method: 'POST', headers: { apikey: authKey, Authorization: `Bearer ${token}` } }); } catch { /* The local session has already been cleared. */ }
    }
  }
  async function requestLoan() {
    if (!session || !selected || requesting) return;
    setRequesting(true); setNotice('');
    try {
      const result = await api<Loan>('/loans', session.access_token, { method: 'POST', body: JSON.stringify({ equipmentId: selected.id }) });
      setSelected(null);
      try { await refresh(session.access_token); setNotice(`Empréstimo registrado. Devolução prevista: ${date(result.dueAt)}.`); }
      catch { setNotice('Empréstimo registrado, mas não foi possível atualizar a lista. Entre novamente para consultar.'); }
    } catch (error) { setSelected(null); setNotice(error instanceof Error ? error.message : 'Não foi possível solicitar o empréstimo.'); try { await refresh(session.access_token); } catch { /* Keep the original error visible. */ } }
    finally { setRequesting(false); }
  }

  if (!session) return (
    <main className="login-shell" id="inicio"><section className="welcome-panel" aria-labelledby="welcome-title"><div className="welcome-glow" aria-hidden="true" /><div className="welcome-content"><Brand /><div className="welcome-copy"><p className="eyebrow">Equipamentos de TI, sem planilhas</p><h1 id="welcome-title">Tudo no lugar.<br />Todo mundo conectado.</h1><p className="welcome-lead">Encontre o que precisa, acompanhe seus empréstimos e deixe a operação fluir.</p></div><dl className="stat-list" aria-label="Regras rápidas de empréstimo"><div className="stat"><dt>itens por pessoa</dt><dd>5</dd></div><div className="stat"><dt>dias úteis de prazo</dt><dd>14</dd></div><div className="stat"><dt>linhas para preencher</dt><dd>0</dd></div></dl><p className="welcome-footer">Operações · TI interno</p></div></section><section className="form-panel" aria-labelledby="login-title"><div className="login-card"><div className="form-heading"><p className="eyebrow">Acesso ao seu espaço</p><h2 id="login-title">Entrar</h2><p>Use seu e-mail para continuar.</p></div><form className="login-form" onSubmit={login}><div className="field"><label htmlFor="email">E-mail</label><input autoComplete="username" id="email" name="email" type="email" required /></div><div className="field"><label htmlFor="password">Senha</label><input autoComplete="current-password" id="password" name="password" type="password" required /></div><button className="button button-primary" type="submit" disabled={loginBusy}>{loginBusy ? 'Entrando...' : 'Entrar'} <span aria-hidden="true">↗</span></button></form><p className="privacy-note">Cada pessoa vê apenas os próprios empréstimos.</p><p className="form-notice" role="alert">{notice}</p></div></section></main>
  );
  return <main className="app-shell"><header className="app-nav"><div className="nav-inner"><Brand /><nav className="nav-tabs" aria-label="Navegação principal"><button className={`nav-tab${page === 'catalog' ? ' is-active' : ''}`} type="button" onClick={() => setPage('catalog')} aria-current={page === 'catalog' ? 'page' : undefined}>Catálogo</button><button className={`nav-tab${page === 'loans' ? ' is-active' : ''}`} type="button" onClick={() => setPage('loans')} aria-current={page === 'loans' ? 'page' : undefined}>Meus empréstimos</button></nav><div className="nav-user"><span className="user-name">{session.user.email}</span><button className="sign-out" type="button" onClick={signOut}>Sair</button></div></div></header>
    <section className="catalog-page" aria-labelledby="page-title"><div className="catalog-heading"><div><p className="page-kicker">EMPREST.AI / EQUIPAMENTOS</p><h1 id="page-title">{page === 'catalog' ? 'Catálogo' : 'Meus empréstimos'}</h1><p className="page-subtitle">{page === 'catalog' ? `${equipment.filter((item) => item.status === 'available').length} de ${equipment.length} equipamentos disponíveis agora` : `${loans.length} de 5 empréstimos em aberto · prazo padrão de 14 dias úteis`}</p></div>{page === 'catalog' && <label className="search-field"><span className="sr-only">Buscar por nome ou patrimônio</span><input type="search" placeholder="Buscar equipamento..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>}</div>
    {notice && <p className="operation-notice" role="status">{notice}</p>}{loading ? <p role="status">Carregando...</p> : page === 'catalog' ? <><div className="catalog-toolbar"><div className="filter-list" role="group" aria-label="Filtrar equipamentos por situação">{([{id:'all',label:'Todos'}, {id:'available',label:'Disponíveis'}, {id:'on_loan',label:'Emprestados'}, {id:'maintenance',label:'Em manutenção'}] as const).map((option) => <button className={`filter-chip${filter === option.id ? ' is-selected' : ''}`} key={option.id} onClick={() => setFilter(option.id)} type="button" aria-pressed={filter === option.id}>{option.label}</button>)}</div><p className="catalog-result-count">{visible.length} itens</p></div><div className="equipment-grid">{visible.map((item) => <article className="equipment-card" key={item.id}>{item.imageUrl && <img className="equipment-photo" src={item.imageUrl} alt={`Foto de ${item.name}`} />}<div className="equipment-card-topline"><span className="equipment-category">{item.category}</span><span className={`status-pill status-${item.status}`}>{labels[item.status]}</span></div><h2>{item.name}</h2><p className="asset-tag">Patrimônio · {item.assetTag}</p><button className={`button catalog-action ${item.status === 'available' ? 'button-primary' : 'button-secondary'}`} disabled={item.status !== 'available'} onClick={() => setSelected(item)} type="button">{item.status === 'available' ? 'Solicitar empréstimo' : labels[item.status]}</button></article>)}</div>{!visible.length && <p>Nenhum equipamento encontrado.</p>}<p className="photo-credit">Fotos: <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a></p></> : <>{loans.length ? <div className="equipment-grid">{loans.map((loan) => <article className="equipment-card" key={loan.id}>{loan.equipment.imageUrl && <img className="equipment-photo" src={loan.equipment.imageUrl} alt={`Foto de ${loan.equipment.name}`} />}<h2>{loan.equipment.name}</h2><p className="asset-tag">Patrimônio · {loan.equipment.assetTag}</p><p>Devolução prevista: {date(loan.dueAt)}</p></article>)}</div> : <p>Você não tem empréstimos em aberto.</p>}{loans.length > 0 && <p className="photo-credit">Fotos: <a href="https://pixabay.com" target="_blank" rel="noreferrer">Pixabay</a></p>}</>}
    </section>{selected && <div className="modal-backdrop" onClick={() => !requesting && setSelected(null)}><section aria-labelledby="request-modal-title" aria-modal="true" className="confirm-modal" onClick={(event) => event.stopPropagation()} role="dialog"><p className="page-kicker">SOLICITAÇÃO DE EMPRÉSTIMO</p><h2 id="request-modal-title">Confirmar solicitação?</h2><p className="modal-copy">{selected.name} será associado ao seu nome. O prazo é de 14 dias úteis.</p><div className="modal-actions"><button className="button button-quiet" onClick={() => setSelected(null)} disabled={requesting} type="button">Cancelar</button><button className="button button-primary modal-confirm" onClick={requestLoan} disabled={requesting} type="button">{requesting ? 'Solicitando...' : 'Confirmar solicitação'}</button></div></section></div>}</main>;
}
export default App;
