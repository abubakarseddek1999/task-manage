"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

import { TaskForm } from "../../component/task/TaskForm"
import { ColumnHeader } from "../../component/task/ColumnHeader"
import { TaskCard } from "../../component/task/TaskCard"

// Initial data structure with updated colors and more realistic tasks
const initialColumns = {
    todo: {
        id: "todo",
        title: "To Do",
        taskIds: ["task-1", "task-2", "task-3", "task-4"],
        color: "bg-[#8EADC1]",
        textColor: "text-white",
    },
    inprogress: {
        id: "inprogress",
        title: "In Progress",
        taskIds: ["task-5", "task-6", "task-7", "task-8"],
        color: "bg-[#7BC86C]",
        textColor: "text-white",
    },
    review: {
        id: "review",
        title: "In Review",
        taskIds: ["task-9", "task-10", "task-11", "task-12"],
        color: "bg-[#8A75C9]",
        textColor: "text-white",
    },
    Completed: {
        id: "Completed",
        title: "Completed",
        taskIds: ["task-13", "task-14", "task-15"],
        color: "bg-[#F5C24C]",
        textColor: "text-white",
    },
}

const initialTasks = {
    "task-1": {
        id: "task-1",
        content: "Find a New Product for Commerce",
        priority: "high",
        label: "bg-red-500",
        date: "Sun, Jun 30",
        assignee: "JD",
    },
    "task-2": {
        id: "task-2",
        content: "Book Flights",
        priority: "medium",
        label: "",
        date: "",
        assignee: "AK",
    },
    "task-3": {
        id: "task-3",
        content: "Redesign eNewsletter Page",
        priority: "low",
        label: "bg-orange-500",
        date: "",
        assignee: "JD",
    },
    "task-4": {
        id: "task-4",
        content: "Review Ad Brief",
        priority: "medium",
        label: "",
        date: "",
        assignee: "AK",
    },
    "task-5": {
        id: "task-5",
        content: "Pricing Page",
        priority: "medium",
        label: "",
        date: "",
        assignee: "JD",
    },
    "task-6": {
        id: "task-6",
        content: "Confirm Launch Date",
        priority: "high",
        label: "",
        date: "",
        assignee: "AK",
    },
    "task-7": {
        id: "task-7",
        content: "Decide on Travel Date",
        priority: "medium",
        label: "",
        date: "",
        assignee: "JD",
    },
    "task-8": {
        id: "task-8",
        content: "Campaign Performance Dashboard",
        priority: "low",
        label: "bg-orange-500",
        date: "Wed, Jun 19",
        assignee: "AK",
    },
    "task-9": {
        id: "task-9",
        content: "Open Position Description",
        priority: "high",
        label: "bg-red-500",
        date: "",
        assignee: "JD",
    },
    "task-10": {
        id: "task-10",
        content: "New Homepage Design",
        priority: "medium",
        label: "bg-red-500",
        date: "Sun, Jun 30",
        assignee: "AK",
    },
    "task-11": {
        id: "task-11",
        content: "Customer Stories Homepage",
        priority: "low",
        label: "bg-yellow-500",
        date: "Tue, Jun 11",
        assignee: "JD",
    },
    "task-12": {
        id: "task-12",
        content: "iOS Push on Copy Message",
        priority: "medium",
        label: "",
        date: "",
        assignee: "AK",
    },
    "task-13": {
        id: "task-13",
        content: "PPC Campaign",
        priority: "high",
        label: "bg-yellow-500",
        date: "Fri, Nov 15",
        assignee: "JD",
    },
    "task-14": {
        id: "task-14",
        content: "Ad Implementation",
        priority: "medium",
        label: "",
        date: "",
        assignee: "AK",
    },
    "task-15": {
        id: "task-15",
        content: "Dashboard Creation",
        priority: "low",
        label: "",
        date: "Sun, Oct 19",
        assignee: "JD",
    },
}

const columnOrder = ["todo", "inprogress", "review", "Completed"]

