// SearchAndFilterBar.tsx
import React from "react";

type Props = {
  filters: any;
  setSearchTerm: (term: string) => void;
  onSearch?: (term: string) => void;
  setFilters: (filters: any) => void;
};

const SearchAndFilterBar = ({ setSearchTerm, filters, setFilters }: Props) => (
  <div
    className="
      flex flex-col sm:flex-row 
      gap-4 
      justify-center 
      items-stretch sm:items-center 
      w-full sm:w-4/5 md:w-2/3 lg:w-1/2 
      mb-8 
      bg-cream 
      px-4 sm:px-6 md:px-10 
      py-4 
      rounded-lg 
      shadow-md
    "
  >
    {/* Price Filter */}
    <select
      className="flex-1 min-w-0 rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, price: e.target.value })}
    >
      <option value="">Price</option>
      <option value="low">Low</option>
      <option value="mid">Mid</option>
      <option value="high">High</option>
    </select>

    {/* Duration Filter */}
    <select
      className="flex-1 min-w-0 rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
    >
      <option value="">Duration</option>
      <option value="2">2 hours</option>
      <option value="3">3 hours</option>
      <option value="4">4 hours</option>
      <option value="6">6 hours</option>
      <option value="8">8 hours</option>
    </select>

    {/* Tour Type Filter */}
    <select
      className="flex-1 min-w-0 rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
    >
      <option value="">Tour Type</option>
      <option value="sunset">Sunset</option>
      <option value="eco">Eco</option>
      <option value="private">Private</option>
    </select>

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search"
      className="flex-1 min-w-0 rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

export default SearchAndFilterBar;
