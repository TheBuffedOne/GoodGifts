import { useState } from 'react'

const MIN_LENGTH = 8

function ChangePasswordCard({ userId }) {
    const [form, setForm] = useState({ current: '', next: '', confirm: '' })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [showPasswords, setShowPasswords] = useState(false)

    function updateField(key, value) {
        setForm((current) => ({ ...current, [key]: value }))
        setSuccess(false)
    }

    function validate() {
        const next = {}
        if (!form.current) next.current = 'Please enter your current password.'
        if (form.next.length < MIN_LENGTH) next.next = `At least ${MIN_LENGTH} characters.`
        else if (form.next === form.current) next.next = 'New password must differ from the current one.'
        if (form.confirm !== form.next) next.confirm = 'Passwords do not match.'
        return next
    }

    async function handleSubmit(event) {
        event.preventDefault()
        const validationErrors = validate()
        setErrors(validationErrors)
        if (Object.keys(validationErrors).length > 0) return

        try {
            const response = await fetch(`/api/members/${userId}/password`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
            })
            const result = await response.json()
            if (!response.ok) { setErrors({ current: result.error }); return }
        } catch {
            setErrors({ current: 'Server nicht erreichbar.' })
            return
        }
        setForm({ current: '', next: '', confirm: '' })
        setSuccess(true)
    }

    function handleCancel() {
        setForm({ current: '', next: '', confirm: '' })
        setErrors({})
        setSuccess(false)
    }

    const type = showPasswords ? 'text' : 'password'

    return (
        <form className="settings-card password-card" onSubmit={handleSubmit} noValidate>
            <h2>Change password</h2>

            <label className="password-field">
                Current password
                <input
                    type={type}
                    value={form.current}
                    autoComplete="current-password"
                    onChange={(e) => updateField('current', e.target.value)}
                    aria-invalid={Boolean(errors.current)}
                />
                {errors.current && <span className="field-error" role="alert">{errors.current}</span>}
            </label>

            <label className="password-field">
                New password
                <input
                    type={type}
                    value={form.next}
                    autoComplete="new-password"
                    onChange={(e) => updateField('next', e.target.value)}
                    aria-invalid={Boolean(errors.next)}
                />
                {errors.next && <span className="field-error" role="alert">{errors.next}</span>}
            </label>

            <label className="password-field">
                Confirm new password
                <input
                    type={type}
                    value={form.confirm}
                    autoComplete="new-password"
                    onChange={(e) => updateField('confirm', e.target.value)}
                    aria-invalid={Boolean(errors.confirm)}
                />
                {errors.confirm && <span className="field-error" role="alert">{errors.confirm}</span>}
            </label>

            <label className="password-toggle">
                <input
                    type="checkbox"
                    checked={showPasswords}
                    onChange={(e) => setShowPasswords(e.target.checked)}
                />
                Show passwords
            </label>

            {success && <p className="password-success" role="status">Password updated ✓</p>}

            <div className="password-actions">
                <button className="password-cancel" type="button" onClick={handleCancel}>Cancel</button>
                <button className="password-submit" type="submit">Update password</button>
            </div>
        </form>
    )
}

export default ChangePasswordCard
