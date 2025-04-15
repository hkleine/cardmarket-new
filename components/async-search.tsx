"use client";

import { Check, Loader2, Search, X } from "lucide-react";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export type SearchItem = {
  value: string;
  name: string;
  setCode: string;
  rarity?: string;
  imageUrl: string | null;
};

interface AsyncSearchInputProps {
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => Promise<SearchItem[]>;
  debounceMs?: number;
  maxItems?: number;
  className?: string;
}

export function AsyncSearchInput({
  placeholder = "Search...",
  emptyMessage = "No results found.",
  loadingMessage = "Loading...",
  value,
  onChange,
  onSearch,
  debounceMs = 400,
  maxItems = 100,
  className,
}: AsyncSearchInputProps) {
  const router = useRouter();

  // Input state
  const [inputValue, setInputValue] = React.useState("");
  const deferredInputValue = React.useDeferredValue(inputValue); // Defer the input value for search

  // UI state
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Results state
  const [items, setItems] = React.useState<SearchItem[]>([]);
  const [displayedItems, setDisplayedItems] = React.useState<SearchItem[]>([]);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 20;

  // Refs
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Use a ref for the enter key handler to always have the latest inputValue
  const handleEnterKeyRef = React.useRef<(event: KeyboardEvent) => void>(null);

  // Search effect that runs when the deferred input value changes
  React.useEffect(() => {
    const query = deferredInputValue.trim();

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    if (!query) {
      setItems([]);
      setDisplayedItems([]);
      return;
    }

    // Set a timeout for the search
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);

      try {
        const results = await onSearch(query);
        setItems(results);
        setDisplayedItems(results.slice(0, itemsPerPage));
        setPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
        setItems([]);
        setDisplayedItems([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [deferredInputValue, onSearch, debounceMs, itemsPerPage]);

  // Handle input changes
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Open the popover when the user starts typing
      if (value.trim() && !open) {
        setOpen(true);
      }

      // Close the popover if the input is cleared
      if (!value.trim() && open) {
        setOpen(false);
      }
    },
    [open]
  );

  // Load more items when scrolling
  const loadMoreItems = React.useCallback(() => {
    if (page * itemsPerPage < items.length && page * itemsPerPage < maxItems) {
      const nextPage = page + 1;
      setPage(nextPage);
      setDisplayedItems(items.slice(0, nextPage * itemsPerPage));
    }
  }, [items, page, maxItems, itemsPerPage]);

  // Handle scroll to bottom
  const handleScrollToBottom = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const bottom =
        Math.abs(
          e.currentTarget.scrollHeight -
            e.currentTarget.clientHeight -
            e.currentTarget.scrollTop
        ) < 1;

      if (bottom) {
        loadMoreItems();
      }
    },
    [loadMoreItems]
  );

  // Clear the input
  const handleClear = React.useCallback(() => {
    setInputValue("");
    onChange("");
    setOpen(false);
    setItems([]);
    setDisplayedItems([]);

    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange]);

  // Select an item
  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const selectedItem = items.find((item) => item.value === currentValue);
      if (selectedItem) {
        onChange(currentValue);
        setInputValue(selectedItem.name);
        setOpen(false);
      }
    },
    [items, onChange]
  );

  // Function to handle Escape key
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  // Update the enter key handler ref whenever inputValue changes
  React.useEffect(() => {
    handleEnterKeyRef.current = (event: KeyboardEvent) => {
      if (event.key === "Enter" && open) {
        console.log("Searching for:", inputValue);
        router.push(`/products?search=${encodeURIComponent(inputValue)}`);
        setOpen(false);
      }
    };
  }, [inputValue, open, router]);

  // Use the ref in the actual event handler
  const handleEnterKey = React.useCallback((event: KeyboardEvent) => {
    handleEnterKeyRef.current?.(event);
  }, []);

  // Handle outside click and Escape key
  React.useEffect(() => {
    // Function to handle clicks outside the component
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        open
      ) {
        setOpen(false);
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);
    document.addEventListener("keydown", handleEnterKey);

    // Clean up event listeners
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, [open, handleEnterKey]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="flex">
        <Input
          startIcon={Search}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.trim()) {
              setOpen(true);
            }
          }}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute right-8 top-0 flex h-full items-center pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-0"
            onClick={handleClear}
            tabIndex={-1}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
          <Command shouldFilter={false}>
            <CommandList
              onScroll={handleScrollToBottom}
              className="max-h-[300px]"
            >
              {!isLoading &&
              displayedItems.length === 0 &&
              deferredInputValue.trim() !== "" ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : null}
              {deferredInputValue.trim() === "" ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Start typing to search
                </div>
              ) : null}
              <CommandGroup>
                {displayedItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={handleSelect}
                    className="cursor-pointer"
                    asChild
                  >
                    <Link
                      href={`/products/${item.value}`}
                      className="flex items-center gap-4"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.imageUrl && (
                        <Image
                          alt="product image"
                          src={item.imageUrl}
                          height={40}
                          width={30}
                        />
                      )}
                      <span>{item.name}</span>
                      <span>{item.setCode}</span>
                      {item.rarity && <span>({item.rarity})</span>}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              {!isLoading && items.length > displayedItems.length && (
                <div className="flex items-center justify-center py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={loadMoreItems}
                    className="text-xs text-muted-foreground"
                  >
                    Load more
                  </Button>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
                  <span className="text-xs text-muted-foreground">
                    {loadingMessage}
                  </span>
                </div>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
