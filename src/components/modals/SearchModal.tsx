"use client";

import { useState, useEffect, useRef } from "react";
import { useUI } from "@/store/ui-store";
import { usePDF } from "@/store/pdf-store";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface SearchResult {
  id: string;
  page: number;
  text: string;
  context: string;
  position: { x: number; y: number };
}

export default function SearchModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    wholeWords: false,
    useRegex: false,
  });
  const [showOptions, setShowOptions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  if (!uiState.modals.search) return null;

  useEffect(() => {
    if (uiState.modals.search && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [uiState.modals.search]);

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "search" });
    setSearchQuery("");
    setSearchResults([]);
    setCurrentResultIndex(0);
    setShowOptions(false);
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (!pdfState.activeDocument) {
      toast.error("No document is currently open");
      return;
    }

    setIsSearching(true);

    try {
      // TODO: Implement actual PDF text search
      // This is a placeholder implementation
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate search delay

      const mockResults: SearchResult[] = [
        {
          id: "1",
          page: 1,
          text: searchQuery,
          context: `This is some context text containing ${searchQuery} in the document.`,
          position: { x: 100, y: 200 },
        },
        {
          id: "2",
          page: 3,
          text: searchQuery,
          context: `Another occurrence of ${searchQuery} found on page 3.`,
          position: { x: 150, y: 300 },
        },
        {
          id: "3",
          page: 5,
          text: searchQuery,
          context: `Final instance of ${searchQuery} located here.`,
          position: { x: 200, y: 150 },
        },
      ];

      setSearchResults(mockResults);
      setCurrentResultIndex(0);

      if (mockResults.length === 0) {
        toast.error("No results found");
      } else {
        toast.success(`Found ${mockResults.length} result(s)`);
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const navigateToResult = (index: number) => {
    if (index < 0 || index >= searchResults.length) return;

    const result = searchResults[index];
    setCurrentResultIndex(index);

    // Navigate to the page containing the result
    pdfDispatch({
      type: "SET_CURRENT_PAGE",
      payload: result.page,
    });

    // TODO: Highlight the search result on the page
    toast.success(`Navigated to result ${index + 1} of ${searchResults.length}`);
  };

  const goToNextResult = () => {
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    navigateToResult(nextIndex);
  };

  const goToPreviousResult = () => {
    const prevIndex = currentResultIndex === 0 ? searchResults.length - 1 : currentResultIndex - 1;
    navigateToResult(prevIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        goToPreviousResult();
      } else if (searchResults.length > 0) {
        goToNextResult();
      } else {
        performSearch();
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  };

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      searchOptions.caseSensitive ? "g" : "gi",
    );

    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Search Document</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-adobe-blue focus:border-adobe-blue"
              placeholder="Search in document..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              {searchResults.length > 0 && (
                <div className="flex items-center space-x-1 mr-2">
                  <button
                    onClick={goToPreviousResult}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Previous result (Shift+Enter)"
                  >
                    <ChevronUpIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goToNextResult}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Next result (Enter)"
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500 px-2">
                    {currentResultIndex + 1} of {searchResults.length}
                  </span>
                </div>
              )}
              <button
                onClick={() => setShowOptions(!showOptions)}
                className={`p-2 rounded transition-colors ${
                  showOptions ? "text-adobe-blue bg-adobe-blue/10" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Search options"
              >
                <Cog6ToothIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Options */}
          {showOptions && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchOptions.caseSensitive}
                    onChange={(e) => setSearchOptions((prev) => ({ ...prev, caseSensitive: e.target.checked }))}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">Case sensitive</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchOptions.wholeWords}
                    onChange={(e) => setSearchOptions((prev) => ({ ...prev, wholeWords: e.target.checked }))}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">Whole words</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchOptions.useRegex}
                    onChange={(e) => setSearchOptions((prev) => ({ ...prev, useRegex: e.target.checked }))}
                    className="rounded border-gray-300 text-adobe-blue focus:ring-adobe-blue"
                  />
                  <span className="ml-2 text-sm text-gray-700">Regular expression</span>
                </label>
              </div>
            </div>
          )}

          {/* Search Button */}
          <div className="mt-3 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {searchResults.length > 0 && <span>{searchResults.length} result(s) found</span>}
            </div>
            <button
              onClick={performSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {searchResults.map((result, index) => (
                <div
                  key={result.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    index === currentResultIndex ? "bg-adobe-blue/5 border-l-4 border-adobe-blue" : "hover:bg-gray-50"
                  }`}
                  onClick={() => navigateToResult(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-adobe-blue">Page {result.page}</span>
                        {index === currentResultIndex && (
                          <span className="px-2 py-1 text-xs bg-adobe-blue text-white rounded">Current</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {highlightSearchTerm(result.context, searchQuery)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && !isSearching ? (
            <div className="p-8 text-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms or options</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter a search term to find text in the document</p>
              <p className="text-sm text-gray-400 mt-1">Use Enter to search, Shift+Enter for previous result</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {searchResults.length} result(s) for "{searchQuery}"
              </span>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">Enter</kbd>
                <span className="text-gray-500">Next</span>
                <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">Shift+Enter</kbd>
                <span className="text-gray-500">Previous</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
