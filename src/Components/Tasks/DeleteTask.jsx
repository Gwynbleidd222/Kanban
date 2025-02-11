import React from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import '../../Components/Tasks/task.scss'
import { useDarkMode } from '../../Context/DarkModeContext'


const DeleteTask = ({taskId, taskName, closeModalDelete, handleDeleteTask}) => {
    const {isDarkMode} = useDarkMode()

	
    return (
		<AnimatePresence>
			<motion.div
				key='overlay'
				className='overlay-task-overlay'
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.5 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				onClick={closeModalDelete}
			/>
			<motion.div
				key='delete-task-modal'
				className={`delete-task-modal custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				exit={{ opacity: 0, scale: 0.95 }}
				transition={{ duration: 0.3 }}>
				<div className={`delete-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
					<h3 className='delete-title'>Delete this Task?</h3>
					<p className='delete-text'>
                    Are you sure you want to delete the ‘{taskName}’ task and its subtasks? This action cannot be reversed.
					</p>

					<div className='modal-actions-btns'>
						<button className='btn-delete' onClick={() => handleDeleteTask(taskId)}>
							Delete
						</button>
						<button className='btn-cancel' onClick={closeModalDelete}>
							Cancel
						</button>
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	)
}

export default DeleteTask