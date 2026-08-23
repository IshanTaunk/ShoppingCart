import { useQuery } from "@tanstack/react-query"
import { getBook } from "../api/Books";
import { queryKeys } from "../api/queryKeys";

export const useBook = (id:string) => {
    return useQuery({
        queryKey: queryKeys.book(id),
        queryFn: () => getBook(id)
    })
}