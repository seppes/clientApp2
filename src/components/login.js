import {useState} from "react";

export function Login(props) {
    const {username, authenticate} = props;
    const [loginUsername, setLoginUsername] = useState();
    const [loginPassword, setLoginPassword] = useState();

    if (username) return null;

    return <>
        <div className="overlay"/>
        <div className="modalbox modal">
            <h2>Log in</h2>
            <form onSubmit={(e) => {e.preventDefault()}}>
                <div className="formrow">
                    <label>username: </label>
                    <input required onChange={(e) => setLoginUsername(e.target.value)}/>
                </div>
                <div className="formrow">
                    <label>password: </label>
                    <input type="password" required onChange={(e) => setLoginPassword(e.target.value)}/>
                </div>
                <div className="formbuttonrow">
                    <button onClick={() => authenticate(loginUsername, loginPassword)}>login</button>
                </div>
            </form>
        </div>
    </>;
}