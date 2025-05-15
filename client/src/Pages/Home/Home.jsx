"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Loader2, Plus, RefreshCw, Search } from 'lucide-react'
import { Link, useNavigate } from "react-router-dom"
import { TaskForm } from "../../component/task/TaskForm"
import { TaskCard } from "../../component/task/TaskCard"

// Initial column structure with colors
const initialColumns = {
    todo: {
        id: "todo",
        title: "To Do",
        taskIds: [],
        color: "bg-[#8EADC1]",
        textColor: "text-white",
    },
    inprogress: {
        id: "inprogress",
        title: "In Progress",
        taskIds: [],
        color: "bg-[#7BC86C]",
        textColor: "text-white",
    },
    review: {
        id: "review",
        title: "In Review",
        taskIds: [],
        color: "bg-[#8A75C9]",
        textColor: "text-white",
    },
    Completed: {
        id: "Completed",
        title: "Completed",
        taskIds: [],
        color: "bg-[#F5C24C]",
        textColor: "text-white",
    },
}

const columnOrder = ["todo", "inprogress", "review", "Completed"]

export default function TaskBoard() {
    const [tasks, setTasks] = useState({})
    const [columns, setColumns] = useState(initialColumns)
    const [addingTaskToColumn, setAddingTaskToColumn] = useState(null)
    const [editingTask, setEditingTask] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredTasks, setFilteredTasks] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState(null)
    const userData = localStorage.getItem("user")
    const parsedData = JSON.parse(userData); // Convert JSON string to object
    const email = parsedData?.email;
    const navigate = useNavigate();

    // Fetch tasks from API on component mount
    useEffect(() => {
        fetchTasks()
    }, [])

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

    // Fetch tasks from the API
    // const fetchTasks = async () => {
    //     try {
    //         setIsLoading(true)
    //         setError(null)

    //         const response = await fetch('http://localhost:3000/tasks')
    //         if (!response.ok) {
    //             throw new Error(`Error: ${response.status}`)
    //         }

    //         const tasksData = await response.json()
    //         console.log("Fetched tasks:", tasksData)

    //         // Transform API data to our app's format
    //         const tasksById = {}
    //         const columnsCopy = JSON.parse(JSON.stringify(initialColumns))

    //         tasksData.forEach((task) => {
    //             // Determine which column this task belongs to
    //             const status = task.status || 'todo'
    //             const columnId = status.toLowerCase()

    //             // Create task object in our format
    //             tasksById[task._id] = {
    //                 id: task._id,
    //                 content: task.title,
    //                 priority: task.priority || "medium",
    //                 label: task.label || "",
    //                 date: task.dueDate || "",
    //                 assignee: task.assignee || task.assigne || "",
    //                 status: columnId,
    //                 // Keep original data for API updates
    //                 originalData: task
    //             }

    //             // Add task to appropriate column
    //             if (columnsCopy[columnId]) {
    //                 columnsCopy[columnId].taskIds.push(task._id)
    //             } else if (columnId === "completed") {
    //                 // Handle case sensitivity for "Completed" column
    //                 columnsCopy.Completed.taskIds.push(task._id)
    //             } else {
    //                 // If column doesn't exist, add to todo
    //                 columnsCopy.todo.taskIds.push(task._id)
    //             }
    //         })

    //         setTasks(tasksById)
    //         setColumns(columnsCopy)
    //         setFilteredTasks(tasksById)
    //     } catch (err) {
    //         console.error("Failed to fetch tasks:", err)
    //         setError("Failed to load tasks. Please try again.")
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }
    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            setError(null);
    
            // Add email query param (assuming you have user.email)
            const response = await fetch(`http://localhost:3000/tasks?email=${email}`);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const tasksData = await response.json();
            console.log("Fetched tasks:", tasksData);
    
            // Transform API data to our app's format
            const tasksById = {};
            const columnsCopy = JSON.parse(JSON.stringify(initialColumns));
    
            tasksData.forEach((task) => {
                const status = task.status || 'todo';
                const columnId = status.toLowerCase();
    
                tasksById[task._id] = {
                    id: task._id,
                    content: task.title,
                    priority: task.priority || "medium",
                    label: task.label || "",
                    date: task.dueDate || "",
                    assignee: task.assignee || task.assigne || "", // support both
                    status: columnId,
                    originalData: task
                };
    
                if (columnsCopy[columnId]) {
                    columnsCopy[columnId].taskIds.push(task._id);
                } else if (columnId === "completed") {
                    columnsCopy.Completed.taskIds.push(task._id);
                } else {
                    columnsCopy.todo.taskIds.push(task._id);
                }
            });
    
            setTasks(tasksById);
            setColumns(columnsCopy);
            setFilteredTasks(tasksById);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
            setError("Failed to load tasks. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    

    // Create a task in the database
    const createTask = async (columnId, taskData) => {
        try {
            setIsCreating(true)
            setError(null)

            // Prepare task data for API
            const newTaskData = {
                title: taskData.content,
                priority: taskData.priority,
                label: taskData.label,
                dueDate: taskData.date,
                assigne: taskData.assigne, // Using the field name from your TaskForm
                status: columnId,
                email:email
            }

            console.log("Creating task with data:", newTaskData)

            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: newTaskData })
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const result = await response.json()
            console.log("Task created successfully:", result)

            // Refresh tasks to get the latest data
            await fetchTasks()

            return result
        } catch (err) {
            console.error("Failed to create task:", err)
            setError("Failed to create task. Please try again.")
            throw err
        } finally {
            setIsCreating(false)
        }
    }

    // Update a task in the database
    const updateTaskInDb = async (taskId, updatedData) => {
        try {
            setIsUpdating(true)
            setError(null)

            console.log("Updating task:", taskId, "with data:", updatedData)

            const response = await fetch(`http://localhost:3000/task/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ task: updatedData })
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const result = await response.json()
            console.log("Task updated successfully:", result)

            return result
        } catch (err) {
            console.error("Failed to update task:", err)
            setError("Failed to update task. Please try again.")
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    // Delete a task from the database
    const deleteTaskFromDb = async (taskId) => {
        try {
            setIsDeleting(true)
            setError(null)

            console.log("Deleting task:", taskId)

            const response = await fetch(`http://localhost:3000/task/${taskId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const result = await response.json()
            console.log("Task deleted successfully:", result)

            return result
        } catch (err) {
            console.error("Failed to delete task:", err)
            setError("Failed to delete task. Please try again.")
            throw err
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle drag and drop
    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result

        // If there's no destination or if the item was dropped back in the same position
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return
        }

        // Get source and destination columns
        const sourceColumn = columns[source.droppableId]
        const destColumn = columns[destination.droppableId]

        // Create new arrays of taskIds
        const sourceTaskIds = Array.from(sourceColumn.taskIds)
        sourceTaskIds.splice(source.index, 1)

        const destTaskIds = Array.from(destColumn.taskIds)
        destTaskIds.splice(destination.index, 0, draggableId)

        // Update local state first for immediate UI feedback
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

        // Update task status in the database
        try {
            const task = tasks[draggableId]
            const updatedTask = {
                ...task.originalData,
                status: destColumn.id
            }

            await updateTaskInDb(draggableId, updatedTask)

            // Update local task state
            setTasks({
                ...tasks,
                [draggableId]: {
                    ...task,
                    status: destColumn.id,
                    originalData: updatedTask
                }
            })
        } catch (err) {
            // Revert to previous state if API call fails
            setColumns({
                ...columns,
                [sourceColumn.id]: sourceColumn,
                [destColumn.id]: destColumn,
            })
        }
    }

    // Add a new task
    const addNewTask = async (columnId, taskData) => {
        try {
            const result = await createTask(columnId, taskData)
            setAddingTaskToColumn(null)
        } catch (err) {
            // Error is already handled in createTask
        }
    }

    // Update a task
    const updateTask = async (taskId, columnId, taskData) => {
        try {
            const existingTask = tasks[taskId]

            if (!existingTask) {
                throw new Error(`Task with ID ${taskId} not found`)
            }

            // Prepare updated task data for API
            const updatedTaskData = {
                ...existingTask.originalData,
                title: taskData.content,
                priority: taskData.priority,
                label: taskData.label,
                dueDate: taskData.date,
                assigne: taskData.assigne // Using the field name from your TaskForm
            }

            // Update local state first for immediate UI feedback
            setTasks({
                ...tasks,
                [taskId]: {
                    ...existingTask,
                    content: taskData.content,
                    priority: taskData.priority,
                    label: taskData.label,
                    date: taskData.date,
                    assignee: taskData.assigne,
                }
            })

            // Send to API
            await updateTaskInDb(taskId, updatedTaskData)

            // Refresh tasks to get the latest data
            await fetchTasks()

            setEditingTask(null)
        } catch (err) {
            // Error is already handled in updateTaskInDb
        }
    }

    // Delete a task
    const deleteTask = async (taskId, columnId) => {
        try {
            // Update local state first for immediate UI feedback
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
                }
            })

            // Delete from API
            await deleteTaskFromDb(taskId)
        } catch (err) {
            // Error is already handled in deleteTaskFromDb
            // Refresh tasks to restore the correct state
            fetchTasks()
        }
    }

    const handleSearch = (query) => {
        setSearchTerm(query)
    }

    // Column Header Component
    const ColumnHeader = ({ column, onAddClick }) => {
        return (
            <div className={`${column.color} ${column.textColor} p-3 rounded-t-lg flex justify-between items-center`}>
                <div className="flex items-center">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="ml-2 bg-white bg-opacity-30 text-black text-xs px-2 py-1 rounded-full">
                        {column.taskIds.length}
                    </span>
                </div>
                <button
                    className="h-8 w-8 flex items-center justify-center text-white rounded-full hover:bg-white hover:bg-opacity-20"
                    onClick={onAddClick}
                >
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Add task</span>
                </button>
            </div>
        )
    }
    const handleAddClick = (columnId) => {
        if (!email) {
            navigate('/login');
        } else {
            setAddingTaskToColumn(columnId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-70px)]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-lg">Loading tasks...</span>
            </div>
        )
    }

    return (
        <div className="container mx-auto min-h-[calc(100vh-70px)] flex flex-col">
            <div className="flex-1 p-4 md:p-6">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">Task Management Board</h1>
                        <button
                            onClick={fetchTasks}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 flex items-center"
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Organize your tasks by dragging and dropping between columns</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                    </div>

                    {error && (
                        <div className="mt-2 p-2 bg-red-100 border border-red-300 text-red-800 rounded-md">
                            {error}
                        </div>
                    )}
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {columnOrder.map((columnId) => {
                            const column = columns[columnId]
                            const columnTaskIds = column.taskIds.filter((taskId) => filteredTasks[taskId])
                            const columnTasks = columnTaskIds.map((taskId) => filteredTasks[taskId])

                            return (
                                <div key={column.id} className="flex flex-col h-full">
                                    <ColumnHeader
                                        column={column}
                                        // onAddClick={() => setAddingTaskToColumn(column.id)}
                                        onAddClick={() => handleAddClick(column.id)}
                                    />
                                    {/* check user has */}
                                    {addingTaskToColumn === column.id && (
                                        <div className="relative">
                                            <TaskForm
                                                onSubmit={(taskData) => addNewTask(column.id, taskData)}
                                                onCancel={() => setAddingTaskToColumn(null)}
                                            />
                                            {isCreating && (
                                                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Droppable droppableId={column.id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={`flex-grow p-2 rounded-lg min-h-[200px] md:min-h-[250px] lg:min-h-[calc(100vh-300px)] ${snapshot.isDraggingOver ? "bg-gray-200" : "bg-gray-100"
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
                                                                    <div className="relative">
                                                                        <TaskForm
                                                                            initialTask={task}
                                                                            onSubmit={(taskData) => updateTask(task.id, column.id, taskData)}
                                                                            onCancel={() => setEditingTask(null)}
                                                                        />
                                                                        {isUpdating && (
                                                                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <TaskCard
                                                                            task={task}
                                                                            columnId={column.id}
                                                                            onDelete={deleteTask}
                                                                            onEdit={(task, columnId) => setEditingTask(task)}
                                                                        />
                                                                        {isDeleting && task.id === editingTask?.id && (
                                                                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                                            </div>
                                                                        )}
                                                                    </div>
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