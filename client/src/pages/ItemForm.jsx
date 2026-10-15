import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

const defaults = { title: '', description: '', category: 'other', status: 'lost', location: '' }

export default function ItemForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    async function loadItem() {
      try {
        const res = await api.get(`/items/${id}`)
        const item = res.data.item
        setForm({
          title: item.title || '',
          description: item.description || '',
          category: item.category || 'other',
          status: item.status || 'lost',
          location: item.location || ''
        })
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load item')
      }
    }

    loadItem()
  }, [id])

  function onChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const payload = {
        title: form.title,
        status: form.status,
        category: form.category,
        location: form.location,
        description: form.description
      }

      if (id) {
        await api.patch(`/items/${id}`, payload)
      } else {
        await api.post('/items', payload)
      }

      nav('/items')
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'Report'} Item</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="input"
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Black backpack"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="input" name="status" value={form.status} onChange={onChange}>
              <option value="lost">lost</option>
              <option value="found">found</option>
              <option value="claimed">claimed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="input" name="category" value={form.category} onChange={onChange}>
              <option value="electronics">electronics</option>
              <option value="clothing">clothing</option>
              <option value="documents">documents</option>
              <option value="accessories">accessories</option>
              <option value="other">other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            className="input"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="Library 2nd floor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="input min-h-[120px]"
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Optional details"
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
