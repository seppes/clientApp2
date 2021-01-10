export function EditForm(props) {
    const {selectedBook, setSelectedBook, editBook} = props;

    if (!selectedBook) return null;

    return <>
        <div className="overlay" onClick={() => setSelectedBook()}/>
        <div className="modalbox modal">
            <form onSubmit={(e) => {
                console.log("SUBMIT");
                editBook(selectedBook);
                setSelectedBook();
                e.preventDefault();
            }}>
                <div>edit the book</div>
                <div className="formrow">
                    <label>title: </label>
                    <input value={selectedBook.title} required
                           onChange={(e) => setSelectedBook({...selectedBook, title: e.target.value})}/>
                </div>
                <div className="formrow">
                    <label>author: </label>
                    <input value={selectedBook.author} required pattern="[a-zA-Z ]*" type="text"
                           onChange={(e) => setSelectedBook({...selectedBook, author: e.target.value})}/>
                </div>
                <div className="formrow">
                    <label>price: </label>
                    <input value={selectedBook.price || ""} type="number" min="0" max="2000"
                           onChange={(e) => setSelectedBook({
                               ...selectedBook,
                               price: parseInt(e.target.value) || null
                           })}/>
                </div>
                <div className="formbuttonrow">
                    <button type="button" onClick={() => setSelectedBook()}>cancel</button>
                    <button>save</button>
                </div>
            </form>
        </div>
    </>;
}