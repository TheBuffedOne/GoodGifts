import { useId, useState } from 'react'
import { MONTHS_EN } from '../months.js'

function ProfileCard({ profile, defaultAvatar, onChange }) {
  const id = useId()
  const [photoError, setPhotoError] = useState('')

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Please choose a photo smaller than 5 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        onChange('avatar', reader.result)
        setPhotoError('')
      }
    })
    reader.readAsDataURL(file)
  }

  return (
    <section className="settings-card profile-card" aria-labelledby="profile-card-title">
      <h2 id="profile-card-title">Your profile</h2>
      <p className="settings-card-description">A familiar face makes the club feel like home.</p>

      <div className="settings-photo-row">
        <img className="settings-avatar" src={profile.avatar} alt={`${profile.displayName} profile`} />
        <div className="settings-photo-controls">
          <label className="settings-photo-upload" htmlFor={`${id}-photo`}>
            <span aria-hidden="true">↑</span> Change photo
            <input id={`${id}-photo`} type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          <button className="settings-photo-remove" type="button" onClick={() => onChange('avatar', defaultAvatar)}>
            Remove
          </button>
          <span className="settings-photo-hint">JPG or PNG · up to 5 MB</span>
          {photoError && <span className="settings-photo-error" role="alert">{photoError}</span>}
        </div>
      </div>

      <label className="settings-field" htmlFor={`${id}-name`}>
        <span>Display name</span>
        <input
          id={`${id}-name`}
          type="text"
          value={profile.displayName}
          onChange={(event) => onChange('displayName', event.target.value)}
        />
      </label>

      <div className="settings-birthday-fields">
        <label className="settings-field" htmlFor={`${id}-day`}>
          <span>Birthday · day</span>
          <input
            id={`${id}-day`}
            type="number"
            min="1"
            max="31"
            value={profile.day}
            onChange={(event) => onChange('day', event.target.value)}
          />
        </label>
        <label className="settings-field" htmlFor={`${id}-month`}>
          <span>Month</span>
          <select
            id={`${id}-month`}
            value={profile.month}
            onChange={(event) => onChange('month', event.target.value)}
          >
            {MONTHS_EN.map((month) => <option key={month} value={month}>{month}</option>)}
          </select>
        </label>
      </div>
    </section>
  )
}

export default ProfileCard
