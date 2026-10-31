import { useState } from 'react'
import { people } from '../FixData/people.js'
import PreferencesCard from './PreferencesCard.jsx'
import ProfileCard from './ProfileCard.jsx'
import { MONTH_NAMES_EN } from '../FixData/months.js'

function createInitialSettings(accountName) {
  const person = people.find((entry) => entry.name === accountName)
  const [day, germanMonth] = (person?.birthday ?? '24. Juni').replace('.', '').split(' ')

  return {
    displayName: person?.name ?? accountName,
    day,
    month: MONTH_NAMES_EN[germanMonth] ?? 'June',
    avatar: person ? `https://i.pravatar.cc/160?img=${person.avatar}` : 'https://i.pravatar.cc/160?img=47',
    noGos: [],
    notes: '',
  }
}

function MySettings({ accountName }) {
  const [settings, setSettings] = useState(() => createInitialSettings(accountName))
  const [savedSettings, setSavedSettings] = useState(() => createInitialSettings(accountName))
  const [activeTab, setActiveTab] = useState('profile')

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: value }))
  }

  function saveSettings() {
    setSavedSettings({ ...settings, noGos: [...settings.noGos] })
  }

  function cancelChanges() {
    setSettings({ ...savedSettings, noGos: [...savedSettings.noGos] })
  }

  return (
    <section className="my-settings" aria-labelledby="my-settings-title">
      <header className="settings-heading">
        <p className="settings-eyebrow">YOUR OWN LITTLE CORNER</p>
        <h1 id="my-settings-title">Make it feel like you.</h1>
        <p>Your photo, your birthday, and a few helpful boundaries for your friends.</p>
      </header>

      <div className="settings-tabs" role="tablist" aria-label="Settings sections">
        <button
          className={`settings-tab${activeTab === 'profile' ? ' is-active' : ''}`}
          id="profile-tab"
          type="button"
          role="tab"
          aria-selected={activeTab === 'profile'}
          aria-controls="profile-panel"
          onClick={() => setActiveTab('profile')}
        >
          Profile &amp; preferences
        </button>
        <button
            className={`settings-tab${activeTab === 'change password' ? ' is-active' : ''}`}
            id="change password"
            type="button"
            role="tab"
            aria-selected={activeTab === 'change password'}
            aria-controls="change password"
            onClick={() => setActiveTab('change password')}
        >
          change Password
        </button>
      </div>

        <div className="settings-panel" id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
          <ProfileCard
            profile={settings}
            defaultAvatar={createInitialSettings(accountName).avatar}
            onChange={updateSetting}
          />
          <PreferencesCard
            noGos={settings.noGos}
            notes={settings.notes}
            onNoGosChange={(noGos) => updateSetting('noGos', noGos)}
            onNotesChange={(notes) => updateSetting('notes', notes)}
          />
          <div className="settings-actions">
            <button className="settings-cancel" type="button" onClick={cancelChanges}>Cancel</button>
            <button className="settings-save" type="button" onClick={saveSettings}>Save changes</button>
          </div>
        </div>
    </section>
  )
}

export default MySettings
