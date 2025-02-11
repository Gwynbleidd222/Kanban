import React, { createContext, useState, useContext, useEffect } from 'react'

const DarkModeContext = createContext()

export const DarkModeProvider = ({ children }) => {
	const [isDarkMode, setIsDarkMode] = useState(false)

	const toggleTheme = () => {
		setIsDarkMode(prevMode => !prevMode)
	}

	useEffect(() => {
		document.body.style.backgroundColor = isDarkMode ? '#20212C' : '#F4F7FD'
		const elementsToChange = document.querySelectorAll('.custom-dark-mode-component')
		elementsToChange.forEach(element => {
			element.style.backgroundColor = isDarkMode ? '#2B2C37' : '#ffffff'
		})

		const textElementsToChange = document.querySelectorAll('.custom-text-element')
		textElementsToChange.forEach(element => {
			element.style.color = isDarkMode ? '#ffffff' : '#000112'
		})

		

		return () => {
			document.body.style.backgroundColor = ''
		}
	}, [isDarkMode])

	return <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</DarkModeContext.Provider>
}

export const useDarkMode = () => useContext(DarkModeContext)