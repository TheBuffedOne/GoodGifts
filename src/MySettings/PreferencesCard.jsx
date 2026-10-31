import { useId, useState } from 'react'

function PreferencesCard({ noGos, notes, onNoGosChange, onNotesChange }) {
  const id = useId()
  const [newNoGo, setNewNoGo] = useState('')

  function addNoGo(event) {
    event.preventDefault()
    const value = newNoGo.trim()
    if (!value || noGos.some((noGo) => noGo.toLowerCase() === value.toLowerCase())) return
    onNoGosChange([...noGos, value])
    setNewNoGo('')
  }

  function removeNoGo(indexToRemove) {
    onNoGosChange(noGos.filter((_, index) => index !== indexToRemove))
  }

  return (
    <section className="settings-card preferences-card" aria-labelledby="preferences-card-title">
      <h2 id="preferences-card-title">Birthday-present no-gos</h2>
      <p className="settings-card-description">Help your friends avoid the things you aren’t quite you.</p>

      <ul className="settings-no-go-list" aria-label="Current no-gos">
        {noGos.map((noGo, index) => (
          <li className="settings-no-go" key={`${noGo}-${index}`}>
            <span>{noGo}</span>
            <button
              className="settings-no-go-remove"
              type="button"
              aria-label={`Remove ${noGo}`}
              onClick={() => removeNoGo(index)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <form className="settings-field settings-no-go-form" onSubmit={addNoGo}>
        <label htmlFor={`${id}-no-go`}>Add a no-go</label>
        <input
          id={`${id}-no-go`}
          type="text"
          value={newNoGo}
          onChange={(event) => setNewNoGo(event.target.value)}
          placeholder="e.g. fragrances, food allergies..."
        />
      </form>

      <label className="settings-field settings-notes-field" htmlFor={`${id}-notes`}>
        <span>Anything else your friends should know?</span>
        <textarea
          id={`${id}-notes`}
          rows="3"
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
        />
      </label>
      <p className="settings-privacy-note">These preferences are visible to your friends on your gift profile.</p>
    </section>
  )
}

export default PreferencesCard
