'use client';

import { useEffect, useRef, useState } from "react";
import { AutoCompleteBox } from "./AutoCompleteBox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { MdAutoAwesome } from "react-icons/md";

type ExtractedFilters = {
  keywords: string;
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  attributes: {
    color: string | null;
    style: string | null;
    material: string | null;
  };
  interpretation: string | null;
};

const SearchBar = () => {
    const router = useRouter();
    const params = useSearchParams();
    const pathname = usePathname();

    const initialQuery = params?.get('q')?.toString() || '';

    const [aiProcessing, setAiProcessing] = useState(false);
    const [suggestions, setSuggestions] = useState<
        Array<{ _id: string; title: string }>
    >([]);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedSearchTerm = useDebounce(inputValue, 300);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);

    useEffect(()=>{
        const fetchSuggestions = async()=>{
            if(debouncedSearchTerm.length < 2){
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try{
                const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(debouncedSearchTerm)}`);
                const data = await res.json();
                setSuggestions(data.suggestions || []);
            }catch(error){
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }finally {
                setIsLoading(false);
            }
        };
        fetchSuggestions();
    },[debouncedSearchTerm]);

    useEffect(()=>{
        const handleClickOutside = (e: MouseEvent) => {
            if(formRef.current && !formRef.current.contains(e.target as Node)){
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const searchTerm = formData.get('searchTerm') as string ?? "";
        handleSubmit(searchTerm);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;
        setInputValue(nextValue);
        if (!nextValue) {
            setShowSuggestions(false);
            setAiInterpretation(null);
            return;
        }
        setShowSuggestions(true);
    }
    const handleInputFocus = () => {
        if (inputValue.length >= 2) {
            setShowSuggestions(true);
        }
    }
    const handleSelectSuggestion = (title: string) => {
        handleSubmit(title);
        setSuggestions([]);
        setInputValue('');
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') {
            return;
        }

        // Route Enter through the native form submit path.
        e.preventDefault();
        formRef.current?.requestSubmit();
    }

    const processAISearch = async (
        query: string,
    ): Promise<ExtractedFilters | null> => {
        try{
            const response = await fetch('/api/ai-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            if (!response.ok) {
                return null;
            }
            const data = await response.json();
            if (data.isNaturalLanguage && data.filters) {
                return data.filters;
            }
            return null;
        }catch(error){
            console.error('Error processing AI search:', error);
            return null;
        }
    }

    const handleSubmit = async (searchValue: string) => {
        const searchTerm = searchValue as string;
        if (!searchTerm) {
            const searchParams = new URLSearchParams(params ?? undefined);
            searchParams.delete('q');
            searchParams.delete('priceMin');
            searchParams.delete('priceMax');
            searchParams.delete('aiCategory');
            router.push(pathname === '/products' ? '/products' : '/');
            setAiInterpretation(null);
            return;
        }

        // Check if it looks like a natural language query (more than 3 words)
        const words = searchTerm.trim().split(/\s+/);
        const isLikelyNaturalLanguage = words.length > 3;

        let filters: ExtractedFilters | null = null;

        if (isLikelyNaturalLanguage) {
            setAiProcessing(true);
            filters = await processAISearch(searchTerm);
            setAiProcessing(false);
        }

        const searchParams = new URLSearchParams();

        if (filters && filters.interpretation) {
          // Use AI-extracted filters
          searchParams.set('q', filters.keywords);

          if (filters.category) {
            searchParams.set('aiCategory', filters.category);
          }
          if (filters.priceMin !== null) {
            searchParams.set('priceMin', filters.priceMin.toString());
          }
          if (filters.priceMax !== null) {
            searchParams.set('priceMax', filters.priceMax.toString());
          }

          setAiInterpretation(filters.interpretation);
        } else {
            // Regular keyword search
            searchParams.set('q', searchTerm);
            setAiInterpretation(null);
        }

        if (pathname === '/products') {
            router.push(`${pathname}?${searchParams.toString()}`);
        } else {
            router.push(`/products?${searchParams.toString()}`);
        }
        setInputValue('');
        if (searchInputRef.current) {
        searchInputRef.current.value = '';
        }
        setShowSuggestions(false);
    };

    const isMainPage = pathname === '/' || pathname === '/products';
    if (!isMainPage) return null;

    return (
        <div className="relative">
            <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="w-40 md:w-80 sm:w-40 mx-auto relative">
                <div
                className="flex items-center gap-2 rounded-xl bg-white border-2
                border-black/10 focus-within:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-center w-40 md:w-80 sm:w-40 pl-2">
                        <input
                            type="text"
                            ref={searchInputRef}
                            name="searchTerm"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            autoComplete="off"
                            placeholder="Try: blue dress under $50"
                            className="flex-1 px-3 py-2 border-none focus:outline-none
                            focus:ring-0 placeholder:text-zinc:400 w-40 md:w-80 sm:w-40 text-sm"
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            type="submit"
                            disabled={aiProcessing}
                            className="p-2 bg-slate-700 text-white rounded-r-md hover:opacity-80 disabled:opacity-50">
                            {aiProcessing ? (
                                <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>
                </div>
                <AutoCompleteBox
                    suggestions={suggestions}
                    isLoading={isLoading}
                    onSelect={handleSelectSuggestion}
                    visible={showSuggestions}
                />
            </form>
            {aiInterpretation && (
                <div className="absolute top-full left-0 right-0 mt-1 mx-auto w-40 md:w-80 sm:w-40">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-xs flex items-center gap-1">
                    <MdAutoAwesome className="text-purple-500 flex-shrink-0" size={14} />
                    <span className="text-purple-700 truncate">{aiInterpretation}</span>
                    <button
                    onClick={() => setAiInterpretation(null)}
                    className="ml-auto text-purple-400 hover:text-purple-600">
                    ×
                    </button>
                </div>
                </div>
            )}
        </div>
    )
}

export default SearchBar;