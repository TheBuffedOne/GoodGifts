import { useState } from 'react'
import { MONTH_NAMES_EN } from '../months.js'

function formatBirthday(birthday) {
  if (!birthday) {
    return '—'
  }

  const [day, germanMonth] = birthday.replace('.', '').split(' ')
  const month = MONTH_NAMES_EN[germanMonth]
  return month ? `${day} ${month.slice(0, 3)}` : birthday
}

function MemberRow({ member, isEditing, onEdit, onSave, onCancel, onRemove }) {
  const [draft, setDraft] = useState(member)

  function startEditing() {
    setDraft(member)
    onEdit()
  }

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onSave({
      ...member,
      name: formData.get('name').trim(),
      username: formData.get('username').trim(),
      birthday: formData.get('birthday').trim(),
    })
  }

  return (
    <tr>
      <td>
        {isEditing ? (
          <form className="member-edit-form" id={`edit-member-${member.id}`} onSubmit={handleSubmit}>
            <label className="visually-hidden" htmlFor={`member-name-${member.id}`}>Full name</label>
            <input
              id={`member-name-${member.id}`}
              name="name"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              required
            />
            <label className="visually-hidden" htmlFor={`member-username-${member.id}`}>Username</label>
            <input
              id={`member-username-${member.id}`}
              name="username"
              value={draft.username}
              pattern="[A-Za-z0-9.]+"
              title="Use letters, numbers and dots only."
              onChange={(event) => setDraft({ ...draft, username: event.target.value })}
              required
            />
            <label className="visually-hidden" htmlFor={`member-birthday-${member.id}`}>Birthday</label>
            <input
              id={`member-birthday-${member.id}`}
              name="birthday"
              value={draft.birthday}
              placeholder="e.g. 14. Maerz"
              onChange={(event) => setDraft({ ...draft, birthday: event.target.value })}
            />
          </form>
        ) : (
          <div className="member-identity">
            <img
              className="member-avatar"
              src={`https://i.pravatar.cc/160?img=${member.avatar}`}
              alt=""
            />
            <div>
              <strong>{member.name}</strong>
              <span>@{member.username}</span>
            </div>
          </div>
        )}
      </td>
      <td className="member-birthday">
        {isEditing ? 'Edit above' : formatBirthday(member.birthday)}
      </td>
      <td className="member-actions">
        {isEditing ? (
          <>
            <button className="member-action-save" type="submit" form={`edit-member-${member.id}`}>Save</button>
            <button className="member-action-remove" type="button" onClick={onCancel}>Cancel</button>
          </>
        ) : (
          <>
            <button className="member-action-edit" type="button" onClick={startEditing}>Edit</button>
            <button className="member-action-remove" type="button" onClick={onRemove}>Remove</button>
          </>
        )}
      </td>
    </tr>
  )
}

export default MemberRow