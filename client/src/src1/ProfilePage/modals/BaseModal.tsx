import * as React from "react";
import { Dialog, DialogContent } from "../ui/dialog";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children
}) => {
  return (
    <Dialog open={isOpen} modal={false} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {children}
      </DialogContent>
    </Dialog>
  );
};