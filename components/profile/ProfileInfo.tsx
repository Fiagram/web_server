'use client'

import { useState, useEffect } from 'react'
import { getProfileMe, updateProfileMe } from '@/lib/actions/profile.actions'
import { Pencil, X, Check, Loader2 } from 'lucide-react'

const ProfileInfo = () => {
    const [account, setAccount] = useState<Account | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Editable fields
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        const load = async () => {
            setIsLoading(true)
            const data = await getProfileMe()
            if (data) {
                setAccount(data)
                setFullname(data.fullname)
                setEmail(data.email)
                setPhoneNumber(data.phoneNumber ?? '')
            }
            setIsLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        setError('')
        setSuccess('')
        setIsSaving(true)
        try {
            const updated = await updateProfileMe({ fullname, email, phoneNumber })
            if (updated) {
                setAccount(updated)
                setSuccess('Profile updated successfully')
                setIsEditing(false)
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Update failed')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        if (account) {
            setFullname(account.fullname)
            setEmail(account.email)
            setPhoneNumber(account.phoneNumber ?? '')
        }
        setIsEditing(false)
        setError('')
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-gray-500 py-8">
                <Loader2 className="size-5 animate-spin" />
                Loading profile…
            </div>
        )
    }

    if (!account) {
        return <p className="text-red-500 py-4">Failed to load profile information.</p>
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-18 font-semibold text-gray-900">Account Information</h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-14 text-gray-600 
                       transition-colors hover:bg-gray-100"
                    >
                        <Pencil className="size-4" />
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-14 text-gray-600 
                         transition-colors hover:bg-gray-100"
                        >
                            <X className="size-4" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-14 text-white 
                         transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                            Save
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-14 text-red-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-14 text-green-700">{success}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username — read-only */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                        Username
                    </label>
                    <p className="text-16 text-gray-900 font-medium">{account.username}</p>
                </div>

                {/* Role — read-only */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                        Role
                    </label>
                    <span className="inline-flex items-center self-start rounded-full bg-blue-100 px-3 py-0.5 text-12 font-medium text-blue-800 capitalize">
                        {account.role}
                    </span>
                </div>

                {/* Full name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-14 text-gray-900 
                         focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    ) : (
                        <p className="text-16 text-gray-900">{account.fullname}</p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                        Email
                    </label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-14 text-gray-900 
                         focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    ) : (
                        <p className="text-16 text-gray-900">{account.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-12 font-medium text-gray-500 uppercase tracking-wide">
                        Phone Number
                    </label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. 0123456789"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-14 text-gray-900 
                         focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    ) : (
                        <p className="text-16 text-gray-900">
                            {account.phoneNumber
                                ? `${account.phoneNumber}`
                                : '—'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileInfo
