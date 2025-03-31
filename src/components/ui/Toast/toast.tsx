import React, { useEffect } from 'react';
import './toast.scss';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, title, description, variant = 'default', duration = 5000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast--${variant}`}>
      <div className="toast__content">
        <div className="toast__title">{title}</div>
        {description && <div className="toast__description">{description}</div>}
      </div>
      <button className="toast__close" onClick={() => onClose(id)}>
        ×
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};