import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center transition-opacity duration-300" onClick={onClose}>
            <div
                className="bg-[rgb(var(--card))] w-full max-w-sm rounded-2xl shadow-2xl p-6 m-4 transform transition-all duration-300 ease-in-out scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-[rgb(var(--card-foreground))] mb-4">{title}</h2>
                <p className="text-[rgb(var(--muted-foreground))] mb-6 text-sm">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-[rgb(var(--muted-foreground))] bg-[rgb(var(--muted))] hover:opacity-80 transition-opacity"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg text-sm font-semibold bg-[rgb(var(--destructive))] text-white hover:opacity-90 transition-opacity shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
