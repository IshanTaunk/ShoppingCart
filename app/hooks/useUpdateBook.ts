import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, updateBook } from "../api/Books";
import { queryKeys } from "../api/queryKeys";

export const useUpdateBook = () => {
    const queryClient = useQueryClient();

    return useMutation<Book, Error, { id: string } & Omit<Book, "id">>({
        mutationFn: ({ id, ...book }) => updateBook(id, book),
        onSuccess: (updatedBook: Book) => {
            queryClient.setQueryData(queryKeys.books, (oldbooks: Book[]) => {
                return oldbooks ? oldbooks.map((b) => b.id === updatedBook.id ? updatedBook : b) : [updatedBook];
            });

            queryClient.setQueryData(queryKeys.book(updatedBook.id), updatedBook);
        },
    });
};
