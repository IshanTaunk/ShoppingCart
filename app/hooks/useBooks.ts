import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import { listBooks } from "../api/Books";

export const useBooks = () => {
    return useQuery({
        queryKey: queryKeys.books,
        queryFn: listBooks,
    });
};