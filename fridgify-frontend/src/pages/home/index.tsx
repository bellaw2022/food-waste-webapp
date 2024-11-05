// export const HomePage = ({ profile, login, logOut }) => {
//     return (
//         <div className="mx-4">
//             <h1 className="text-3xl font-bold">Home</h1>
//             <br />
//             {profile ? (
//                 <div>
//                     <img src={profile.picture} alt="User" />
//                     <h3>User Logged in</h3>
//                     <p>Name: {profile.name}</p>
//                     <p>Email Address: {profile.email}</p>
//                     <br />
//                     <button onClick={logOut}>Log out</button>
//                 </div>
//             ) : (
//                 <button onClick={() => login()}>Sign in with Google </button>
//             )}
//         </div>
//     );
// }

export const HomePage = ({ profile, login, logOut }) => {
    return (
        <div className="mx-6 my-8 max-w-md lg:max-w-lg mx-auto">
            <h1 className="text-4xl font-bold text-magenta mb-6 text-center">Welcome to Fridgify</h1>
            
            {profile ? (
                <div className="flex flex-col items-center text-center space-y-4">
                    <img 
                        src={profile.picture} 
                        alt="User" 
                        className="w-24 h-24 rounded-full shadow-md border-2 border-magenta"
                    />
                    <h3 className="text-lg font-semibold text-gray-700">User Logged In</h3>
                    <p className="text-gray-600">
                        <span className="font-medium text-gray-800">Name:</span> {profile.name}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium text-gray-800">Email:</span> {profile.email}
                    </p>
                    <button 
                        onClick={logOut} 
                        className="px-6 py-2 bg-magenta text-white font-semibold rounded-md hover:bg-pink-600 transition duration-150"
                    >
                        Log Out
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-600 font-medium text-lg text-center">
                        Sign in to access your profile.
                    </p>
                    <button 
                        onClick={login} 
                        className="px-6 py-2 bg-magenta text-white font-semibold rounded-md hover:bg-pink-600 transition duration-150"
                    >
                        Sign in with Google
                    </button>
                </div>
            )}
        </div>
    );
};
