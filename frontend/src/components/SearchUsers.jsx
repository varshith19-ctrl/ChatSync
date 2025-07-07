import { useState } from "react";

export default function SearchUsers({ searchQuery, setSearchQuery }) {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="px-3 py-2">
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="🔍 Search users…"
        className="
          w-full px-4 py-2 text-sm rounded-lg
          border border-gray-300 focus:outline-none
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          placeholder-gray-400
          bg-white text-gray-800
        "
      />
    </div>
  );
}
