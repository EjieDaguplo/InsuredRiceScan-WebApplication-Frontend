import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps<T> {
  data: T[];
  initialItemsPerPage?: number;
  resetOnDataChange?: boolean;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  currentData: T[];
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  canGoToPrev: boolean;
  canGoToNext: boolean;
}

export function usePagination<T>({
  data,
  initialItemsPerPage = 10,
  resetOnDataChange = true,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // Reset to first page when data changes (if enabled)
  useEffect(() => {
    if (resetOnDataChange) {
      setCurrentPage(1);
    }
  }, [data.length, resetOnDataChange]);

  // Reset to first page when items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Navigation functions
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  // Navigation state
  const canGoToPrev = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    currentData,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
    goToPrevPage,
    goToNextPage,
    canGoToPrev,
    canGoToNext,
  };
}
