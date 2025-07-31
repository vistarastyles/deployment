interface HeaderProps {
  sortOption: string;
  setSortOption: (opt: string) => void;
}

export function Header({ sortOption, setSortOption }: HeaderProps) {
  return (
    <div className="py-6 px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Men&apos;s T-Shirts</h1>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none"
      >
        <option value="newest">Newest</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
    </div>
  );
}
