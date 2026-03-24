'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    getWebhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
} from '@/lib/actions/profile.actions'
import { Plus, Pencil, Trash2, X, Check, Loader2, Webhook as WebhookIcon } from 'lucide-react'

const WebhookManager = () => {
    const [webhooks, setWebhooks] = useState<Webhook[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formName, setFormName] = useState('')
    const [formUrl, setFormUrl] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const loadWebhooks = useCallback(async () => {
        setIsLoading(true)
        const data = await getWebhooks()
        setWebhooks(data)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        loadWebhooks()
    }, [loadWebhooks])

    const resetForm = () => {
        setFormName('')
        setFormUrl('')
        setEditingId(null)
        setShowForm(false)
        setError('')
    }

    const handleEdit = (webhook: Webhook) => {
        setFormName(webhook.name)
        setFormUrl(webhook.url)
        setEditingId(webhook.id ?? null)
        setShowForm(true)
        setError('')
        setSuccess('')
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return
        setError('')
        setSuccess('')
        const ok = await deleteWebhook(id)
        if (ok) {
            setWebhooks((prev) => prev.filter((w) => w.id !== id))
            setSuccess('Webhook deleted.')
        } else {
            setError('Failed to delete webhook.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formName.trim() || !formUrl.trim()) {
            setError('Name and URL are required.')
            return
        }
        setError('')
        setSuccess('')
        setIsSaving(true)

        try {
            if (editingId !== null) {
                const updated = await updateWebhook(editingId, { name: formName, url: formUrl })
                if (updated) {
                    setWebhooks((prev) => prev.map((w) => (w.id === editingId ? updated : w)))
                    setSuccess('Webhook updated.')
                }
            } else {
                const created = await createWebhook({ name: formName, url: formUrl })
                if (created) {
                    setWebhooks((prev) => [...prev, created])
                    setSuccess('Webhook created.')
                }
            }
            resetForm()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Operation failed.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-18 font-semibold text-gray-900">Webhooks</h2>
                {!showForm && (
                    <button
                        onClick={() => {
                            resetForm()
                            setShowForm(true)
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-14 text-white 
                       transition-colors hover:bg-green-700"
                    >
                        <Plus className="size-4" />
                        New Webhook
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-14 text-red-700">{error}</div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-14 text-green-700">{success}</div>
            )}

            {/* Create / Edit form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                    <h3 className="text-14 font-medium text-gray-700">
                        {editingId !== null ? 'Edit Webhook' : 'Create Webhook'}
                    </h3>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-12 font-medium text-gray-500">Name</label>
                        <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="My Webhook"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-14 text-gray-900 
                         focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-12 font-medium text-gray-500">URL</label>
                        <input
                            type="url"
                            value={formUrl}
                            onChange={(e) => setFormUrl(e.target.value)}
                            placeholder="https://example.com/webhook"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-14 text-gray-900 
                         focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-14 text-gray-600 
                         transition-colors hover:bg-gray-200"
                        >
                            <X className="size-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-14 text-white 
                         transition-colors hover:bg-green-700 disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                            {editingId !== null ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex items-center gap-2 text-gray-500 py-4">
                    <Loader2 className="size-5 animate-spin" />
                    Loading webhooks…
                </div>
            ) : webhooks.length === 0 ? (
                <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
                    <WebhookIcon className="size-10" />
                    <p className="text-14">No webhooks configured yet.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {webhooks.map((wh) => (
                        <div
                            key={wh.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                        >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-3">
                                <p className="text-14 font-medium text-gray-900 truncate">{wh.name}</p>
                                <p className="text-12 text-gray-500 truncate">{wh.url}</p>
                            </div>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => handleEdit(wh)}
                                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                                    aria-label="Edit webhook"
                                >
                                    <Pencil className="size-4" />
                                </button>
                                <button
                                    onClick={() => wh.id !== undefined && handleDelete(wh.id)}
                                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                                    aria-label="Delete webhook"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WebhookManager
