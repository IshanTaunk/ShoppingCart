import { Dispatch, SetStateAction } from "react";
import { useBooks } from "../hooks/useBooks";
import { Book, getBook } from "../api/Books";
import { useDeleteBook } from "../hooks/useDeleteBook";
import "./Booklist.css";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";

interface BookListProps{
    setCurrentBookID: Dispatch<SetStateAction<string>>;
    onEditClick?: (book: Book) => void;
    onDeleteSuccess?: (deletedId: string) => void;
}
const Booklist = ({setCurrentBookID, onEditClick, onDeleteSuccess}:BookListProps) => {
    const queryClient = useQueryClient();
    const deleteBookMutation = useDeleteBook();
    const {
        data,
        isLoading,
        isError,
        error
    } = useBooks();

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>{String(error)}</p>;
    }

    if(deleteBookMutation.isPending){
        return <p>Deleting...</p>;
    }
    
    return (
        <div>
            <div className="section-title">Books</div>
            <ul className="book-list-ul">
              {data?.map((book) => (
        <li 
            key={book.id} 
            className="book-list-item" 
            onClick={()=>{setCurrentBookID(book.id)}}
            onMouseEnter={() => queryClient.prefetchQuery({
                queryKey: queryKeys.book(book.id),
                queryFn: () => getBook(book.id)
            })}
        >
          <span className="book-title">{book.title}</span>
          <div className="book-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              onEditClick?.(book);
            }}>Edit</button>
            <button onClick={(e) => {
              e.stopPropagation();
              deleteBookMutation.mutate(book.id, {
                onSuccess: () => onDeleteSuccess?.(book.id)
              });
            }}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
        </div>
    );
}

export default Booklist