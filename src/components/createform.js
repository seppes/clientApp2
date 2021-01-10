import {useState} from "react";

export function CreateForm(props) {
    const {createBook} = props;
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");

    return <div className="editbox">
        <form onSubmit={(e) => {
            console.log("SUBMIT");
            createBook({title, author, price});
            e.preventDefault();
        }}>
            <div>new book</div>
            <div className="formrow">
                <label>title: </label>
                <input value={title} required
                       onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="formrow">
                <label>author: </label>
                <input value={author} required pattern="[a-zA-Z ]*" type="text"
                       onChange={(e) => setAuthor(e.target.value)}/>
            </div>
            <div className="formrow">
                <label>price: </label>
                <input value={price} type="number" min="0" max="2000"
                       onChange={(e) => setPrice(parseInt(e.target.value) || null)}/>
            </div>
            <div className="formbuttonrow">
                <button>create</button>
            </div>
        </form>
    </div>;
}