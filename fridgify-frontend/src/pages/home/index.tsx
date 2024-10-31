export const HomePage = ({ profile, login, logOut }) => {
    return (
        <div>
            <h2>Welcome to Fridgify!</h2>
            <br />
            {profile ? (
                <div>
                    <img src={profile.picture} alt="User" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google </button>
            )}
        </div>
    );
}