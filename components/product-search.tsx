"use client";
import { findSearchProducts } from "@/app/clientQueries";
import { useState } from "react";
import { AsyncSearchInput } from "./async-search";

export function ProductSearch() {
  const [value, setValue] = useState("");

  const onSearch = async (query: string) => {
    console.log(query);
    return findSearchProducts(query);
  };

  return (
    <AsyncSearchInput
      value={value}
      onChange={setValue}
      onSearch={onSearch}
      placeholder="Start typing to search..."
      maxItems={100}
      debounceMs={400}
    />
  );
}
