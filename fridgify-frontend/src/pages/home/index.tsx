import { useProfile, Profile } from "@/context/ProfileContext";

export const HomePage = ({ profile, login, logOut }: 
    {profile: Profile | null, login: () => void, logOut: () => void }
) => {
    const { setProfile } = useProfile(); 

    if (profile) {
        setProfile(profile);
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-start py-12" style={{ backgroundColor: "#c1e1c1" }}>
            {/* Hero Section */}
            <div className="relative z-10 text-center space-y-6 mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight text-green-800 drop-shadow-lg">
                    Welcome to Fridgify
                </h1>
                <p className="text-xl font-medium text-gray-700 opacity-80">
                    A better way to manage your groceries. Let’s get started!
                </p>
            </div>

            {/* Profile Section */}
            <div className="mx-6 max-w-md lg:max-w-lg mx-auto z-10 relative bg-black bg-opacity-50 p-6 rounded-lg shadow-lg">
                {profile ? (
                    <div className="text-center space-y-6">
                        <div className="rounded-full w-32 h-32 mx-auto mb-4 overflow-hidden">
                            <img 
                                src={profile?.picture} 
                                alt="User" 
                                className="object-cover w-full h-full rounded-full border-4 border-green-600 shadow-lg" 
                            />
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{profile?.name}</h3>
                        <p className="text-lg text-gray-200">{profile?.email}</p>

                        <div className="flex justify-center gap-6 mt-6">
                            <button 
                                onClick={logOut} 
                                className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-green-50 transition duration-200 ease-in-out"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-6">
                        <p className="text-gray-100 font-medium text-lg">
                            Sign in to access your profile
                        </p>
                        <button 
                            onClick={() => login()} 
                            className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg shadow-md hover:bg-green-50 transition duration-200 ease-in-out"
                        >
                            Sign in with Google
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <div className="absolute bottom-6 text-center text-white opacity-70 w-full">
                <p className="text-sm">&copy; 2024 Fridgify. All rights reserved.</p>
            </div>
        </div>
    );
};