interface AutoCompleteBoxProps {
  suggestions: Array<{ _id: string; title: string }>;
  isLoading: boolean;
  onSelect: (value: string) => void;
  visible: boolean;
}

export const AutoCompleteBox = ({
  suggestions,
  isLoading,
  onSelect,
  visible,
}: AutoCompleteBoxProps) => {
    if (!visible) return null;
    return (
        <div
      className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg
        max-h-64 overflow-auto">
            {isLoading ? 
                (
                <div className="px-4 py-2 text-gray-500">
                Loading suggestions...
                </div>
                ):  suggestions.length > 0 ? (
                    <ul>
                        {suggestions.map((suggestion) => (
                            <li
                            key={suggestion._id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                            onClick={() => onSelect(suggestion.title)}>
                            {suggestion.title}
                            </li>
                        ))}
                    </ul>
                ):(
                    <div className="px-4 py-2 text-gray-500">
                    No products found for the search...
                    </div>
                )}
        </div>
    )
}