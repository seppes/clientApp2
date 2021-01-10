export function Book(props) {
    const {book, setSelectedBook, deleteBook} = props;
    return <div className="bookRow">
        <div className="bookTitle">{book.title}</div>
        <div className="bookAuthor">{book.author}</div>
        <div className="bookPrice">{book.priceInEur}{book.priceInEur&&" €"}</div>
        <div>
            <button onClick={() => setSelectedBook(book)}>edit</button>
        </div>
        <div>
            <button onClick={() => deleteBook(book)}>delete</button>
        </div>
    </div>
}