export default function TaskBoard() {
    const [tasks, setTasks] = useState(initialTasks)
    const [columns, setColumns] = useState(initialColumns)
    const [addingTaskToColumn, setAddingTaskToColumn] = useState(null)
    const [editingTask, setEditingTask] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredTasks, setFilteredTasks] = useState(initialTasks)

    // Filter tasks based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredTasks(tasks)
            return
        }

        const filtered = {}
        Object.keys(tasks).forEach((taskId) => {
            const task = tasks[taskId]
            if (task.content.toLowerCase().includes(searchTerm.toLowerCase())) {
                filtered[taskId] = task
            }
        })
        setFilteredTasks(filtered)
    }, [searchTerm, tasks])

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result

        // If there's no destination or if the item was dropped back in the same position
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return
        }

        // Get source and destination columns
        const sourceColumn = columns[source.droppableId]
        const destColumn = columns[destination.droppableId]

        // If moving within the same column
        if (sourceColumn.id === destColumn.id) {
            const newTaskIds = Array.from(sourceColumn.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)

            const newColumn = {
                ...sourceColumn,
                taskIds: newTaskIds,
            }

            setColumns({
                ...columns,
                [newColumn.id]: newColumn,
            })
            return
        }

        // Moving from one column to another
        const sourceTaskIds = Array.from(sourceColumn.taskIds)
        sourceTaskIds.splice(source.index, 1)

        const destTaskIds = Array.from(destColumn.taskIds)
        destTaskIds.splice(destination.index, 0, draggableId)

        setColumns({
            ...columns,
            [sourceColumn.id]: {
                ...sourceColumn,
                taskIds: sourceTaskIds,
            },
            [destColumn.id]: {
                ...destColumn,
                taskIds: destTaskIds,
            },
        })
    }

    const addNewTask = (columnId, taskData) => {
        const newTaskId = `task-${Date.now()}`
        const newTask = {
            id: newTaskId,
            ...taskData,
        }

        setTasks({
            ...tasks,
            [newTaskId]: newTask,
        })

        const column = columns[columnId]
        setColumns({
            ...columns,
            [columnId]: {
                ...column,
                taskIds: [...column.taskIds, newTaskId],
            },
        })

        setAddingTaskToColumn(null)
    }

    const updateTask = (taskId, columnId, taskData) => {
        setTasks({
            ...tasks,
            [taskId]: {
                ...tasks[taskId],
                ...taskData,
            },
        })
        setEditingTask(null)
    }

    const deleteTask = (taskId, columnId) => {
        const newTasks = { ...tasks }
        delete newTasks[taskId]

        const column = columns[columnId]
        const newTaskIds = column.taskIds.filter((id) => id !== taskId)

        setTasks(newTasks)
        setColumns({
            ...columns,
            [columnId]: {
                ...column,
                taskIds: newTaskIds,
            },
        })
    }

    const handleSearch = (query) => {
        setSearchTerm(query)
    }

    return (
        <div className="container mx-auto min-h-screen  flex flex-col">
            {/* <Navbar onSearch={handleSearch} /> */}
            <div className="flex-1 p-4 md:p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Management Board</h1>
                    <p className="text-gray-600">Organize your tasks by dragging and dropping between columns</p>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {columnOrder.map((columnId) => {
                            const column = columns[columnId]
                            const columnTaskIds = column.taskIds.filter((taskId) => filteredTasks[taskId])
                            const columnTasks = columnTaskIds.map((taskId) => filteredTasks[taskId])

                            return (
                                <div key={column.id} className="flex flex-col h-full">
                                    <ColumnHeader column={column} onAddClick={() => setAddingTaskToColumn(column.id)} />

                                    {addingTaskToColumn === column.id && (
                                        <TaskForm
                                            onSubmit={(taskData) => addNewTask(column.id, taskData)}
                                            onCancel={() => setAddingTaskToColumn(null)}
                                        />
                                    )}

                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-grow p-2 rounded-lg min-h-[200px] ${snapshot.isDraggingOver ? "bg-gray-200" : "bg-gray-100"
                                                    }`}
                                            >
                                                {columnTasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="mb-3"
                                                            >
                                                                {editingTask && editingTask.id === task.id ? (
                                                                    <TaskForm
                                                                        initialTask={task}
                                                                        onSubmit={(taskData) => updateTask(task.id, column.id, taskData)}
                                                                        onCancel={() => setEditingTask(null)}
                                                                    />
                                                                ) : (
                                                                    <TaskCard
                                                                        task={task}
                                                                        columnId={column.id}
                                                                        onDelete={deleteTask}
                                                                        onEdit={(task, columnId) => setEditingTask(task)}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                </DragDropContext>
            </div>
        </div>
    )
}
