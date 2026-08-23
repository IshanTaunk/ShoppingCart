import { useBook } from "../hooks/useBook";

interface BookDetailProps {
    currentBookID: string;
}

export const BookDetail = ({currentBookID}:BookDetailProps) => {
    const {
        data,
        isLoading,
        isError,
        error
    } = useBook(currentBookID);

        if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        return <p>{String(error)}</p>;
    }
    return <div className="col">
        <div className="section-title">Book Details</div>
        <div className="detail-item">
            <span className="detail-label">Title:</span> {data?.title}
        </div>
        <div className="detail-item">
            <span className="detail-label">Author:</span> {data?.author}
        </div>
    </div>
}