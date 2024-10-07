import React, { createContext, useState, useContext } from 'react';

const TaskModalContext = createContext();

export const TaskModalProvider = ({ children }) => {
    const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const openTaskDetailsModal = (task) => {
        setSelectedTask(task);
        setIsTaskDetailsModalOpen(true);
    };

    const closeTaskDetailsModal = () => {
        setSelectedTask(null);
        setIsTaskDetailsModalOpen(false);
    };

    return (
        <TaskModalContext.Provider
            value={{
                isTaskDetailsModalOpen,
                openTaskDetailsModal,
                closeTaskDetailsModal,
                selectedTask,
                setIsTaskDetailsModalOpen,
            }}
        >
            {children}
        </TaskModalContext.Provider>
    );
};

export const useTaskModal = () => useContext(TaskModalContext);