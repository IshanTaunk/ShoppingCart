import { TopBanner } from "./components/TopBanner";
import ProductsPage from "./products/page";

export default function Home() {
  return (
      <>
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
      </>
  );
}
