import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, createBook } from "../api/Books";
import { queryKeys } from "../api/queryKeys";

export const useCreateBook = () => {
    const queryClient = useQueryClient();

    return useMutation<Book, Error, Omit<Book, "id">>({
        mutationFn: createBook,
        onSuccess: (newBook: Book) => {
            queryClient.setQueryData( queryKeys.books, (oldbooks:Book[])=>{
                return oldbooks ? [...oldbooks, newBook] : [newBook];
            });

            queryClient.setQueryData(queryKeys.book(newBook.id), newBook);
        },
    });
};