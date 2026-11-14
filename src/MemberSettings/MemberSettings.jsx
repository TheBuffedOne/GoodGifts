import { useEffect, useState } from 'react'
import AddMemberForm from './AddMemberForm.jsx'
import MemberRow from './MemberRow.jsx'

function createUsername(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9. ]/g, '')
    .trim()
    .replace(/\s+/g, '.')
}

function MemberSettings({ accountName, onOpenMySettings }) {
  const [members, setMembers] = useState([])
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { fetch('/api/members').then((res) => res.json()).then(setMembers).catch(() => setError('Mitglieder konnten nicht geladen werden.')) }, [])

  const admin = members.find((member) => member.name === accountName) ?? {
    name: accountName,
    username: createUsername(accountName),
    avatar: 47,
  }
  const friendMembers = members.filter((member) => member.name !== accountName)

  async function createMember(member) {
    const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(member) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMembers((current) => [...current, data]); setError('')
  }

  async function updateMember(updatedMember) {
    const res = await fetch(`/api/members/${updatedMember.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedMember) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setMembers((current) => current.map((member) => member.id === data.id ? data : member)); setError('')
    setEditingMemberId(null)
  }

  async function removeMember(memberId) {
    const res = await fetch(`/api/members/${memberId}`, { method: 'DELETE' })
    if (!res.ok) { const data = await res.json(); setError(data.error); return }
    setMembers((current) => current.filter((member) => member.id !== memberId)); setError('')
    setEditingMemberId(null)
  }

  return (
    <section className="member-settings" aria-labelledby="member-settings-title">
      <header className="member-settings-heading">
        <p className="member-settings-eyebrow">A SMALL CLUB, BY DESIGN</p>
        <h1 id="member-settings-title">Good company. Private plans.</h1>
        <p>You decide who joins. Manage accounts and keep the circle close.</p>
      </header>

      <div className="member-settings-layout">
        {error && <p role="alert">{error}</p>}
        <div className="member-settings-main">
          <article className="member-admin-card">
            <img
              className="member-avatar member-admin-avatar"
              src={`https://i.pravatar.cc/160?img=${admin.avatar}`}
              alt=""
            />
            <div className="member-admin-details">
              <h2>{admin.name} <span>· You</span></h2>
              <p>@{admin.username} · Signed-in group admin</p>
              <small>Your account is separate from the friend list.</small>
            </div>
            <span className="member-admin-badge">Admin</span>
            <button className="member-my-settings-link" type="button" onClick={onOpenMySettings}>
              My settings →
            </button>
          </article>

          <section className="member-list-card" aria-labelledby="club-members-title">
            <header className="member-list-heading">
              <h2 id="club-members-title">Club members</h2>
              <span>{friendMembers.length} friends · 1 admin</span>
            </header>

            {friendMembers.length > 0 ? (
              <div className="member-table-scroll">
                <table className="member-table">
                  <thead>
                    <tr>
                      <th scope="col">Member / username</th>
                      <th scope="col">Birthday</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {friendMembers.map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        isEditing={editingMemberId === member.id}
                        onEdit={() => setEditingMemberId(member.id)}
                        onSave={updateMember}
                        onCancel={() => setEditingMemberId(null)}
                        onRemove={() => removeMember(member.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="member-empty-state">No friends yet. Add someone to your club.</p>
            )}
          </section>
        </div>

        <AddMemberForm members={members} onCreate={createMember} />
      </div>
    </section>
  )
}

export default MemberSettings
