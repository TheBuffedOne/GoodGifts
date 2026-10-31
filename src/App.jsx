import { useState } from 'react'
import './App.css'
import BirthdayBoard from './BirthdayBoard/BirthdayBoard.jsx'
import { people } from './BirthdayBoard/people.js'
import MySettings from './MySettings/MySettings.jsx'
import MemberSettings from './MemberSettings/MemberSettings.jsx'

const navigationItems = [
  { id: 'birthday', label: 'Birthday board', icon: 'cake.svg' },
  { id: 'my-settings', label: 'My settings', icon: 'settings.svg' },
  { id: 'member-settings', label: 'Member settings', icon: 'users.svg' },
]

function App() {
  const [activeView, setActiveView] = useState('login')
  const [accountName, setAccountName] = useState('Unknown')
  const [loginError, setLoginError] = useState('')
  const isAuthenticated = accountName !== 'Unknown'
  const account = people.find((person) => person.name === accountName)

  const handleLogin = (event) => {
    event.preventDefault()
    const username = new FormData(event.currentTarget).get('username')
    const name = typeof username === 'string' ? username.trim() : ''
    const person = people.find((entry) => entry.name.toLowerCase() === name.toLowerCase())

    if (!name) {
      return
    }

    if (!person) {
      setLoginError('Der Name existiert nicht.')
      return
    }

    setLoginError('')
    setAccountName(person.name)
    setActiveView('birthday')
  }

  const handleLogout = () => {
    setAccountName('Unknown')
    setActiveView('login')
  }

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
              onClick={() => setActiveView(isAuthenticated ? item.id : 'login')}
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
          <button
            className="sidebar-account-button"
            type="button"
            aria-label={`Account: ${accountName}`}
            onClick={() => setActiveView(isAuthenticated ? 'my-settings' : 'login')}
          >
            <img
              className={`sidebar-account-avatar${isAuthenticated ? ' is-photo' : ''}`}
              src={isAuthenticated && account
                ? `https://i.pravatar.cc/80?img=${account.avatar}`
                : 'https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/user-round.svg'}
              alt=""
            />
            <span className="sidebar-account-name">{accountName}</span>
          </button>
          <button
            className="sidebar-account-auth"
            type="button"
            onClick={isAuthenticated ? handleLogout : () => setActiveView('login')}
          >
            {isAuthenticated ? 'Abmelden' : 'Anmelden'}
          </button>
        </section>
      </aside>

      <main className="main-screen">
        {activeView === 'birthday' ? (
          <BirthdayBoard accountName={accountName} />
        ) : activeView === 'my-settings' ? (
          <MySettings accountName={accountName} />
        ) : activeView === 'member-settings' ? (
          <MemberSettings accountName={accountName} onOpenMySettings={() => setActiveView('my-settings')} />
        ) : activeView === 'login' ? (
          <form className="login-window" onSubmit={handleLogin}>
            <h1>User Login</h1>
            <label htmlFor="login-username">Username</label>
            <input id="login-username" name="username" type="text" autoComplete="username" required />
            {loginError && <p className="login-error" role="alert">{loginError}</p>}
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
