import {useEffect, useState} from 'react'
import PreferencesCard from './PreferencesCard.jsx'
import ProfileCard from './ProfileCard.jsx'
import {MONTH_NAMES_EN} from '../FixData/months.js'
import ChangePasswordCard from './ChangePasswordCard.jsx'

function createInitialSettings(account) {
    const [day, germanMonth] = (account?.birthday ?? '24. Juni').replace('.', '').split(' ')

    return {
        displayName: account?.name ?? '',
        day,
        month: MONTH_NAMES_EN[germanMonth] ?? 'June',
        avatar: account?.profileAvatar ?? `https://i.pravatar.cc/160?img=${account?.avatar ?? 47}`,
        noGos: account?.noGos ?? [],
        notes: account?.notes ?? '',
    }
}

function MySettings({account}) {
    const [settings, setSettings] = useState(() => createInitialSettings(account))
    const [savedSettings, setSavedSettings] = useState(() => createInitialSettings(account))
    const [activeTab, setActiveTab] = useState('profile')
    const [status, setStatus] = useState('')

    useEffect(() => {
        fetch(`/api/members?userId=${account.id}`).then((res) => res.json()).then((members) => {
            const user = members.find((member) => member.id === account.id)
            if (user) { const value = createInitialSettings(user); setSettings(value); setSavedSettings(value) }
        }).catch(() => setStatus('Profil konnte nicht geladen werden.'))
    }, [account.id])

    function updateSetting(key, value) {
        setSettings((current) => ({...current, [key]: value}))
    }

    async function saveSettings() {
        const monthNames = { January: 'Januar', February: 'Februar', March: 'Maerz', April: 'April', May: 'Mai', June: 'Juni', July: 'Juli', August: 'August', September: 'September', October: 'Oktober', November: 'November', December: 'Dezember' }
        const payload = { ...settings, birthday: `${settings.day}. ${monthNames[settings.month] ?? 'Juni'}` }
        const response = await fetch(`/api/members/${account.id}/profile`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const result = await response.json()
        if (!response.ok) { setStatus(result.error ?? 'Speichern fehlgeschlagen.'); return }
        setSavedSettings({...settings, noGos: [...settings.noGos]}); setStatus('Changes saved.')
    }

    function cancelChanges() {
        setSettings({...savedSettings, noGos: [...savedSettings.noGos]})
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
                    className={`settings-tab${activeTab === 'password' ? ' is-active' : ''}`}
                    id="password-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'password'}
                    aria-controls="password-panel"
                    onClick={() => setActiveTab('password')}
                >
                    Change Password
                </button>
            </div>

            {activeTab === 'profile' && (
                <div className="settings-panel" id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
                    <ProfileCard
                        profile={settings}
                        defaultAvatar={`https://i.pravatar.cc/160?img=${account.avatar}`}
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
                    {status && <p role="status">{status}</p>}
                </div>
            )}

            {activeTab === 'password' && (
                <div className="settings-panel" id="password-panel" role="tabpanel" aria-labelledby="password-tab">
                    <ChangePasswordCard userId={account.id}/>
                </div>
            )}
        </section>
    )
}

export default MySettings
