import { useState } from 'react'
import GiftPlans from './GiftPlans.jsx'

function PersonCard({ person }) {
  const [gifts, setGifts] = useState([])
  const [isGiftPlansOpen, setIsGiftPlansOpen] = useState(false)

  function addGift(giftName) {
    const newGift = giftName.trim()
    if (!newGift) return
    setGifts((currentGifts) => [...currentGifts, newGift])
  }

  function removeGift(giftIndex) {
    setGifts((currentGifts) => currentGifts.filter((_, index) => index !== giftIndex))
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
          <ul className="gift-list">
            {gifts.map((gift, index) => (
              <li className="gift-list-item" key={`${gift}-${index}`}>
                <span>{gift}</span>
              </li>
            ))}
          </ul>
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
          onClose={() => setIsGiftPlansOpen(false)}
        />
      )}
    </article>
  )
}

export default PersonCard
