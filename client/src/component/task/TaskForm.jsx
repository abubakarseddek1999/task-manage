"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

export function TaskForm({ onSubmit, onCancel, initialTask = null }) {
  const [content, setContent] = useState(initialTask ? initialTask.content : "")
  const [date, setDate] = useState(initialTask ? initialTask.date : "")
  const [priority, setPriority] = useState(initialTask ? initialTask.priority : "medium")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [label, setLabel] = useState(initialTask ? initialTask.label : "")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) return

    onSubmit({
      content,
      date,
      priority,
      label,
      assignee: initialTask ? initialTask.assignee : "JD",
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const options = { weekday: "short", month: "short", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm mb-3">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter task..."
        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
        autoFocus
      />

      <div className="flex items-center mb-2">
        <div className="relative flex-1">
          <button
            type="button"
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-gray-300"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Calendar className="h-4 w-4 mr-1" />
            {date ? formatDate(date) : "Add date"}
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value ? formatDate(e.target.value) : "")
                  setShowDatePicker(false)
                }}
                className="border border-gray-300 rounded p-1"
              />
            </div>
          )}
        </div>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="ml-2 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Label Color</label>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setLabel("")}
            className={`w-6 h-6 rounded-full border ${!label ? "border-2 border-blue-500" : "border-gray-300"} flex items-center justify-center`}
          >
            <span className="text-xs">✕</span>
          </button>
          <button
            type="button"
            onClick={() => setLabel("bg-red-500")}
            className={`w-6 h-6 rounded-full bg-red-500 ${label === "bg-red-500" ? "ring-2 ring-offset-2 ring-red-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setLabel("bg-orange-500")}
            className={`w-6 h-6 rounded-full bg-orange-500 ${label === "bg-orange-500" ? "ring-2 ring-offset-2 ring-orange-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setLabel("bg-yellow-500")}
            className={`w-6 h-6 rounded-full bg-yellow-500 ${label === "bg-yellow-500" ? "ring-2 ring-offset-2 ring-yellow-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setLabel("bg-green-500")}
            className={`w-6 h-6 rounded-full bg-green-500 ${label === "bg-green-500" ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setLabel("bg-blue-500")}
            className={`w-6 h-6 rounded-full bg-blue-500 ${label === "bg-blue-500" ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
          />
          <button
            type="button"
            onClick={() => setLabel("bg-purple-500")}
            className={`w-6 h-6 rounded-full bg-purple-500 ${label === "bg-purple-500" ? "ring-2 ring-offset-2 ring-purple-500" : ""}`}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="mr-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md">
          {initialTask ? "Update" : "Add"}
        </button>
      </div>
    </form>
  )
}
