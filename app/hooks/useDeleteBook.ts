import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, deleteBook } from "../api/Books";
import { queryKeys } from "../api/queryKeys";

export const useDeleteBook = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteBook,
        onSuccess: (_, deletedId: string) => {
            queryClient.setQueryData(queryKeys.books, (oldbooks: Book[]) => {
                return oldbooks ? oldbooks.filter((b) => b.id !== deletedId) : [];
            });

            queryClient.removeQueries({ queryKey: queryKeys.book(deletedId) });
        },
    });
};
