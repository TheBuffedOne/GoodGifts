import { useState } from 'react'
// @ts-ignore
import './App.css'
// @ts-ignore
import BirthdayBoard from './BirthdayBoard/BirthdayBoard.jsx'

const navigationItems = [
  { id: 'birthday', label: 'Birthday board', icon: 'cake.svg' },
  { id: 'my-settings', label: 'My settings', icon: 'settings.svg' },
  { id: 'member-settings', label: 'Member settings', icon: 'users.svg' },
]

function App() {
  const [activeView, setActiveView] = useState('login')

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">
          <img
            className="sidebar-title-icon"
            src="https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/gift.svg"
            alt=""
          />
          GoodGift
        </h2>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <button
              className={`sidebar-button${activeView === item.id ? ' is-selected' : ''}`}
              type="button"
              key={item.id}
              aria-current={activeView === item.id ? 'page' : undefined}
              onClick={() => setActiveView(item.id)}
            >
              <img
                className="sidebar-button-icon"
                src={`https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/${item.icon}`}
                alt=""
              />
              {item.label}
            </button>
          ))}
        </nav>

        <section className="sidebar-account" aria-label="My account">
          <button className="sidebar-account-button" type="button" aria-label="Account: Unknown">
            <img
              className="sidebar-account-avatar"
              src="https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/user-round.svg"
              alt=""
            />
            <span className="sidebar-account-name">Unknown</span>
          </button>
          <button className="sidebar-account-auth" type="button">Anmelden</button>
        </section>
      </aside>

      <main className="main-screen">
        {activeView === 'birthday' ? (
          <BirthdayBoard />
        ) : activeView === 'login' ? (
          <form className="login-window" onSubmit={(event) => event.preventDefault()}>
            <h1>User Login</h1>
            <label htmlFor="login-username">Username</label>
            <input id="login-username" name="username" type="text" autoComplete="username" required />
            <button className="login-submit" type="submit">Login</button>
          </form>
        ) : (
          <section className="placeholder-view">
            <h1>{navigationItems.find((item) => item.id === activeView)?.label}</h1>
            <p>This section is not available yet.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
