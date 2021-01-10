export function LoginBanner(props) {
    const {username, logout} = props;
    if (!username) return null;

    return <div className="loginName">
        logged in as {username}
        <button onClick={() => logout()}>logout</button>
    </div>;
}