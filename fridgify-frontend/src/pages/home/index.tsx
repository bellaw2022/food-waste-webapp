import React, { useEffect } from "react";
import { useOAuth } from "@/hooks";

export const HomePage = () => {
    const { profile, login, logOut } = useOAuth();

    return (
        <div className="mx-4">
            <h1 className="text-3xl font-bold">Home</h1>
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