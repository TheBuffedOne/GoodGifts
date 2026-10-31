import { useState } from 'react'

function AddMemberForm({ members, onCreate }) {
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get('name').trim()
    const username = formData.get('username').trim()

    if (members.some((member) => member.username.toLowerCase() === username.toLowerCase())) {
      setError('That username is already in use.')
      return
    }

    onCreate({ name, username })
    setError('')
    form.reset()
  }

  return (
    <form className="member-add-card" onSubmit={handleSubmit}>
      <h2>Add someone lovely.</h2>
      <p>Create an account, then share their login details privately.</p>

      <label className="member-form-field" htmlFor="new-member-name">
        <span>Full name</span>
        <input
          id="new-member-name"
          name="name"
          type="text"
          placeholder="Friend’s name"
          autoComplete="off"
          required
        />
      </label>

      <label className="member-form-field" htmlFor="new-member-username">
        <span>Username</span>
        <input
          id="new-member-username"
          name="username"
          type="text"
          placeholder="e.g. first.last"
          pattern="[A-Za-z0-9.]+"
          title="Use letters, numbers and dots only."
          autoComplete="off"
          required
        />
        <small>Unique · letters, numbers and dots</small>
      </label>

        <label className="member-form-field" htmlFor="new-member-e-mail">
            <span>E-Mail</span>
            <input
                id="new-member-e-mail"
                name="e-mail"
                type="text"
                placeholder="E-Mail"
                autoComplete="off"
                required
            />
        </label>

        <label className="member-form-field" htmlFor="new-member-password">
        <span>Password</span>
        <input
            id="new-member-password"
            name="password"
            type="text"
            placeholder="***"
            autoComplete="off"
            required
        />
    </label>

      {error && <p className="member-form-error" role="alert">{error}</p>}

      <button className="member-create-button" type="submit">
        <span aria-hidden="true">＋</span> Create member
      </button>
    </form>
  )
}

export default AddMemberForm