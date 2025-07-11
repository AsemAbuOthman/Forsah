import { useState } from "react";
import { Button } from "../ui/button";
import { ImageCarousel } from "../ui/image-carousel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePortfolio } from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Portfolio } from "../../lib/types";
import { DeleteConfirmationModal } from "../ui/delete-confirmation-modal";

interface PortfolioSectionProps {
  portfolios: Portfolio[];
  onAddPortfolio: () => void;
  onEditPortfolio: (portfolio: Portfolio) => void;
  onViewDetails: (portfolio: Portfolio) => void;
  isEditable?: boolean;
  refetchPortfolios?: () => Promise<void>; // Add refetch capability
}

export default function PortfolioSection({
  portfolios,
  onAddPortfolio,
  onEditPortfolio,
  onViewDetails,
  isEditable = false,
  refetchPortfolios,
}: PortfolioSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    // Optimistic update implementation
    onMutate: async (portfolioId) => {
      // Cancel any outgoing refetches to avoid overwriting
      await queryClient.cancelQueries(['portfolios']);
      
      // Snapshot the previous value
      const previousPortfolios = queryClient.getQueryData<Portfolio[]>(['portfolios']);
      
      // Optimistically remove the portfolio
      queryClient.setQueryData(['portfolios'], (old: Portfolio[] = []) => 
        old.filter(p => p.portfolioId !== portfolioId)
      );
      
      return { previousPortfolios };
    },
    onSuccess: async () => {
      // Optional: refetch to ensure server-state matches client-state
      if (refetchPortfolios) {
        await refetchPortfolios();
      }
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio project has been deleted successfully.",
      });
      setPortfolioToDelete(null);
    },
    onError: (error, portfolioId, context) => {
      // Rollback on error
      queryClient.setQueryData(['portfolios'], context?.previousPortfolios);
      toast({
        title: "Failed to delete portfolio",
        description: "There was an error deleting your portfolio project.",
        variant: "destructive",
      });
      console.error("Error deleting portfolio:", error);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries(['portfolios']);
    },
  });

  const handleDeleteClick = (portfolio: Portfolio, e: React.MouseEvent) => {
    e.stopPropagation();
    setPortfolioToDelete(portfolio);
  };

  const handleConfirmDelete = () => {
    if (portfolioToDelete) {
      deleteMutation.mutate(portfolioToDelete.portfolioId);
    }
  };

  const handleCancelDelete = () => {
    setPortfolioToDelete(null);
  };

  const handleEdit = (portfolio: Portfolio, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditPortfolio(portfolio);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
      <DeleteConfirmationModal
        isOpen={!!portfolioToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={portfolioToDelete ? `"${portfolioToDelete.sampleProjectTitle}"` : "this project"}
        isLoading={deleteMutation.isPending}
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Portfolio</h3>
        {isEditable && (
          <Button 
            className="text-white gradient-blue" 
            onClick={onAddPortfolio}
            disabled={deleteMutation.isPending}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        )}
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No portfolio projects yet</div>
          {isEditable && (
            <Button 
              className="mt-4 text-white gradient-blue" 
              onClick={onAddPortfolio}
              disabled={deleteMutation.isPending}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Your First Project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 ">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio.portfolioId}
              className={`card-shadow rounded-lg overflow-hidden card-hover transition-all duration-300 cursor-pointer ${
                deleteMutation.isPending && portfolioToDelete?.portfolioId === portfolio.portfolioId 
                  ? 'opacity-50' : ''
              }`}
              onClick={() => onViewDetails(portfolio)}
            >
              <div className="relative">
                <ImageCarousel
                  images={portfolio.images || []}
                  className="h-40 md:h-60"
                  alt={portfolio.sampleProjectTitle}
                />

                {isEditable && (
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      size="icon"
                      className="bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100 transition-all h-6 w-6"
                      onClick={(e) => handleEdit(portfolio, e)}
                      disabled={deleteMutation.isPending}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      className="bg-white bg-opacity-70 text-red-500 hover:bg-opacity-100 transition-all h-6 w-6"
                      onClick={(e) => handleDeleteClick(portfolio, e)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2Icon className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-3">
                <h4 className="font-bold text-gray-800 text-base truncate">
                  {portfolio.sampleProjectTitle}
                </h4>
                <p className="text-gray-600 mt-1 text-xs line-clamp-2">
                  {portfolio.sampleProjectDescription}
                </p>

                <div className="mt-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {portfolio.skillName.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {portfolio.skillName.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        +{portfolio.skillName.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <span className="text-gray-500 text-xs">
                    {format(new Date(portfolio.completionDate), "MMM yyyy")}
                  </span>
                  <Button
                    className="gradient-blue text-white h-7 text-xs px-2 py-0"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(portfolio);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}