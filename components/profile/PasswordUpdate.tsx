'use client'

import { useState } from 'react'
import { updatePassword } from '@/lib/actions/profile.actions'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const PasswordUpdate = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showOld, setShowOld] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,72}$/

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!passwordRegex.test(newPassword)) {
            setError(
                'New password must be 8-72 characters with uppercase, lowercase, digit, and special character.'
            )
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setIsLoading(true)
        try {
            await updatePassword({ oldPassword, newPassword })
            setSuccess('Password updated successfully.')
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Password update failed.')
        } finally {
            setIsLoading(false)
        }
    }

    const PasswordField = ({
        label,
        value,
        onChange,
        show,
        onToggle,
    }: {
        label: string
        value: string
        onChange: (v: string) => void
        show: boolean
        onToggle: () => void
    }) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-14 text-gray-900 
                     focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        </div>
    )

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-18 font-semibold text-gray-900 mb-6">Change Password</h2>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-14 text-red-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-14 text-green-700">{success}</div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                <PasswordField
                    label="Current Password"
                    value={oldPassword}
                    onChange={setOldPassword}
                    show={showOld}
                    onToggle={() => setShowOld(!showOld)}
                />
                <PasswordField
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showNew}
                    onToggle={() => setShowNew(!showNew)}
                />
                <PasswordField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                />

                <button
                    type="submit"
                    disabled={isLoading || !oldPassword || !newPassword || !confirmPassword}
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-14 font-medium 
                     text-white transition-colors hover:bg-green-700 disabled:opacity-50 self-start"
                >
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    Update Password
                </button>
            </form>
        </div>
    )
}

export default PasswordUpdate
