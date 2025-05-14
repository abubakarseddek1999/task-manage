"use client"

import { ChevronDown, PlusCircle } from "lucide-react"

export function ColumnHeader({ column, onAddClick }) {
  return (
    <div className={`flex items-center mb-3 px-3 py-2 rounded-t-lg ${column.color} ${column.textColor}`}>
      <h2 className="font-semibold">{column.title}</h2>
      <ChevronDown className="h-4 w-4 ml-1" />
      <span className="ml-2 text-black bg-white bg-opacity-30  text-xs font-medium px-2 py-0.5 rounded-full">
        {column.taskIds.length}
      </span>
      <button className="ml-auto p-1 rounded-full hover:bg-white hover:bg-opacity-20 text-white" onClick={onAddClick}>
        <PlusCircle className="h-5 w-5" />
      </button>
    </div>
  )
}
