import { useMemo, useState } from "react";

type Page = "home" | "games" | "inventory" | "referrals" | "bonuses" | "profile" | "owner";
type Item = { name: string; rarity: string; value: number; icon: string };

const initialItems: Item[] = [
  { name: "Caylusaurus", rarity: "LEGENDARY", value: 420, icon: "🦖" },
  { name: "Steakini Fatini", rarity: "EPIC", value: 180, icon: "🥩" },
];

const cases = [
  { name: "Снежный", price: 100, icon: "❄️", color: "ice", desc: "Зимняя коллекция" },
  { name: "Санта", price: 250, icon: "🎅", color: "red", desc: "Подарки из мешка" },
  { name: "Ледяной микс", price: 500, icon: "🧊", color: "violet", desc: "Редкие Brainrots" },
];

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "⌂" },
  { id: "games", label: "Игры", icon: "♜" },
  { id: "inventory", label: "Инвентарь", icon: "▣" },
  { id: "referrals", label: "Рефералы", icon: "♧" },
  { id: "bonuses", label: "Бонусы", icon: "✦" },
];

function App() {
  const [page, setPage] = useState<Page>("home");
  const [theme, setTheme] = useState<"winter" | "classic">("winter");
  const [balance, setBalance] = useState(1200);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [notice, setNotice] = useState("");
  const [username, setUsername] = useState("Player_001");
  const [lastDrop, setLastDrop] = useState<Item | null>(null);
  const [gameResult, setGameResult] = useState("");

  const totalValue = useMemo(() => items.reduce((sum, item) => sum + item.value, 0), [items]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function openCase(price: number, caseName: string) {
    if (balance < price) {
      notify("Недостаточно демо-монет");
      return;
    }
    setBalance((v) => v - price);
    const pool: Item[] = [
      { name: "Sammyni Fatini", rarity: "RARE", value: 90, icon: "🍖" },
      { name: "Caylusaurus", rarity: "LEGENDARY", value: 420, icon: "🦖" },
      { name: "Los Admins", rarity: "EPIC", value: 210, icon: "👑" },
      { name: "Sammyni Spookyni", rarity: "MYTHIC", value: 650, icon: "👻" },
    ];
    const drop = pool[Math.floor(Math.random() * pool.length)];
    setLastDrop(drop);
    setItems((current) => [drop, ...current]);
    notify(`Кейс «${caseName}»: выпал ${drop.name}`);
  }

  function playDemo(game: string) {
    const win = Math.random() > 0.48;
    if (win) {
      setBalance((v) => v + 50);
      setGameResult(`${game}: демо-раунд выигран! +50 монет`);
    } else {
      setGameResult(`${game}: демо-раунд завершён. Попробуй ещё раз.`);
    }
  }

  return (
    <div className={`app ${theme}`}>
      <div className="snow snow-one">✦　❄　✧　❄　✦　❅　✧</div>
      <div className="snow snow-two">❄　✧　❅　✦　❄　✧　❅</div>
      <header className="topbar">
        <button className="brand" onClick={() => setPage("home")} aria-label="BrainRush home">
          <span className="brand-mark">B</span>
          <span>BRAIN<span className="brand-accent">RUSH</span><small>WINTER UPDATE</small></span>
        </button>
        <div className="top-actions">
          <div className="balance"><span>🪙</span><b>{balance.toLocaleString("ru-RU")}</b><small>DEMO</small></div>
          <button className="avatar" onClick={() => setPage("profile")} title="Профиль">🧑‍🚀</button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="side-label">МЕНЮ</div>
          {navItems.map((item) => (
            <button key={item.id} className={`nav-link ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
          <div className="side-divider" />
          <button className={`nav-link ${page === "profile" ? "active" : ""}`} onClick={() => setPage("profile")}><span>♙</span>Профиль</button>
          <button className={`nav-link ${page === "owner" ? "active" : ""}`} onClick={() => setPage("owner")}><span>⚙</span>OWNER UI</button>
          <div className="sidebar-bottom">
            <div className="online-dot" /> Система работает
            <small>BrainRush v1.0 · Demo</small>
          </div>
        </aside>

        <main className="content">
          {page === "home" && <Home onOpen={openCase} lastDrop={lastDrop} />}
          {page === "games" && <Games onPlay={playDemo} result={gameResult} />}
          {page === "inventory" && <Inventory items={items} totalValue={totalValue} />}
          {page === "referrals" && <Referrals notify={notify} />}
          {page === "bonuses" && <Bonuses notify={notify} />}
          {page === "profile" && <Profile username={username} setUsername={setUsername} items={items.length} balance={balance} />}
          {page === "owner" && <Owner />}
        </main>
      </div>

      <footer className="mobile-nav">
        {navItems.slice(0, 5).map((item) => (
          <button key={item.id} className={page === item.id ? "selected" : ""} onClick={() => setPage(item.id)}>
            <span>{item.icon}</span><small>{item.label}</small>
          </button>
        ))}
      </footer>
      <button className="theme-switch" onClick={() => setTheme(theme === "winter" ? "classic" : "winter")}>
        {theme === "winter" ? "❄ Winter" : "◈ Classic Neon"}
      </button>
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <div className="page-heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{subtitle}</p></div>;
}

function Home({ onOpen, lastDrop }: { onOpen: (price: number, name: string) => void; lastDrop: Item | null }) {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <div className="pill"><span className="pulse" /> WINTER UPDATE 2026</div>
        <h1>Поймай свой<br /><em>BrainRush</em></h1>
        <p>Открывай коллекции, собирай Brainrots и исследуй зимний мир.</p>
        <div className="hero-buttons"><a href="#cases" className="primary-btn">Открыть кейсы <span>↗</span></a><span className="hero-note">❄ Зимняя коллекция уже здесь</span></div>
      </div>
      <div className="hero-art"><div className="orb orb-a" /><div className="orb orb-b" /><div className="mascot">🧠</div><div className="hero-snow">❄</div><div className="hero-tag">BRAIN<br />POWER</div></div>
      <div className="hero-glow" />
    </section>

    <div className="stats-row">
      <Stat icon="🎁" value="03" label="Зимних кейса" />
      <Stat icon="🧩" value="24+" label="Brainrots в коллекции" />
      <Stat icon="⚡" value="24/7" label="Демо-режим" />
    </div>

    <section id="cases" className="section">
      <div className="section-head"><div><div className="eyebrow">ТВОЯ СЛЕДУЮЩАЯ НАХОДКА</div><h2>Зимние кейсы</h2></div><span className="live-tag">● DEMO</span></div>
      <div className="case-grid">
        {cases.map((c) => <article className={`case-card ${c.color}`} key={c.name}>
          <div className="case-top"><span className="case-chip">BRAINRUSH DROP</span><span className="case-spark">✧</span></div>
          <div className="case-emoji">{c.icon}</div>
          <h3>{c.name}</h3><p>{c.desc}</p>
          <div className="case-bottom"><span>🪙 {c.price}</span><button onClick={() => onOpen(c.price, c.name)}>Открыть <b>↗</b></button></div>
        </article>)}
      </div>
      {lastDrop && <div className="drop-result"><span className="drop-icon">{lastDrop.icon}</span><div><small>ПОСЛЕДНИЙ ДРОП</small><b>{lastDrop.name}</b><span>{lastDrop.rarity} · оценка {lastDrop.value} demo</span></div></div>}
    </section>
  </>;
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return <div className="stat-card"><span>{icon}</span><div><b>{value}</b><small>{label}</small></div></div>;
}

function Games({ onPlay, result }: { onPlay: (game: string) => void; result: string }) {
  const games = [
    { name: "Апгрейдер", desc: "Демо-улучшение предметов", icon: "⬆️", tag: "UPGRADE" },
    { name: "Дайсы", desc: "Проверь удачу в раунде", icon: "🎲", tag: "DICE" },
    { name: "Мины", desc: "Найди безопасные клетки", icon: "💣", tag: "MINES" },
    { name: "Краш", desc: "Следи за полётом Санты", icon: "🛷", tag: "CRASH" },
  ];
  return <><PageHeading eyebrow="ARCADE ZONE" title="Игровая зона" subtitle="Играй в демонстрационные режимы за виртуальные монеты. Реальные ставки отключены." />
    <div className="games-grid">{games.map((g) => <article className="game-card" key={g.name}><div className="game-icon">{g.icon}</div><span className="game-tag">{g.tag}</span><h3>{g.name}</h3><p>{g.desc}</p><button className="secondary-btn" onClick={() => onPlay(g.name)}>Играть в демо <span>→</span></button></article>)}</div>
    {result && <div className="notice-panel">{result}</div>}
  </>;
}

function Inventory({ items, totalValue }: { items: Item[]; totalValue: number }) {
  return <><PageHeading eyebrow="YOUR COLLECTION" title="Инвентарь" subtitle="Твои найденные Brainrots и их демонстрационная оценка." />
    <div className="inventory-summary"><div><small>ПРЕДМЕТОВ</small><b>{items.length}</b></div><div><small>ОБЩАЯ ДЕМО-ОЦЕНКА</small><b>{totalValue.toLocaleString("ru-RU")}</b></div></div>
    <div className="item-grid">{items.map((item, i) => <div className="item-card" key={`${item.name}-${i}`}><div className="item-art">{item.icon}</div><span className={`rarity ${item.rarity.toLowerCase()}`}>{item.rarity}</span><b>{item.name}</b><small>Оценка: {item.value} demo</small></div>)}</div>
  </>;
}

function Referrals({ notify }: { notify: (s: string) => void }) {
  return <><PageHeading eyebrow="INVITE & GROW" title="Реферальный кабинет" subtitle="Приглашай друзей в BrainRush. Здесь показан демонстрационный пример статистики." />
    <div className="ref-link-card"><div><small>ТВОЯ РЕФЕРАЛЬНАЯ ССЫЛКА</small><b>t.me/BrainRushBot?start=DEMO001</b></div><button className="primary-btn" onClick={() => { navigator.clipboard?.writeText("https://t.me/BrainRushBot?start=DEMO001"); notify("Демо-ссылка скопирована"); }}>Копировать ↗</button></div>
    <div className="stats-row referral-stats"><Stat icon="👥" value="12" label="Приглашено (демо)" /><Stat icon="🪙" value="340" label="Демо-доход" /><Stat icon="％" value="5%" label="Пример RevShare" /></div>
    <div className="panel"><h3>Уровень партнёра</h3><div className="level-line"><span>Starter</span><b>12 / 100 приглашений</b></div><div className="progress"><i style={{ width: "12%" }} /></div><p className="muted">Реальные реферальные начисления появятся после подключения защищённого backend.</p></div>
  </>;
}

function Bonuses({ notify }: { notify: (s: string) => void }) {
  const bonusList = [
    { icon: "🎁", title: "Ежедневный подарок", desc: "Демо-бонус за ежедневный вход", status: "ДОСТУПЕН" },
    { icon: "❄️", title: "Зимний бонус", desc: "Подарок зимнего события", status: "СКОРО" },
    { icon: "👥", title: "Реферальный кейс", desc: "Награда за приглашение друга", status: "ЗАБЛОКИРОВАН" },
  ];
  return <><PageHeading eyebrow="FREE REWARDS" title="Бонусы" subtitle="Забирай доступные демонстрационные награды." />
    <div className="bonus-list">{bonusList.map((b) => <div className="bonus-card" key={b.title}><div className="bonus-icon">{b.icon}</div><div className="bonus-copy"><b>{b.title}</b><p>{b.desc}</p></div><button className="secondary-btn" onClick={() => notify(b.status === "ДОСТУПЕН" ? "Демо-бонус получен!" : "Пока недоступно")}>{b.status === "ДОСТУПЕН" ? "Забрать" : b.status}</button></div>)}</div>
  </>;
}

function Profile({ username, setUsername, items, balance }: { username: string; setUsername: (s: string) => void; items: number; balance: number }) {
  return <><PageHeading eyebrow="PLAYER PROFILE" title="Профиль" subtitle="Настройки и сводка аккаунта." />
    <div className="profile-card"><div className="profile-avatar">🧑‍🚀</div><div className="profile-info"><small>TELEGRAM PLAYER · DEMO</small><h2>{username}</h2><p>Участник BrainRush</p></div><span className="verified">● DEMO</span></div>
    <div className="panel"><label className="field-label">Отображаемое имя</label><input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={24} /><div className="profile-metrics"><div><small>ДЕМО-БАЛАНС</small><b>{balance.toLocaleString("ru-RU")}</b></div><div><small>ПРЕДМЕТОВ</small><b>{items}</b></div><div><small>СТАТУС</small><b>Игрок</b></div></div></div>
  </>;
}

function Owner() {
  const modules = ["Пользователи", "Кейсы и категории", "Каталог Brainrots", "Промокоды", "Пополнения", "Выводы (отключено)", "Игры и RTP", "Бонусы", "Розыгрыши", "Квесты", "FAQ", "Журнал действий"];
  return <><PageHeading eyebrow="CONTROL CENTER · UI PREVIEW" title="OWNER Panel" subtitle="Макет панели управления. Это не защищённая админка: доступ и действия пока демонстрационные." />
    <div className="owner-warning">⚠️ OWNER UI PREVIEW — не вводи здесь секреты и не используй для управления реальными балансами.</div>
    <div className="owner-grid">{modules.map((m, i) => <div className="owner-module" key={m}><span>{["♙","▦","🧠","％","↗","⛔","🎮","✦","🎁","✓","?","☷"][i]}</span><b>{m}</b><small>Открыть модуль →</small></div>)}</div>
  </>;
}

export default App;
