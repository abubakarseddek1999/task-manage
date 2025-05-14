"use client"

import { useState } from "react"
import { Calendar, MoreHorizontal } from "lucide-react"

export function TaskCard({ task, columnId, onDelete, onEdit }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return { text: "New", className: "bg-red-100 text-red-800" }
      case "medium":
        return { text: "Medium", className: "bg-orange-100 text-orange-800" }
      case "low":
        return { text: "Low", className: "bg-yellow-100 text-yellow-800" }
      default:
        return { text: "Normal", className: "bg-gray-100 text-gray-800" }
    }
  }

  const priorityInfo = getPriorityLabel(task.priority)

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow-sm">
      {task.label && <div className={`h-1.5 w-full ${task.label} rounded-t-md`}></div>}
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-2">
            <p className="text-sm font-medium text-gray-800">{task.content}</p>

            {task.date && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {task.date}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="h-8 w-8 p-1 rounded-full hover:bg-gray-100"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  onClick={() => {
                    onEdit(task, columnId)
                    setDropdownOpen(false)
                  }}
                >
                  Edit
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    onDelete(task.id, columnId)
                    setDropdownOpen(false)
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${priorityInfo.className}`}>
            {priorityInfo.text}
          </span>

          <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {task.assignee}
          </div>
        </div>
      </div>
    </div>
  )
}
