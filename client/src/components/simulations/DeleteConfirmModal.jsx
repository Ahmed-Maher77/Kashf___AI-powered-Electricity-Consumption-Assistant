import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error("Failed to confirm action:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={!isDeleting ? onClose : undefined}
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm bg-kashf-surface border border-kashf-border rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex justify-between items-start p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-1 text-red-500 shrink-0">
                                    <AlertTriangle className="size-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
                                    <p className="text-sm text-neutral-400">{message}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-2 flex gap-3">
                            <button 
                                onClick={onClose}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {t('common.cancel', "Cancel")}
                            </button>
                            <button 
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    t('common.delete', "Delete")
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;
