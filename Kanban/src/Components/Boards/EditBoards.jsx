import React, { useState, useEffect } from 'react'
import '../../Components/Boards/addNewBoards.scss'
import { motion, AnimatePresence } from 'framer-motion'
import crossIcon from '../../assets/icon-cross.svg'
import { useDarkMode } from '../../Context/DarkModeContext'
import { v4 as uuidv4 } from 'uuid'
import IconCross from '../Icon/IconCross'

const EditBoards = ({ isEditBoardModalOpen, editingBoard, handleChange, closeModal }) => {
    const [columns, setColumns] = useState(editingBoard ? editingBoard.columns : [])
    const [boardName, setBoardName] = useState(editingBoard ? editingBoard.name : '')
    const { isDarkMode } = useDarkMode()
    const [boardNameError, setBoardNameError] = useState(false)
	const [columnErrors, setColumnErrors] = useState([])
    const [maxLengthError, setMaxLengthError] = useState(false)

    useEffect(() => {
        if (editingBoard) {
            setBoardName(editingBoard.name)
            setColumns(editingBoard.columns || [])
            setMaxLengthError(false)
        }
    }, [editingBoard])

    const updateColumnName = (id, newName) => {
        setColumns(columns.map(column => (column.id === id ? { ...column, name: newName } : column)))
        setColumnErrors({ ...columnErrors, [id]: false })

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


    const addNewColumn = () => {
        const newColumn = { id: uuidv4(), name: '' }
        setColumns([...columns, newColumn])
        setColumnErrors({ ...columnErrors, [newColumn.id]: false })
    }

    const removeColumn = id => {
        setColumns(columns.filter(column => column.id !== id))
        setColumnErrors(prev => {
            const updatedErrors = { ...prev }
            delete updatedErrors[id]
            return updatedErrors
        })
    }

    

    const saveChanges = () => {
        let valid = true

        if (boardName.trim() === '') {
            setBoardNameError(true)
            valid = false
        } else {
            setBoardNameError(false)
        }

        const updatedColumns = columns.map(column => {
            if (column.name.trim() === '') {
                setColumnErrors(prev => ({ ...prev, [column.id]: true }))
                valid = false
            }
            return column
        })

        if (valid) {
            handleChange(editingBoard.id, { name: boardName, columns: updatedColumns })
            closeModal()
            setBoardName('')
        }
    }

    return (
        <AnimatePresence>
            {isEditBoardModalOpen && editingBoard && (
                <>
                    <motion.div
                        key='overlay'
                        className='overlay'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={closeModal}
                    />

                    <motion.div
                        key='add-new-board-modal'
                        className={`add-new-board-modal custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}>
                        <div className={`add-new-board-content custom-dark-mode-component ${isDarkMode ? 'dark' : 'light'}`}>
                            <h3 className={`custom-text-element ${isDarkMode ? 'dark' : 'light'}`}>Edit Board</h3>
                            <p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Board Name</p>

                            <input
                                className={`board-input-name input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${
                                    boardNameError ? 'error' : ''
                                } `}
                                type='text'
                                value={boardName}
                                onChange={handleBoardNameChange}
                                
                            />
                            {boardNameError && <p className='error-text-board'>Can't be empty</p>}
                            {maxLengthError && <p className='error-text-board-length'>Board name cannot exceed 30 characters</p>}

                            <p className={`custom-board-columns ${isDarkMode ? 'dark' : 'light'}`}>Board Columns</p>
                            <div className='column-inputs'>
                                {columns?.map((column) => (
                                    <div className='column-input' key={column.id}>
                                        <input
                                            className={` input-dark-mode ${isDarkMode ? 'dark' : 'light'} ${columnErrors[column.id] ? 'error' : ''}`}
                                            type='text'
                                            value={column.name}
                                            onChange={e => updateColumnName(column.id, e.target.value)}
                                            placeholder={columnErrors[column.id] ? "Can't be empty" : ''}
                                        />
                                        
                                        <IconCross
                                                fill={columnErrors[column.id] ? '#EA5555' : '#828FA3'}
												onClick={() => removeColumn(column.id)}
										/>
                                        
                                    </div>
                                ))}
                            </div>

                            <button
                                className='btn-add-new-board'
                                onClick={addNewColumn}
                            >
                                + Add New Column
                            </button>

                            <button className='btn-create-new-board' onClick={saveChanges}>
                                Save
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default EditBoards
