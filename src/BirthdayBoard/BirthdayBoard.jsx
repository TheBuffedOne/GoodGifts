import { useEffect, useState } from 'react'
import PersonCard from './PersonCard.jsx'
import { MONTHS } from '../FixData/months.js'

function daysUntilNextBirthday(birthday, today = new Date()) {
  const [dayPart, monthName] = birthday.replace('.', '').split(' ')
  const month = MONTHS[monthName]
  const day = Number(dayPart)
  const year = today.getFullYear()
  let next = new Date(year, month, day)
  next.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  if (next < start) {
    next = new Date(year + 1, month, day)
  }
  return Math.round((next - start) / 86_400_000)
}

function BirthdayBoard({ account }) {
  const [peopleData, setPeopleData] = useState([])
  const currentUser = account
  const accountName = account?.name
  const currentUserId = account?.id

  useEffect(() => {
    if (!currentUserId) return
    fetch(`/geschenkIdee/?userId=${currentUserId}`)
        .then((res) => { if (!res.ok) throw new Error('Laden fehlgeschlagen'); return res.json() })
        .then(setPeopleData)
        .catch((err) => console.error('Laden fehlgeschlagen', err))
  }, [currentUserId])

  const upcomingPeople = peopleData
      .filter((person) => person.name !== accountName)
      .sort((a, b) => daysUntilNextBirthday(a.birthday) - daysUntilNextBirthday(b.birthday))

  return (
      <section className="birthday-board" aria-labelledby="birthday-board-title">
        <header className="board-heading">
          <div>
            <p className="board-eyebrow">SMALL NOTES, BIG BIRTHDAY ENERGY.</p>
            <h1 id="birthday-board-title">Good gifts start with a little listening.</h1>
            <p className="board-description">Your friends, in birthday order. Collect ideas now, make their day later.</p>
          </div>
          <span className="people-count">{upcomingPeople.length} people</span>
        </header>

        <div className="people-grid">
          {upcomingPeople.map((person) => (
              <PersonCard
                  key={`${person.id}-${currentUser.id}`}
                  person={person}
                  currentUser={currentUser}
              />
          ))}
        </div>
      </section>
  )
}

export default BirthdayBoard
