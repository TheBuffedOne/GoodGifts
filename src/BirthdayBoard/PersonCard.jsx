import { useState } from 'react'
import GiftPlans from './GiftPlans.jsx'

function PersonCard({ person, currentUser }) {
  const [gifts, setGifts] = useState(person.presents ?? [])
  const [isGiftPlansOpen, setIsGiftPlansOpen] = useState(false)
  const base = `/geschenkIdee/${person.id}/presents`

  async function addGift(giftName) {
    const name = giftName.trim()
    if (!name) return
    const res = await fetch(base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, name }),
    })
    if (!res.ok) return
    const newGift = await res.json()
    setGifts((current) => [...current, newGift])
  }

  async function removeGift(giftId) {
    const res = await fetch(`${base}/${giftId}?userId=${currentUser.id}`, { method: 'DELETE' })
    if (!res.ok) return
    setGifts((current) => current.filter((g) => g.id !== giftId))
  }

  async function toggleLike(giftId) {
    const res = await fetch(`${base}/${giftId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id }),
    })
    if (!res.ok) return
    const { liked, likes } = await res.json()
    setGifts((current) => current.map((g) => (g.id === giftId ? { ...g, liked, likes } : g)))
  }

  return (
    <article className="person-card">
      <div className="person-details">
        <img
          className="person-avatar"
          src={`https://i.pravatar.cc/160?img=${person.avatar}`}
          alt={person.name}
          loading="lazy"
        />
        <div>
          <h2 className="person-name">{person.name}</h2>
          <p className="person-birthday">{person.birthday}</p>
        </div>
      </div>

      <section className="gift-section" aria-label={`Gift list for ${person.name}`}>
        <h3>COLLECTED THROUGH THE YEAR</h3>
        {gifts.length > 0 ? (
          <>
            <ul className="gift-list">
              {gifts.slice(0, 2).map((gift, index) => (
                <li className="gift-list-item" key={`${gift.name}-${index}`}>
                  <span>{gift.name}</span>
                  <span className="gift-like-count" aria-label={`${gift.likes} likes`}>
                    ♡ {gift.likes}
                  </span>
                </li>
              ))}
            </ul>
            {gifts.length > 2 && <p className="gift-overflow">+{gifts.length - 2} items</p>}
          </>
        ) : (
          <p className="gift-empty">No gifts added yet.</p>
        )}

        <button className="gift-plans-trigger" type="button" onClick={() => setIsGiftPlansOpen(true)}>
          View gift plans
        </button>
      </section>

      {isGiftPlansOpen && (
        <GiftPlans
          person={person}
          gifts={gifts}
          onAddGift={addGift}
          onRemoveGift={removeGift}
          onToggleLike={toggleLike}
          onClose={() => setIsGiftPlansOpen(false)}
        />
      )}
    </article>
  )
}

export default PersonCard
