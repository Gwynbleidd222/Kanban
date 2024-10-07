import React, { createContext, useState, useEffect, useContext } from 'react'
import '../../Components/Tasks/task.scss'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
	const [tasks, setTasks] = useState(() => {
		const savedTasks = localStorage.getItem('tasks')
		return savedTasks ? JSON.parse(savedTasks) : []
	})

	const [selectedColumnId, setSelectedColumnId] = useState('')

	useEffect(() => {
		localStorage.setItem('tasks', JSON.stringify(tasks))
	}, [tasks])

	const addTask = newTask => {
		setTasks(prevTasks => [...prevTasks ,newTask])
	}

	const [selectedTask, setSelectedTask] = useState(null)

	const handleChangeTask = (id, updatedTask) => {
		setTasks(prevTasks => prevTasks.map(task => (task.id === id ? { ...task, ...updatedTask } : task)))
	}

	const handleDeleteTasks = taskId => {
		const updatedTasks = tasks.filter(task => task.id !== taskId);
		setTasks(updatedTasks); 
		
		localStorage.setItem('tasks', JSON.stringify(updatedTasks));
		if (selectedTask === taskId) {
			setSelectedTask(null);
		}
	}

	const deleteTasksByBoard = boardId => {
		const updatedTasks = tasks.filter(task => task.boardId !== boardId)
		setTasks(updatedTasks)
		localStorage.setItem('tasks', JSON.stringify(updatedTasks))
	}

	const toggleSubtaskStatus = (taskId, subtaskId) => {
		setTasks(prevTasks =>
			prevTasks.map(task => {
				if (task.id === taskId) {
					return {
						...task,
						subtasks: task.subtasks.map(subtask =>
							subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
						),
					}
				}
				return task
			})
		)
	}

	return (
		<TaskContext.Provider
			value={{
				tasks,
				addTask,
				handleChangeTask,
				handleDeleteTasks,
				toggleSubtaskStatus,
				selectedTask,
				setSelectedTask,
				selectedColumnId,
				setSelectedColumnId,
				deleteTasksByBoard,
			}}>
			{children}
		</TaskContext.Provider>
	)
}

export const useTasks = () => useContext(TaskContext)
