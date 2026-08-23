"use client";

import { useState } from "react";
import { BookDetail } from "./components/BookDetails";
import { TanstackProvider } from "./shared/queryClient";
import { Book } from "./api/Books";
import Booklist from "./components/BookList";
import BookForm from "./components/BookForm";
import { TopBanner } from "./components/TopBanner";
import ProductsPage from "./products/page";

export default function Home() {
    const [currentBookID,setCurrentBookID] = useState<string>('1');
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleDeleteSuccess = (deletedId: string) => {
    if (currentBookID === deletedId) {
      setCurrentBookID('1');
    }
  };
  return (
          <TanstackProvider>
        {/* <div className='row'>
        <div className='book-list'>
          <Booklist 
            setCurrentBookID={setCurrentBookID} 
            onEditClick={(book) => setEditingBook(book)}
            onDeleteSuccess={handleDeleteSuccess}
          ></Booklist>
        </div>
        <div className='book-detail'>
          <BookDetail currentBookID={currentBookID}></BookDetail>
        </div>
        </div>
        <div>
          <BookForm 
            key={editingBook?.id ?? 'new'} 
            editingBook={editingBook} 
            onEditComplete={() => setEditingBook(null)}
          />
        </div> */}
        <TopBanner/>
        <ProductsPage/>
      </TanstackProvider>
  );
}
