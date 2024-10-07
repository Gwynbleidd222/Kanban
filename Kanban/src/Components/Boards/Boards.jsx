import React, { useState, useContext, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../../Components/Boards/addNewBoards.scss'
import { v4 as uuidv4 } from 'uuid'
import { BoardContext } from '../BoardsContext/BoardsContext'
import lightMode from '../../assets/icon-light-theme.svg'
import darkMode from '../../assets/icon-dark-theme.svg'
import { Switch } from '@mui/material'
import { useDarkMode } from '../../Context/DarkModeContext'
import IconBoard from '../Icon/IconBoard'
import IconCross from '../Icon/IconCross'
import HideSideBar from '../../assets/icon-hide-sidebar.svg'
import logoDark from '../../assets/logo-dark.svg'
import logoLight from '../../assets/logo-light.svg'

function Boards({ isBoardModalOpen, setIsBoardModalOpen }) {
	const { boards, addBoard, setSelectedBoardId } = useContext(BoardContext)
	const [isAddNewModalBoardOpen, setIsAddModalNewBoardOpen] = useState()
	const { isDarkMode, toggleTheme } = useDarkMode()
	const [columns, setColumns] = useState([{ id: uuidv4(), name: '' }])
	const [boardName, setBoardName] = useState('')
	const [boardNameError, setBoardNameError] = useState(false)
	const [maxLengthError, setMaxLengthError] = useState(false)
	const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768)

	useEffect(() => {
		if (isBoardModalOpen) {
			setBoardNameError(false)
			setMaxLengthError(false)
		}
	}, [isBoardModalOpen])

	useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

	const openAddNewBoardModal = () => {
		setIsAddModalNewBoardOpen(true)

		if (window.innerWidth > 768) {
			setIsBoardModalOpen(true)
		} else {
			setIsBoardModalOpen(false)
		}
	}

	const closeAddNewBoardModal = () => {
		setIsAddModalNewBoardOpen(false)
		setIsBoardModalOpen(true)
	}

	const addNewColumn = () => {
		setColumns([...columns, { id: uuidv4(), name: '' }])
	}

	const removeColumn = id => {
		const updatedColumns = columns.filter(column => column.id !== id)
		setColumns(updatedColumns)
	}

	const updateColumnName = (id, newName) => {
		setColumns(columns.map(column => (column.id === id ? { ...column, name: newName } : column)))
	}

	const handleSelectedBoard = boardId => {
		setSelectedBoardId(boardId)
		if (window.innerWidth > 768) {
			setIsBoardModalOpen(true)
		} else {
			setIsBoardModalOpen(false)
		}
	}

	const handleBoardNameChange = e => {
        const name = e.target.value
        if (name.length <= 30) { 
            setBoardName(name)
            setMaxLengthError(false)
        } else {
            setMaxLengthError(true) 
        }
        if (name.trim() !== '') {
            setBoardNameError(false)
        }
    }

	

	const handleCreateNewBoard = () => {
        if (boardName.trim() === '') {
            setBoardNameError(true)
        } else if (boardName.length > 30) {
            setMaxLengthError(true)
        } else {
            const newBoard = {
                id: uuidv4(),
                name: boardName,
                columns: columns
                    .filter(column => column.name.trim() !== '')
                    .map(column => ({
                        id: uuidv4(),
                        name: column.name,
                    })),
            }
            addBoard(newBoard)
            setBoardName('')
            setColumns([{ id: uuidv4(), name: '' }])
            closeAddNewBoardModal()
        }
    }

	return (
		<>
			<AnimatePresence>
				{isBoardModalOpen && (
					<>
						<motion.div
							key='overlay'
							className='overlay-board'
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.3 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
						/>
						<motion.div
							key='board-nav-overlay'
                            className={`board-nav-overlay custom-dark-mode-component screen-border ${isDarkMode ? 'dark' : 'light'}`}
                            initial={{ x: isLargeScreen ? '-100%' : 0, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: isLargeScreen ? '-100%' : 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}>
							<div className={`board-nav-content ${isDarkMode ? '#000112' : '#FFFFFF'}`}>
								<div className='nav-title-kanban'>
									<img src={isDarkMode ? logoLight : logoDark} alt='Logo Kanban' className='nav-logo-screen' />
								</div>
								<div className={`board-nav-body custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
									<p className='board-count-text'>all boards ({boards.length})</p>
									{boards.map(board => (
										<button
											key={board.id}
											className={`btn-new-board custom-dark-mode-component-boards ${isDarkMode ? 'dark' : 'light'}`}
											onClick={() => handleSelectedBoard(board.id)}>
											<IconBoard />
											{board.name}
										</button>
									))}
									<button
										onClick={openAddNewBoardModal}
										className={`btn-add-new-board custom-dark-mode-component-boards-new ${
											isDarkMode ? 'dark' : 'light'
										}`}>
										<IconBoard />+ Create New Board
									</button>
									<div className='dark-mode-boxes'>
										<div className={`dark-mode-box custom-switch ${isDarkMode ? 'dark' : 'light'}`}>
											<img src={lightMode} alt='Light Mode' />
											<Switch
												checked={isDarkMode}
												onChange={toggleTheme}
												sx={{
													'& .MuiSwitch-switchBase': {
														color: '#FFFFFF',
													},
													'& .MuiSwitch-switchBase.Mui-checked': {
														color: '#FFFFFF',
													},
													'& .MuiSwitch-track': {
														backgroundColor: '#635FC7',
														opacity: 1,
													},
													'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
														backgroundColor: '#635FC7',
														opacity: 1,
													},
												}}
											/>
											<img src={darkMode} alt='dark Mode' />
										</div>
									</div>
									<button className='hide-sidebar-box' onClick={() => setIsBoardModalOpen(false)}>
										<img src={HideSideBar} alt='Hide sidebar' />
										<p>Hide Sidebar</p>
									</button>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isAddNewModalBoardOpen && (
					<>
						<motion.div
							key='add-new-board-overlay'
							className='overlay'
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.3 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							onClick={closeAddNewBoardModal}
						/>
						<motion.div
							key='add-new-board-modal'
							className={`add-new-board-modal custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
							initial={{ opacity: 0, scale: 0.95, y: -20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: -20 }}
							transition={{ duration: 0.5, ease: 'easeOut' }}>
							<div className={`add-new-board-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
								<h3 className={`custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>Add New Board</h3>
								<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Board Name</p>

								<input
									className={`board-input-name input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
										boardNameError ? 'error' : ''
									}`}
									type='text'
									placeholder='e.g Web Design'
									value={boardName}
									onChange={handleBoardNameChange}
								/>
								{boardNameError && <p className='error-text-board'>Can't be empty</p>}
								{maxLengthError && <p className='error-text-board-length'>Board name cannot exceed 30 characters</p>}

								<p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Board Columns</p>
								<div className='column-inputs'>
									{columns.map(column => (
										<div className='column-input' key={column.id}>
											<input
												className={`input-dark-mode ${isDarkMode ? 'dark' : 'light'}`}
												type='text'
												value={column.name}
												onChange={e => updateColumnName(column.id, e.target.value)}
											/>
											<IconCross onClick={() => removeColumn(column.id)} />
										</div>
									))}
								</div>
								<button className='btn-add-new-board' onClick={addNewColumn}>
									+ Add New Column
								</button>
								<button className='btn-create-new-board' onClick={handleCreateNewBoard}>
									Create New Board
								</button>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	)
}

export default Boards
