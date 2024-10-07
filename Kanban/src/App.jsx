import React, { useState, useEffect } from 'react'
import Nav from './Components/Nav/Nav'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Boards from './Components/Boards/Boards'
import { BoardProvider } from './Components/BoardsContext/BoardsContext'
import Main from './Components/Main/Main'
import { ModalProvider } from './Components/BoardsContext/ModalContext'
import { DarkModeProvider } from './Context/DarkModeContext'
import { TaskProvider } from './Components/Tasks/TaskContext'
import { ColumnsProvider, useColumns } from './Context/ColumnsContext'
import { TaskModalProvider } from './Context/TaskModalContext'
import { EditTaskModalProvider } from './Context/TaskModalEditContext'

function App() {
	const [isBoardModalOpen, setIsBoardModalOpen] = useState(false)
	const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)
	const openAddNewTaskModal = () => {
		setIsNewTaskModalOpen(true)
	}
	const [isBoardEmpty, setIsBoardEmpty] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setIsBoardModalOpen(true)
			} else {
				setIsBoardModalOpen(false)
			}
		}

		handleResize()

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const closeAddNewTaskModal = () => {
		setIsNewTaskModalOpen(false)
	}

	return (
		<TaskProvider>
			<BoardProvider>
				<DarkModeProvider>
					<ColumnsProvider>
						<ModalProvider>
							<TaskModalProvider>
								<EditTaskModalProvider>
									<Router>
										<Nav
											isBoardModalOpen={isBoardModalOpen}
											setIsBoardModalOpen={setIsBoardModalOpen}
											openAddNewTaskModal={openAddNewTaskModal}
											closeAddNewTaskModal={closeAddNewTaskModal}
											setIsNewTaskModalOpen={setIsNewTaskModalOpen}
											isNewTaskModalOpen={isNewTaskModalOpen}
										/>
										<div className={`app-container ${isBoardModalOpen ? 'board-nav-opened' : ''}`}>
											<div className={`main-content-screen ${isBoardEmpty ? 'center-content' : ''}`}>
												<Routes>
													<Route
														path='/'
														element={
															<Boards isBoardModalOpen={isBoardModalOpen} setIsBoardModalOpen={setIsBoardModalOpen} />
														}
													/>
												</Routes>

												<Main setIsBoardModalOpen={setIsBoardModalOpen} setIsBoardEmpty={setIsBoardEmpty} />
											</div>
										</div>
									</Router>
								</EditTaskModalProvider>
							</TaskModalProvider>
						</ModalProvider>
					</ColumnsProvider>
				</DarkModeProvider>
			</BoardProvider>
		</TaskProvider>
	)
}

export default App
