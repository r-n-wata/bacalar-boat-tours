// SearchAndFilterBar.tsx
import React from "react";

type Props = {
  filters: any;
  setSearchTerm: (term: string) => void;
  onSearch: (term: string) => void;
  setFilters: (filters: any) => void;
};

const SearchAndFilterBar = ({ setSearchTerm, filters, setFilters }: Props) => (
  <div className="flex gap-4 justify-center items-center w-1/2 mb-10 bg-cream px-10 py-4 rounded">
    <select
      className="rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, price: e.target.value })}
    >
      <option value="">Price</option>
      <option value="low">Low</option>
      <option value="mid">Mid</option>
      <option value="high">High</option>
    </select>
    <select
      className="rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
    >
      <option value="">Duration</option>
      <option value="2">2 hours</option>
      <option value="3">3 hours</option>
      <option value="4">4 hours</option>
      <option value="6">6 hours</option>
      <option value="8">8 hours</option>
    </select>
    <select
      className="rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
    >
      <option value="">Tour Type</option>
      <option value="sunset">Sunset</option>
      <option value="eco">Eco</option>
      <option value="private">Private</option>
    </select>
    <input
      type="text"
      placeholder="Search"
      className="rounded-lg px-4 py-2 bg-white text-gray-700 shadow"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
);

export default SearchAndFilterBar;
