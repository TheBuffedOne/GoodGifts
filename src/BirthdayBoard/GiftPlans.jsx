import { useId, useState } from 'react'

function GiftPlans({ person, gifts, onAddGift, onRemoveGift, onClose }) {
  const inputId = useId()
  const [giftName, setGiftName] = useState('')

  function addGift(event) {
    event.preventDefault()
    const newGift = giftName.trim()
    if (!newGift) return
    onAddGift(newGift)
    setGiftName('')
  }

  return (
    <div className="gift-plans-backdrop" onClick={onClose}>
      <section
        className="gift-plans-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-plans-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="gift-plans-header">
          <div>
            <p className="board-eyebrow">Birthday gift plans</p>
            <h2 id="gift-plans-title">{person.name}</h2>
          </div>
          <button className="gift-plans-close" type="button" onClick={onClose} aria-label="Close gift plans">
            ×
          </button>
        </header>

        <div className="gift-plans-layout">
          <aside className="gift-plans-person">
            <img
              className="person-avatar"
              src={`https://i.pravatar.cc/160?img=${person.avatar}`}
              alt={person.name}
            />
            <div>
              <h3>{person.name}</h3>
              <p>{person.birthday}</p>
            </div>
          </aside>

          <section className="gift-plans-list" aria-label={`Gift plans for ${person.name}`}>
            <h3>Gift ideas</h3>
            {gifts.length > 0 ? (
              <ul className="gift-list">
                {gifts.map((gift, index) => (
                  <li className="gift-list-item" key={`${gift}-${index}`}>
                    <span>{gift}</span>
                    <button
                      className="gift-remove"
                      type="button"
                      aria-label={`Remove ${gift}`}
                      onClick={() => onRemoveGift(index)}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="gift-empty">No gifts added yet.</p>
            )}
          </section>
        </div>

        <section className="gift-plans-add" aria-labelledby="gift-plans-add-title">
          <h3 id="gift-plans-add-title">Add a gift</h3>
          <form className="gift-form" onSubmit={addGift}>
            <label className="visually-hidden" htmlFor={inputId}>Add a gift for {person.name}</label>
            <input
              id={inputId}
              type="text"
              value={giftName}
              onChange={(event) => setGiftName(event.target.value)}
              placeholder="Enter a gift idea"
            />
            <button className="gift-add" type="submit" aria-label={`Add gift for ${person.name}`}>
              +
            </button>
          </form>
        </section>
      </section>
    </div>
  )
}

export default GiftPlans
