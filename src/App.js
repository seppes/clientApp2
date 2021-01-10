import './App.css';
import {useEffect, useState} from "react";
import {CreateForm} from "./components/createform";
import {EditForm} from "./components/editform";
import {Book} from "./components/book";
import {LoginBanner} from "./components/loginbanner";
import {Login} from "./components/login";

function App() {
    const [username, setUsername] = useState();
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState();

    console.log("render App()");

    function addBook(book) {
        setBooks([...books, book]);
    }

    function updateBook(book) {
        setBooks(books.map((b) => b.id === book.id ? book : b));
    }

    async function createBook(book) {
        console.log(`async createBook ${JSON.stringify(book)}`);
        setIsLoading(true);

        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(book)
        };
        try {
            const response = await fetchWithCsrf(`${process.env.REACT_APP_BOOKSSERVER}/books`, fetchOptions);
            const body = await response.json();
            if (response.ok) {
                console.log(`   async createBook: received response ${JSON.stringify(body)}`);
                setBooks([...books, body]);
                console.log("   async createBook: done");
                setMessage(`book ${book.title} created`);
            } else {
                console.log(`   async createBook: ERROR: ${response.status} - ${body.error} - ${body.message} `);
                const errorMessage = body.errors &&
                    body.errors.reduce((accumulator, error) => `${accumulator} ${error.defaultMessage}  --- `, "--- ");
                console.log(`   ${JSON.stringify(body)}`);
                console.log(`   ${errorMessage}`);
                setMessage(errorMessage || body.message);
            }
        } catch (e) {
            console.log(`   async createBook: ERROR ${e}`);
            setMessage("Connection error");
        }
        setIsLoading(false);
    }

    async function fetchWithCsrf(url, fetchOptions) {
        const cookie = document.cookie.match(new RegExp('XSRF-TOKEN=([^;]+)'));
        const csrfToken = cookie && cookie[1];
        console.log(`fetchWithCredentials token=${csrfToken}`);
        const headers = csrfToken ? {...fetchOptions.headers, 'X-XSRF-TOKEN': csrfToken} : fetchOptions.headers;
        const optionsWithCredentials = {
            ...fetchOptions,
            credentials: 'include',
            headers
        };
        return await fetch(url, optionsWithCredentials);
    }

    async function deleteBook(book) {
        console.log("async deleteBook");
        setIsLoading(true);

        const fetchOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
        };
        try {
            const response = await fetchWithCsrf(`${process.env.REACT_APP_BOOKSSERVER}/books/${book.id}`, fetchOptions);
            if (response.ok) {
                console.log(`   async deleteBook: received response `);
                setBooks(books.filter((b) => b.id !== book.id));
                console.log("   async deleteBook: done");
                setMessage(`book ${book.title} deleted`);
            } else {
                const body = await response.json();
                console.log(`   async deleteBook: ERROR: ${response.status} - ${body.error} - ${body.message} `);
                setMessage(body.message);
            }
        } catch (e) {
            console.log(`   async deleteBook: ERROR ${e}`);
            setMessage("Connection error");
        }
        setIsLoading(false);
    }

    async function getBooks() {
        console.log("   async getBooks: start");
        setIsLoading(true);
        try {
            const fetchOptions = {
                method: 'GET',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    authorisation: "Basic " + window.btoa("seppe:seppe")
                }
            };

            const response = await fetch(`${process.env.REACT_APP_BOOKSSERVER}/books`, fetchOptions);
            const body = await response.json();
            console.log(`   async getBooks: received response ${JSON.stringify(body)}`);
            setBooks(body);
            console.log("   async getBooks: done");
        } catch (e) {
            console.log(`   async getBooks: ERROR $(e)`);
            setMessage("connection error");
        }

        setIsLoading(false);
    }

    async function editBook(book) {
        if (!selectedBook) return;
        console.log("async editBook");
        setIsLoading(true);

        const fetchOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(book)
        };
        try {
            const response = await fetchWithCsrf(`${process.env.REACT_APP_BOOKSSERVER}/books/${book.id}`, fetchOptions);
            const body = await response.json();
            if (response.ok) {
                console.log(`   async editBook: received response ${JSON.stringify(body)}`);
                setBooks(books.map((b) => b.id === body.id ? body : b));
                console.log("   async editBook: done");
                setMessage(`book ${book.title} modified`);
            } else {
                console.log(`   async editBook: ERROR: ${response.status} - ${body.error} - ${body.message} `);
                setMessage(body.message);
            }
        } catch (e) {
            console.log(`   async deleteBook: ERROR ${e}`);
            setMessage("Connection error");
        }
        setIsLoading(false);
    }

    async function authenticate(username, password) {
        console.log(`   async authenticate: start ${username}`);
        setIsLoading(true);
        try {
            const fetchOptions = {
                method: 'GET',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    authorisation: "Basic " + window.btoa(`${username}:${password}`)
                },
            };
            const response = await fetch(`${process.env.REACT_APP_BOOKSSERVER}/authenticate`, fetchOptions);
            const body = await response.json();
            console.log(`   async authenticate: received response ${JSON.stringify(body)}`);
            setUsername(body.username);
            setMessage();
            console.log("   async authenticate: done");
        } catch (e) {
            console.log(`   async authenticate: ERROR ${JSON.stringify(e)}`);
            setMessage("Login error");
        }
        setIsLoading(false);
    }

    async function refreshAuthentication() {
        console.log(`   async refreshAuthentication: start`);
        setIsLoading(true);
        try {
            const fetchOptions = {
                method: 'GET',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            };
            const response = await fetch(`${process.env.REACT_APP_BOOKSSERVER}/authenticate`, fetchOptions);
            const body = await response.json();
            console.log(`   async refreshAuthentication: received response ${JSON.stringify(body)}`);
            setUsername(body.username);
            console.log("   async refreshAuthentication: done");
        } catch (e) {
            console.log(`   async refreshAuthentication: ERROR ${e}`);
        }
        setIsLoading(false);
    }

    async function logout() {
        console.log(`   async logout`);
        setIsLoading(true);
        try {
            const fetchOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json;charset=utf-8'},
            };
            const response = await fetchWithCsrf(`${process.env.REACT_APP_BOOKSSERVER}/logout`, fetchOptions);
            if (response.ok) {
                setUsername(undefined);
                setMessage();
            } else {
                const body = await response.json();
                console.log(`   async logout: ERROR: ${response.status} - ${body.error} - ${body.message} `);
                //TODO if logout fails???
            }
        } catch (e) {
            console.log(`   async logout: ERROR ${e}`);
            //TODO if logout fails???
        }
        setIsLoading(false);
    }

    async function authorisation() {
        console.log("   async authorisation: start");
        setIsLoading(true);
        try {
            const fetchOptions = {
                method: 'GET',
                'credentials': 'include',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            };

            const response = await fetch(`${process.env.REACT_APP_BOOKSSERVER}/authenticate`, fetchOptions);
            const body = await response.json();
            console.log(`   async authorisation: received response ${JSON.stringify(body)}`);
            setUsername(body.username);
            console.log("   async authorisation: done");
        } catch (e) {
            console.log(`   async authorisation: ERROR $(e)`);
            setMessage("connection error");
        }

        setIsLoading(false);
    }

    useEffect(() => {
        console.log("useEffect: start because username changed");
        getBooks();
        console.log("useEffect: done");
    }, [username]);

    useEffect(() => {
        console.log("useEffect: start");
        authorisation();
        console.log("useEffect: done");
    }, []);

    return (
        <div className="App">
            {username && <>
                {isLoading ? <p className="isLoading">LOADING DATA!!!</p> : false}
                <LoginBanner username={username} logout={logout}/>
                <div className="booksList">{books.map((b) =>
                    <Book key={b.title} book={b}
                          setSelectedBook={setSelectedBook}
                          deleteBook={deleteBook}/>)}</div>
                <button onClick={getBooks}>refresh</button>
                <CreateForm selectedBook={selectedBook} createBook={createBook}/>
                <EditForm selectedBook={selectedBook} setSelectedBook={setSelectedBook} editBook={editBook}/>
            </>}
            <Login username={username} authenticate={authenticate}/>
            {message ? <p className="message" onClick={() => setMessage()}>{message}</p> : false}
        </div>
    );
}

export default App;