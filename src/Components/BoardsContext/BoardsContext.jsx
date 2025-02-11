import React, { createContext, useState, useEffect, useContext } from 'react'
import { useTasks } from '../Tasks/TaskContext'

export const BoardContext = createContext()

export const BoardProvider = ({ children }) => {
	const [boards, setBoards] = useState(() => {
		const savedBoards = localStorage.getItem('boards')
		return savedBoards ? JSON.parse(savedBoards) : []
	})

	const { deleteTasksByBoard } = useTasks()

	useEffect(() => {
		localStorage.setItem('boards', JSON.stringify(boards))
	}, [boards])

	const addBoard = newBoard => {
		setBoards(prevBoards => [newBoard, ...prevBoards])
	}

	
	const [selectedBoardId, setSelectedBoardId] = useState(null)

	const hasBoards = boards.length > 0

	const handleChange = (id, uptadeBoard) => {
		setBoards(prevBoards => prevBoards.map(board => (board.id === id ? { ...board, ...uptadeBoard } : board)))
	}


  const handleDeleteBoards = (boardId) => {
		const updatedBoards = boards.filter(board => board.id !== boardId)
		setBoards(updatedBoards)
		localStorage.setItem('boards', JSON.stringify(updatedBoards))
		
		deleteTasksByBoard(boardId)

		if (selectedBoardId === boardId) {
			setSelectedBoardId(null)
		}
	}

	return (
		<BoardContext.Provider
			value={{ boards, addBoard, selectedBoardId, setSelectedBoardId, hasBoards, handleChange, setBoards, handleDeleteBoards}}>
			{children}
		</BoardContext.Provider>
	)
}

export const useBoards = () => useContext(BoardContext)
