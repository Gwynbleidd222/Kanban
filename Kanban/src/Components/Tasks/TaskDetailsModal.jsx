import React, { useState, useEffect } from 'react'
import { useTasks } from './TaskContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useDarkMode } from '../../Context/DarkModeContext'
import { useBoards } from '../BoardsContext/BoardsContext'
import '../../Components/Tasks/task.scss'
import ellipsisIcon from '../../assets/icon-vertical-ellipsis.svg'
import EditTask from './EditTask'
import { useEditTaskModal } from '../../Context/TaskModalEditContext'
import DeleteTask from './DeleteTask'

const TaskDetailsModal = ({ task, handleOverlayClick }) => {
	const { handleChangeTask, handleDeleteTasks} = useTasks()
	const { isDarkMode } = useDarkMode()
	const { boards } = useBoards()
	const { isEditTaskModalOpen, openEditTaskModal, closeEditTaskModal,  } = useEditTaskModal()
	const [localTask, setLocalTask] = useState(task)
	const [isOptionsTaskModalOpen, setIsOptionsTaskModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [taskToDelete, setTaskToDelete] = useState(null)

	const openModalDelete = (taskId, taskName) => {
		if (taskId) {
			setTaskToDelete({ id: taskId, name: taskName })
			setIsDeleteModalOpen(true)
			
		}
	}

	const closeModalDelete = () => {
		setIsDeleteModalOpen(false)
		setTaskToDelete(null)
	}

	const handleDeleteTask = taskId => {
		handleDeleteTasks(taskId)
		closeModalDelete()
		handleOverlayClick()
	}

	useEffect(() => {
		setLocalTask(task)
	}, [task])

	const handleCheckboxChange = subtaskId => {
		const updatedSubtasks = localTask.subtasks.map(subtask =>
			subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
		)
		setLocalTask(prevTask => ({ ...prevTask, subtasks: updatedSubtasks }))
		handleChangeTask(localTask.id, { ...localTask, subtasks: updatedSubtasks })
	}

	const selectedBoard = boards.find(board => board.id === task.boardId)
	const columns = selectedBoard ? selectedBoard.columns : []

	const handleStatusChange = e => {
		const updatedStatus = e.target.value
		setLocalTask(prevTask => ({ ...prevTask, status: updatedStatus }))
		handleChangeTask(localTask.id, { ...localTask, status: updatedStatus })
		handleOverlayClick()
	}

	const openEditTaskModalHandler = () => {
		openEditTaskModal(localTask)
		setIsOptionsTaskModalOpen(false)
	}

	const closeEditTaskModalHandler = () => {
		closeEditTaskModal()
	}

	const handleTaskEditSave = updatedTask => {
		setLocalTask(updatedTask)
		handleChangeTask(updatedTask.id, updatedTask)
	}

	return (
		<AnimatePresence>
			{localTask &&  (
				<>
					<motion.div
						key='task-details-overlay'
						className='overlay'
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.3 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						onClick={handleOverlayClick}
					/>
					<motion.div
						key='task-details-modal'
						className={`task-details-modal custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.5, ease: 'easeOut' }}>
						<div className={`task-details-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
							<div className='task-details-name'>
								<h3 className={`custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>{localTask.name}</h3>
								<button className='task-options-btn' onClick={() => setIsOptionsTaskModalOpen(!isOptionsTaskModalOpen)}>
									<img src={ellipsisIcon} alt='options' />
								</button>

								{isOptionsTaskModalOpen && selectedBoard && (
									<motion.div
										className={`options-modal-task custom-dark-mode-component-options ${isDarkMode ? 'dark' : 'light'}`}>
										<div className='options-content-task'>
											<button className='options-edit-btn' onClick={openEditTaskModalHandler}>
												Edit Task
											</button>
											<button
												className='options-delete-btn'
												onClick={() => {
									
													setIsOptionsTaskModalOpen(false)
													openModalDelete(localTask.id, localTask.name)
												}}>
												Delete Task
											</button>
										</div>
									</motion.div>
								)}
							</div>

							<p className='description'>{localTask.description}</p>
							<p className={`substask-text custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>
								Subtasks ({localTask.subtasks.filter(subtask => subtask.completed).length} of{' '}
								{localTask.subtasks.length})
							</p>

							<div className='task-subtasks'>
								{localTask.subtasks.map(subtask => (
									<div
										key={subtask.id}
										className={`subtask-item checked-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
											subtask.completed ? 'completed' : ''
										}`}>
										<input
											type='checkbox'
											checked={subtask.completed || false}
											onChange={() => handleCheckboxChange(subtask.id)}
											className={`input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
										/>
										<span>{subtask.name || ''}</span>
									</div>
								))}
							</div>

							<p className={`substask-text custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Current Status</p>
							<select
								className={`input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
								name='status'
								id='column-id'
								onChange={handleStatusChange}
								value={localTask.status}>
								{columns.map(column => (
									<option key={column.id} value={column.id}>
										{column.name}
									</option>
								))}
							</select>
						</div>
					</motion.div>

					{isEditTaskModalOpen && <EditTask onSave={handleTaskEditSave} closeModal={closeEditTaskModalHandler} />}

					{isDeleteModalOpen && taskToDelete && (
						<DeleteTask
							taskId={taskToDelete.id}
							taskName={taskToDelete.name}
							closeModalDelete={closeModalDelete}
							handleDeleteTask={handleDeleteTask}
						/>
					)}
				</>
			)}
		</AnimatePresence>
	)
}

export default TaskDetailsModal
