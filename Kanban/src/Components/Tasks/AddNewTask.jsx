import React, { useState, useContext, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../../Components/Tasks/task.scss'
import { v4 as uuidv4 } from 'uuid'
import { TaskContext } from './TaskContext'
import { useDarkMode } from '../../Context/DarkModeContext'
import { useBoards } from '../BoardsContext/BoardsContext'
import IconCross from '../Icon/IconCross'

function Tasks({ isNewTaskModalOpen, closeAddNewTaskModal }) {
	const { addTask, selectedColumnId, setSelectedColumnId } = useContext(TaskContext)
	const [subtasks, setSubtasks] = useState([
		{ id: uuidv4(), name: '', placeholder: 'e.g. Make coffee' },
		{ id: uuidv4(), name: '', placeholder: 'e.g. Drink coffee & Smile' },
	])

	const { isDarkMode } = useDarkMode()
	const { boards, selectedBoardId } = useBoards()

	const selectedBoard = boards.find(board => board.id === selectedBoardId)
	const columns = selectedBoard ? selectedBoard.columns : []

	const [taskTitle, setTaskTitle] = useState('')
	const [taskTitleError, setTaskTitleError] = useState(false)
	const [subtaskErrors, setSubtaskErrors] = useState({})

	useEffect(() => {
		if (isNewTaskModalOpen) {
			setTaskTitle('')
			setSubtasks([
				{ id: uuidv4(), name: '', placeholder: 'e.g. Make coffee' },
				{ id: uuidv4(), name: '', placeholder: 'e.g. Drink coffee & Smile' },
			])
			setTaskTitleError(false)
			setSubtaskErrors([])
			setSelectedColumnId('')
		}
	}, [isNewTaskModalOpen])

	const addNewSubtask = () => {
		setSubtasks([...subtasks, { id: uuidv4(), name: '', placeholder: `e.g. New subtask` }])
		setSubtaskErrors(prev => ({ ...prev, [uuidv4()]: false }))
	}

	const removeSubtask = id => {
		setSubtasks(subtasks.filter(subtask => subtask.id !== id))
		setSubtaskErrors(prev => {
			const updatedErrors = { ...prev }
			delete updatedErrors[id]
			return updatedErrors
		})
	}

	const updateSubtaskName = (id, newName) => {
		setSubtasks(subtasks.map(subtask => (subtask.id === id ? { ...subtask, name: newName } : subtask)))
		setSubtaskErrors(prev => ({ ...prev, [id]: false }))
	}

	const handleCreateNewTask = () => {
		let valid = true

		if (!taskTitle.trim()) {
			setTaskTitleError(true)
			valid = false
		} else {
			setTaskTitleError(false)
		}

		const newSubtaskErrors = {}
		subtasks.forEach(subtask => {
			if (!subtask.name.trim()) {
				newSubtaskErrors[subtask.id] = true
				valid = false
			}
		})
		setSubtaskErrors(newSubtaskErrors)

		if (valid && selectedColumnId) {
			const newTask = {
				id: uuidv4(),
				name: taskTitle,
				description: document.querySelector('.task-input-description').value,
				subtasks: subtasks.map(subtask => ({ id: uuidv4(), name: subtask.name })),
				status: selectedColumnId,
				boardId: selectedBoardId,
			}
			addTask(newTask)
			setTaskTitle('')
			setSubtasks([
				{ id: uuidv4(), name: '', placeholder: 'e.g. Make coffee' },
				{ id: uuidv4(), name: '', placeholder: 'e.g. Drink coffee & Smile' },
			])

			closeAddNewTaskModal()
		}
	}

	const handleStatusChange = e => {
		setSelectedColumnId(e.target.value)
	}

	const handleOverlayClick = e => {
		if (e.target.classList.contains('overlay')) {
			closeAddNewTaskModal()
		}
	}

	return (
		<AnimatePresence>
			{isNewTaskModalOpen && (
				<>
					<motion.div
						key='overlay'
						className='overlay'
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						onClick={handleOverlayClick}
					/>
					<motion.div
						key='task-modal-overlay'
						className={`add-new-task-modal-overlay custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}>
						<div className={`add-new-task-modal-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
							<h3 className={`custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>Add New Task</h3>
							<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Title</p>
							<input
								className={`task-input-name input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
									taskTitleError ? 'error' : ''
								}`}
								type='text'
								value={taskTitle}
								onChange={e => {
									setTaskTitle(e.target.value)
									setTaskTitleError(false)
								}}
								placeholder={taskTitleError ? "Can't be empty" : 'e.g. Take coffee break'}
							/>

							<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Description</p>
							<textarea
								className={`task-input-description input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
								type='text'
								placeholder='e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little.'
							/>
							<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Subtasks</p>
							<div className='column-inputs'>
								{subtasks.map(subtask => (
									<div className='column-input' key={subtask.id}>
										<input
											className={`input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
												subtaskErrors[subtask.id] ? 'error' : ''
											}`}
											type='text'
											value={subtask.name}
											onChange={e => updateSubtaskName(subtask.id, e.target.value)}
											placeholder={subtaskErrors[subtask.id] ? "Can't be empty" : subtask.placeholder}
										/>

										<IconCross
											fill={subtaskErrors[subtask.id] ? '#EA5555' : '#828FA3'}
											onClick={() => removeSubtask(subtask.id)}
										/>
									</div>
								))}
							</div>
							<button
								className={`btn-add-new-subtask secondary-btn-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
								onClick={addNewSubtask}>
								+ Add new Subtask
							</button>
							<p className={`status custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Status</p>
							<select
								className={`input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
								name='status'
								id='column-id'
								onChange={handleStatusChange}
								value={selectedColumnId || ''}>
								<option value='' disabled>
									---
								</option>
								{columns.map(column => (
									<option key={column.id} value={column.id}>
										{column.name}
									</option>
								))}
							</select>
							<button className='btn-create-task' onClick={handleCreateNewTask}>
								Create Task
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default Tasks
