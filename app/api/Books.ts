export type Book = {
  id: string;
  title: string;
  author: string;
};

let books: Book[] = [
  {
    id: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
  },
  {
    id: "3",
    title: "Refactoring",
    author: "Martin Fowler",
  },
];

export const listBooks = (): Promise<Book[]> => {
  return  new Promise((res) => {
    setTimeout(() => {
      res([...books]);
    }, 5000);
  });
};

export async function getBook(id: string): Promise<Book | undefined> {
  // Simulate network latency
  return new Promise((res) => setTimeout(()=>{
    const book = books.find((book) => book.id === id);
    res(book);
  }, 800));
}

export async function createBook(book: Omit<Book,"id">): Promise<Book> {
    return new Promise((res) => setTimeout(() => {
        const newBook = {
            id: crypto.randomUUID(),
            ...book
        }
        books = [newBook,...books];
        res(newBook);
    },2000));
}

export async function updateBook(id: string, book: Omit<Book,"id">): Promise<Book> {
    return new Promise((res) => setTimeout(() => {
        books = books.map((b) => b.id === id ? { id, ...book } : b);
        res({ id, ...book });
    }, 2000));
}

export async function deleteBook(id: string): Promise<void> {
    return new Promise((res) => setTimeout(() => {
        books = books.filter((b) => b.id !== id);
        res();
    }, 2000));
}