import React, { ReactNode } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  modalSize?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  modalSize = "modal-md",
}) => {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div>
        <div className={`custom-modal animate-fade-from-top ${modalSize}`} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <button
            style={{
              position: "absolute",
              top: 0,
              right: 15,
              background: "transparent",
              border: "none",
              fontSize: 30,
              cursor: "pointer",
              color: "#6c757d",
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <h5 className="mt-2">{title}</h5>
          <div style={{ marginTop: 10 }} className=" w-full">
            {children}
          </div>
          {actions && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "end", width: "100%" }}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;