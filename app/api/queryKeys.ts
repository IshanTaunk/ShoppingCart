export const queryKeys = {
    books: ['books'] as const,
    book: (id:string) => ['book', id] as const,
};