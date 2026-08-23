import { Book } from "../api/Books";
import { useCreateBook } from "../hooks/useCreateBook";
import { useUpdateBook } from "../hooks/useUpdateBook";
import { useState } from "react";

interface BookFormProps {
    editingBook?: Book | null;
    onEditComplete?: () => void;
}

const BookForm = ({ editingBook, onEditComplete }: BookFormProps) => {
    const createMutation = useCreateBook();
    const updateMutation = useUpdateBook();
    const [title, setTitle] = useState(editingBook?.title ?? "");
    const [author, setAuthor] = useState(editingBook?.author ?? "");

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const book: Omit<Book,"id"> = {
            title,
            author
        };
        
        if (editingBook) {
            updateMutation.mutate({ id: editingBook.id, ...book }, {
                onSuccess: () => {
                    setTitle("");
                    setAuthor("");
                    onEditComplete?.();
                }
            });
        } else {
            createMutation.mutate(book, {
                onSuccess: () => {
                    setTitle("");
                    setAuthor("");
                }
            });
        }
    };

    const isPending = editingBook ? updateMutation.isPending : createMutation.isPending;
    const isError = editingBook ? updateMutation.isError : createMutation.isError;
    const error = editingBook ? updateMutation.error : createMutation.error;

    if (isPending) {
        return <p>Pending...</p>;
    }

    if (isError) {
        return <p>{String(error)}</p>;
    }

  return (
    <div className="book-form-container">
        <div className="form-title">{editingBook ? "Edit Book" : "Add Book"}</div>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    className="form-input"
                    name="title" 
                    placeholder="Book Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <input
                    className="form-input"
                    name="author"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
            </div>
            <div className="form-actions">
                <button className="btn btn-primary" type="submit">
                    {editingBook ? "UPDATE" : "ADD BOOK"}
                </button>
                {editingBook && (
                    <button className="btn btn-secondary" type="button" onClick={onEditComplete}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    </div>
  )
}

export default BookForm