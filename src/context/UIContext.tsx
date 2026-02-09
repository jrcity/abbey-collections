import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileAlert, MobileConfirm, AlertType } from '@/components/ui/CustomUI';

interface UIContextType {
    showAlert: (message: string, type?: AlertType) => void;
    showConfirm: (message: string, onConfirm: () => void) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<{ message: string; type: AlertType } | null>(null);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

    const showAlert = useCallback((message: string, type: AlertType = 'info') => {
        setAlert({ message, type });
        // Auto-close success/info alerts after 4 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => setAlert(prev => prev?.message === message ? null : prev), 4000);
        }
    }, []);

    const showConfirm = useCallback((message: string, onConfirm: () => void) => {
        setConfirm({ message, onConfirm });
    }, []);

    const handleConfirm = () => {
        if (confirm) {
            confirm.onConfirm();
            setConfirm(null);
        }
    };

    return (
        <UIContext.Provider value={{ showAlert, showConfirm }}>
            {children}

            {/* Global Alert Overlay */}
            <AnimatePresence>
                {alert && (
                    <MobileAlert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                )}
            </AnimatePresence>

            {/* Global Confirm Overlay */}
            <AnimatePresence>
                {confirm && (
                    <MobileConfirm
                        message={confirm.message}
                        onConfirm={handleConfirm}
                        onCancel={() => setConfirm(null)}
                    />
                )}
            </AnimatePresence>
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
