import { useState } from "react";
import { Button } from "../ui/button";
import { ImageCarousel } from "../ui/image-carousel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePortfolio} from "../../lib/api";
import { useToast } from "../../hooks/use-toast";
import { format } from "date-fns";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import {Portfolio} from "../../lib/types";
import {PORTFOLIO_IMAGES} from '../../lib/constants'


/**
 * 
 * 
 * Portfolio Section Component
 * @param {Object} props - Component props
 * @param {Array} props.portfolios - Array of portfolio items
 * @param {Function} props.onAddPortfolio - Function to add a new portfolio
 * @param {Function} props.onEditPortfolio - Function to edit a portfolio
 * @param {Function} props.onViewDetails - Function to view portfolio details
 * @returns {JSX.Element} Portfolio section
 */

interface PortfolioSectionProps {
  portfolios: Portfolio[];
  onAddPortfolio: () => void;
  onEditPortfolio: (portfolio: Portfolio) => void;
  onViewDetails: (portfolio: Portfolio) => void;
}

export default function PortfolioSection({ 
  portfolios, 
  onAddPortfolio, 
  onEditPortfolio,
  onViewDetails
}: PortfolioSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: deletePortfolio,
    onSuccess: (_, portfolioId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio project has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete portfolio",
        description: "There was an error deleting your portfolio project.",
        variant: "destructive",
      });
      console.error("Error deleting portfolio:", error);
    },
  });

  const handleDelete = (portfolio : Portfolio, e) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this portfolio project?")) {
      deleteMutation.mutate(portfolio.portfolioId);
    }
  };

  const handleEdit = (portfolio  : Portfolio, e) => {
    e.stopPropagation();
    onEditPortfolio(portfolio);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Portfolio</h3>
        <Button 
          className="text-white gradient-blue"
          onClick={onAddPortfolio}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-gray-500">No portfolio projects yet</div>
          <Button 
            className="mt-4 text-white gradient-blue"
            onClick={onAddPortfolio}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolios.map((portfolio) => (
            <div 
              key={portfolio.portfolioId} 
              className="card-shadow rounded-lg overflow-hidden card-hover transition-all duration-300 cursor-pointer"
              onClick={() => onViewDetails(portfolio)}
            >
              <div className="relative">
                <ImageCarousel 
                  images={portfolio.imageUrl || []}
                  className="h-40"
                  alt={portfolio.sampleProjectTitle}
                />
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    size="icon"
                    className="bg-white bg-opacity-70 text-gray-700 hover:bg-opacity-100 transition-all h-6 w-6"
                    onClick={(e) => handleEdit(portfolio, e)}
                  >
                    <PencilIcon className="h-3 w-3" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white bg-opacity-70 text-red-500 hover:bg-opacity-100 transition-all h-6 w-6"
                    onClick={(e) => handleDelete(portfolio, e)}
                  >
                    <Trash2Icon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="p-3">
                <h4 className="font-bold text-gray-800 text-base truncate">{portfolio.sampleProjectTitle}</h4>
                <p className="text-gray-600 mt-1 text-xs line-clamp-2">{portfolio.sampleProjectDescription}</p>
                
                {/* <div className="mt-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {portfolio.skillName.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">{skill}</span>
                    ))}
                    {portfolio.skillName.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">+{portfolio.skillName.length - 3}</span>
                    )}
                  </div>
                </div> */}
                
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 text-xs">
                      {format(new Date(portfolio.completionDate), 'MMM yyyy')}
                    </span>
                  </div>
                  <Button 
                    className="gradient-blue text-white h-7 text-xs px-2 py-0"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(portfolio);
                    }}
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
