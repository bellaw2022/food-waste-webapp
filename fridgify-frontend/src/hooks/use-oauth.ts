import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useQueryClient } from "@tanstack/react-query";

interface User {
    access_token: string;
}

export const useOAuth = () => {
    const {
        user,
        setUser,
        profile,
        setProfile,
        userId,
        setUserId,
        setGlobalUserId,
    } = useAppContext();

    const queryClient = useQueryClient();

    //====================================================//
    // Login function that triggers the Google OAuth flow //
    //====================================================//
    const login = useGoogleLogin({
        onSuccess: (codeResponse: User) => {
            console.log('Login Success:', codeResponse);
            setUser(codeResponse);
            queryClient.invalidateQueries({
                queryKey: ['inventory', 'waste-saving-progress'],
            });
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
    });

    //==============================================================//
    // Logout function that clears the user state and local storage //
    //==============================================================//
    const logOut = async () => {
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('profile');
            localStorage.removeItem('user_id');

            googleLogout();

            setProfile(null);
            setUser(null);
            setUserId(null);
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    //========================================//
    // Fetch user data after successful login //
    //========================================//
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            try {
                const googleProfileRes = await axios.get(
                    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json',
                        },
                    }
                );

                const backendLoginRes = await axios.post(
                    'http://localhost:10000/api/auth/login',
                    {
                        access_token: user.access_token
                    }
                );

                if (backendLoginRes.data.success) {
                    const combinedProfile = {
                        ...googleProfileRes.data,
                        user_id: backendLoginRes.data.user_id
                    };

                    // console.log('Combined Profile Data:', combinedProfile);
                    setProfile(combinedProfile);
                    setUserId(backendLoginRes.data.user_id);
                    setGlobalUserId(backendLoginRes.data.user_id);
                } else {
                    console.error('Backend login failed:', backendLoginRes.data.error);
                }
            } catch (err) {
                console.error('Error during login process:', err);
            }
        };

        fetchUserData();
    }, [user]);

    return {
        user,
        profile,
        userId,
        login,
        logOut,
        isLoggedIn: !!userId
    };
};