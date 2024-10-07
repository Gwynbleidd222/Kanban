import React, { useContext, useEffect, useState } from 'react'
import { useBoards } from '../BoardsContext/BoardsContext'
import { useModal } from '../BoardsContext/ModalContext'
import '../../Components/Main/main.scss'
import EditBoards from '../Boards/EditBoards'
import { useDarkMode } from '../../Context/DarkModeContext'
import { TaskContext } from '../Tasks/TaskContext'
import { useColumns } from '../../Context/ColumnsContext'
import TaskDetailsModal from '../Tasks/TaskDetailsModal'
import { useTaskModal } from '../../Context/TaskModalContext'

const Main = ({ setIsBoardEmpty }) => {
	const { openTaskDetailsModal, isTaskDetailsModalOpen, closeTaskDetailsModal, selectedTask } = useTaskModal()
	const { boards, selectedBoardId, handleChange } = useBoards()
	const { isEditBoardModalOpen, editingBoard, openEditBoardModal, closeEditBoardModal } = useModal()
	const { isDarkMode } = useDarkMode()
	const { tasks } = useContext(TaskContext)
	const { columns, updateColumns } = useColumns()

	const selectedBoard = boards.find(board => board.id === selectedBoardId)

	useEffect(() => {
		if (selectedBoard) {
			updateColumns(selectedBoard.columns || [])
		}
	}, [selectedBoard, updateColumns])

	useEffect(() => {
		const isBoardEmpty = columns.length === 0 || columns.every(column => column.name.trim() === '')
		setIsBoardEmpty(isBoardEmpty)
	}, [columns, setIsBoardEmpty])

	if (!selectedBoard) {
		return (
			<div className='main-content'>
				<div className='main-text'>Select a board or create a new board to view its columns.</div>
			</div>
		)
	}

	if (columns.length === 0 || columns.every(column => column.name.trim() === '')) {
		return (
			<div className='main-content'>
				<div className='main-text'>This board is empty. Create a new column to get started.</div>
				<button className='btn-add-main' onClick={() => selectedBoard && openEditBoardModal()}>
					+ Add New Column
				</button>
				{isEditBoardModalOpen && editingBoard && (
					<EditBoards
						isEditBoardModalOpen={isEditBoardModalOpen}
						editingBoard={editingBoard}
						handleChange={handleChange}
						closeModal={closeEditBoardModal}
						isDarkMode={isDarkMode}
					/>
				)}
			</div>
		)
	}

	return (
		<div className='columns-container'>
			<ul className='ul-columns'>
				{columns.map(column => (
					<li className='li-columns' key={column.id}>
						<div className='li-box'>
							<div className='circle'></div>
							<h3>
								{column.name} ({tasks.filter(task => task.status === column.id).length})
							</h3>
						</div>
						<ul className='ul-task'>
							{tasks
								.filter(task => task.status === column.id)
								.map(task => (
									<div
										className={`task-box custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
										key={`${task.id}-${task.subtasks.filter(subtask => subtask.completed).length}`}
										onClick={() => openTaskDetailsModal(task)}>
										<h4 className={`task-title custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>{task.name}</h4>
										<div className='task-subtasks'>
											{task.subtasks.filter(subtask => subtask.completed).length} of {task.subtasks.length} subtasks
										</div>
									</div>
								))}
						</ul>
					</li>
				))}
				<button
					onClick={() => selectedBoard && openEditBoardModal()}
					className={`add-new-column-btn custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
					+ New Column
				</button>
			</ul>

			{isEditBoardModalOpen && editingBoard && (
				<EditBoards
					isEditBoardModalOpen={isEditBoardModalOpen}
					editingBoard={editingBoard}
					handleChange={handleChange}
					closeModal={closeEditBoardModal}
					isDarkMode={isDarkMode}
				/>
			)}

			{isTaskDetailsModalOpen && selectedTask && (
				<TaskDetailsModal task={selectedTask} handleOverlayClick={closeTaskDetailsModal} />
			)}
		</div>
	)
}

export default Main
