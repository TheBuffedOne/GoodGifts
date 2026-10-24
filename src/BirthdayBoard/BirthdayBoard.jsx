import PersonCard from './PersonCard.jsx'

const MONTHS = {
  Januar: 0,
  Februar: 1,
  März: 2,
  April: 3,
  Mai: 4,
  Juni: 5,
  Juli: 6,
  August: 7,
  September: 8,
  Oktober: 9,
  November: 10,
  Dezember: 11,
}

const people = [
  { id: 1, name: 'Anna Müller', birthday: '14. März', avatar: 47 },
  { id: 2, name: 'Max Weber', birthday: '2. April', avatar: 12 },
  { id: 3, name: 'Lina Fischer', birthday: '21. Mai', avatar: 44 },
]

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

function BirthdayBoard() {
  const upcomingPeople = [...people].sort(
    (a, b) => daysUntilNextBirthday(a.birthday) - daysUntilNextBirthday(b.birthday),
  )

  return (
    <section className="birthday-board" aria-labelledby="birthday-board-title">
      <header className="board-heading">
        <div>
          <p className="board-eyebrow">SMALL NOTES, BIG BIRTHDAY ENERGY.</p>
          <h1 id="birthday-board-title">Good gifts start with a little listeining.</h1>
          <p className="board-description">Your friends, in birthday order. Collect ideas now, make their day later.</p>
        </div>
        <span className="people-count">{upcomingPeople.length} people</span>
      </header>

      <div className="people-grid">
        {upcomingPeople.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  )
}

export default BirthdayBoard
