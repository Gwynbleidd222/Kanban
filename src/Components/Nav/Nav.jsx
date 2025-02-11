import React, { useState } from 'react'
import logo from '../../assets/logo-mobile.svg'
import chevronIconDown from '../../assets/icon-chevron-down.svg'
import chevronIconUp from '../../assets/icon-chevron-up.svg'
import addTaskIcon from '../../assets/icon-add-task-mobile.svg'
import ellipsisIcon from '../../assets/icon-vertical-ellipsis.svg'
import '../../Components/Nav/nav.scss'
import { useBoards } from '../BoardsContext/BoardsContext'
import DeleteBoards from '../Boards/DeleteBoards'
import EditBoards from '../Boards/EditBoards'
import { useModal } from '../BoardsContext/ModalContext'
import { motion } from 'framer-motion'
import { useDarkMode } from '../../Context/DarkModeContext'
import AddNewTask from '../../Components/Tasks/AddNewTask'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'
import showSideBar from '../../assets/icon-show-sidebar.svg'


function Nav({ isBoardModalOpen, setIsBoardModalOpen, openAddNewTaskModal, closeAddNewTaskModal, isNewTaskModalOpen }) {
	const { boards, selectedBoardId, handleDeleteBoards, handleChange } = useBoards()
	const selectedBoard = boards.find(board => board.id === selectedBoardId)
	const { isEditBoardModalOpen, setIsEditBoardModalOpen } = useModal()
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [boardToDelete, setBoardToDelete] = useState(null)
	const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
	const { isDarkMode } = useDarkMode()

	const openModalDelete = (boardId, boardName) => {
		if (boardId) {
			setBoardToDelete({ id: boardId, name: boardName })
			setIsDeleteModalOpen(true)
		}
	}

	const closeModalDelete = () => {
		setIsDeleteModalOpen(false)
		setBoardToDelete(null)
	}

	const handleDeleteBoard = boardId => {
		handleDeleteBoards(boardId)
		closeModalDelete()
	}

	const toggleBoard = () => {
		setIsBoardModalOpen(!isBoardModalOpen)
	}

	const openEditBoardModal = () => {
		setIsEditBoardModalOpen(true)
	}

	const closeEditBoardModal = () => {
		setIsEditBoardModalOpen(false)
	}
	const handleAddTaskClick = () => {
		if (!isAddTaskDisabled) {
			openAddNewTaskModal()
		}
	}

	const isAddTaskDisabled =
		!selectedBoard ||
		selectedBoard.columns.length === 0 ||
		selectedBoard.columns.some(column => column.name.trim() === '')

	return (
		<>
			<nav className={`nav-bar custom-dark-mode-component screen-border ${isDarkMode ? 'dark' : 'light'}`}>
				<div className='nav-left'>
					<div className='nav-title-kanban'>
						<img src={isDarkMode ? logoLight : logoDark} alt='Logo Kanban' className='nav-logo-screen' />
					</div>
					
					<img src={logo} alt='Logo' className='nav-logo-mobile' />
					<h1 className={`nav-title-board custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>
						{selectedBoard ? selectedBoard.name : 'Select Board'}
					</h1>
					<img
						src={isBoardModalOpen ? chevronIconUp : chevronIconDown}
						alt='Dropdown'
						onClick={toggleBoard}
						className='nav-chevron-icon-mobile'
					/>
					{!isBoardModalOpen && (
						<div className='show-sidebar-box'>
							<img src={showSideBar} alt='show side bar' onClick={toggleBoard} className='nav-sidebar-icon-screen' />
						</div>
					)}
				</div>
				<div className='nav-right'>
					<button
						className={`nav-add-task-button-mobile ${isAddTaskDisabled ? 'disabled' : ''}`}
						disabled={isAddTaskDisabled}
						onClick={handleAddTaskClick}>
						<img src={addTaskIcon} alt='Add Task' className='nav-add-task-icon' />
					</button>
					<button
						className={`nav-add-task-button-screen ${isAddTaskDisabled ? 'disabled' : ''}`}
						disabled={isAddTaskDisabled}
						onClick={handleAddTaskClick}>
						+ Add New Task
					</button>
					<AddNewTask isNewTaskModalOpen={isNewTaskModalOpen} closeAddNewTaskModal={closeAddNewTaskModal} />
					<button onClick={() => setIsOptionsModalOpen(!isOptionsModalOpen)} className='nav-options-btn'>
						<img src={ellipsisIcon} alt='Options' className='nav-ellipsis-icon' />
					</button>

					{isOptionsModalOpen && selectedBoard && (
						<motion.div className={`options-modal custom-dark-mode-component-options ${isDarkMode ? 'dark' : 'light'}`}>
							<div className='options-content'>
								<button
									className='options-edit-btn'
									onClick={() => {
										setIsOptionsModalOpen(false)
										openEditBoardModal()
									}}>
									Edit Board
								</button>
								<button
									className='options-delete-btn'
									onClick={() => {
										setIsOptionsModalOpen(false)
										openModalDelete(selectedBoard.id, selectedBoard.name)
									}}>
									Delete Board
								</button>
							</div>
						</motion.div>
					)}

					{isEditBoardModalOpen && selectedBoard && (
						<EditBoards
							isEditBoardModalOpen={isEditBoardModalOpen}
							editingBoard={selectedBoard}
							handleChange={handleChange}
							closeModal={closeEditBoardModal}
						/>
					)}

					{isDeleteModalOpen && boardToDelete && (
						<DeleteBoards
							boardId={boardToDelete.id}
							boardName={boardToDelete.name}
							closeModalDelete={closeModalDelete}
							handleDeleteBoard={handleDeleteBoard}
						/>
					)}
				</div>
			</nav>
		</>
	)
}

export default Nav
