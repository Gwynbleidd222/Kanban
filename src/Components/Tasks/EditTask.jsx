import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import crossIcon from '../../assets/icon-cross.svg'
import { useDarkMode } from '../../Context/DarkModeContext'
import { v4 as uuidv4 } from 'uuid'
import { useBoards } from '../BoardsContext/BoardsContext'
import { useEditTaskModal } from '../../Context/TaskModalEditContext'
import { useTasks } from './TaskContext'
import '../../Components/Tasks/task.scss'
import IconCross from '../Icon/IconCross'

const EditTask = ({ onSave }) => {
	const { editingTask, isEditTaskModalOpen, closeEditTaskModal } = useEditTaskModal()
	const { handleChangeTask } = useTasks()
	const [taskName, setTaskName] = useState(editingTask ? editingTask.name : '')
	const [description, setDescription] = useState(editingTask ? editingTask.description : '')
	const [subtasks, setSubtasks] = useState(editingTask ? editingTask.subtasks : [])
	const [selectedColumnId, setSelectedColumnId] = useState(editingTask ? editingTask.status : '')
	const { isDarkMode } = useDarkMode()
	const { boards, selectedBoardId } = useBoards()

	const [taskNameError, setTaskNameError] = useState(false)
	const [subtaskErrors, setSubtaskErrors] = useState([])

	useEffect(() => {
		if (editingTask) {
			setTaskName(editingTask.name)
			setDescription(editingTask.description)
			setSubtasks(editingTask.subtasks || [])
			setSelectedColumnId(editingTask.status || '')
		}
	}, [editingTask])

	const updateSubtasksName = (id, newName) => {
		setSubtasks(subtasks.map(subtask => (subtask.id === id ? { ...subtask, name: newName } : subtask)))
		setSubtaskErrors({ ...subtaskErrors, [id]: false })
	}

	const addNewSubtask = () => {
		setSubtasks([...subtasks, { id: uuidv4(), name: '' }])
		setSubtaskErrors({ ...subtaskErrors, [addNewSubtask.id]: false })
	}

	const removeSubtask = id => {
		setSubtasks(subtasks.filter(subtask => subtask.id !== id))
		setSubtaskErrors(prev => {
			const updatedErrors = { ...prev }
			delete updatedErrors[id]
			return updatedErrors
		})
	}

	const saveChanges = () => {
		let isValid = true

		
		if (!taskName.trim()) {
			setTaskNameError(true)
			isValid = false
		} else {
			setTaskNameError(false)
		}

	
		const updatedSubtasks = subtasks.map(subtask => {
			if (!subtask.name.trim()) {
				setSubtaskErrors(prev => ({ ...prev, [subtask.id]: true }))
				isValid = false
			}
			return subtask
		})

	
		if (!selectedColumnId) {
			isValid = false
		}

		if (!isValid) return 

		const updatedTask = {
			id: editingTask.id,
			name: taskName,
			subtasks: updatedSubtasks,
			description,
			status: selectedColumnId,
		}

		handleChangeTask(editingTask.id, updatedTask)

		if (onSave) {
			onSave(updatedTask)
		}

		closeEditTaskModal()
	}

	const selectedBoard = boards.find(board => board.id === selectedBoardId)
	const columns = selectedBoard ? selectedBoard.columns : []

	const handleStatusChange = e => {
		setSelectedColumnId(e.target.value)
	}

	return (
		<AnimatePresence>
			{isEditTaskModalOpen && (
				<>
					<motion.div
						key='overlay'
						className='overlay'
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						onClick={closeEditTaskModal}
					/>
					<motion.div
						key='task-modal-overlay'
						className={`add-new-task-modal-overlay custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}>
						<div className={`add-new-task-modal-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
							<h3 className={`custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>Edit Task</h3>
							<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Title</p>
							<input
								className={`task-input-name input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
									taskNameError ? 'error' : ''
								}`}
								type='text'
								value={taskName}
								onChange={e => {
									setTaskName(e.target.value)
									setTaskNameError(false)
								}}
								placeholder={taskNameError ? "Can't be empty" : ''}
							/>

							<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Description</p>
							<textarea
								className={`task-input-description input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
								value={description}
								onChange={e => setDescription(e.target.value)}
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
											onChange={e => updateSubtasksName(subtask.id, e.target.value)}
											placeholder={subtaskErrors[subtask.id] ? "Can't be empty" : ''}
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
								value={selectedColumnId}>
								{columns.map(column => (
									<option key={column.id} value={column.id}>
										{column.name}
									</option>
								))}
							</select>
							<button className='btn-create-task' onClick={saveChanges}>
								Save Changes
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

export default EditTask
