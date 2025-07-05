// components/ui/delete-confirmation-modal.tsx
import { Button } from "./button";
import { Loader2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
isOpen: boolean;
onClose: () => void;
onConfirm: () => void;
itemName: string;
isLoading?: boolean;
}

export function DeleteConfirmationModal({
isOpen,
onClose,
onConfirm,
itemName,
isLoading = false,
}: DeleteConfirmationModalProps) {
if (!isOpen) return null;

return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        disabled={isLoading}
        >
        <X className="h-5 w-5" />
        </button>

        <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Delete Education Entry
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to delete {itemName}? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
            <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 border-gray-300 dark:border-gray-600 text-white"
            disabled={isLoading}
            >
            Cancel
            </Button>
            <Button
            variant="destructive"
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
            >
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
                </>
            ) : (
                "Delete"
            )}
            </Button>
        </div>
        </div>
    </div>
    </div>
);
}