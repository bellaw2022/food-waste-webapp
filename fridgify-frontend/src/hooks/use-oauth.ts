import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../AppContext";
import { useProfile } from "@/context/ProfileContext";

interface User {
    access_token: string;
}

export const useOAuth = () => {
    const {
        user,
        setUser,
        // profile,
        // setProfile,
        userId,
        setUserId,
        setGlobalUserId,
    } = useAppContext();
    const {
        profile,
        setProfile,
    } = useProfile();

    const queryClient = useQueryClient();

    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    //====================================================//
    // Login function that triggers the Google OAuth flow //
    //====================================================//
    const login = (url?: string) => {
        if (url) {
            setRedirectUrl(url);
        } else {
            setRedirectUrl(null);
        }
        googleLogin();
    };
    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse: User) => {
            console.log('Login Success:', codeResponse);
            setUser(codeResponse);
            queryClient.invalidateQueries({
                queryKey: ['inventory', 'waste-saving-progress'],
            });

            if (!redirectUrl) {
                // Refresh the page if no redirect URL is provided
                window.location.reload();
            }
        },
        onError: (error) => {
            console.log('Login Failed:', error);
        },
    });

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
                console.log('Google Profile Data:', googleProfileRes.data);

                const backendLoginRes = await axios.post(
                    'http://localhost:10000/api/auth/login',
                    {
                        access_token: user.access_token
                    }
                );
                console.log('Backend Login Response:', backendLoginRes.data);

                if (backendLoginRes.data.success) {
                    const combinedProfile = {
                        ...googleProfileRes.data,
                        user_id: backendLoginRes.data.user_id
                    };

                    console.log('Combined Profile Data:', combinedProfile);
                    setProfile(combinedProfile);
                    setUserId(backendLoginRes.data.user_id);
                    setGlobalUserId(backendLoginRes.data.user_id);

                    // localStorage.setItem('user_id', String(backendLoginRes.data.user_id));
                    // console.log("User ID saved to localStorage:", backendLoginRes.data.user_id);

                    // console.log('Global User ID:', backendLoginRes.data.user_id);
                    // console.log('Is Logged In:', !!backendLoginRes.data.user_id); 

                    // window.location.href = "/inventory";

                    // Redirect to the specified URL after successful login if provided
                    // Not in login function because it needs to be done after the user state is set
                    if (redirectUrl && redirectUrl.startsWith('/')) {
                        window.location.href = redirectUrl;
                    }
                } else {
                    console.error('Backend login failed:', backendLoginRes.data.error);
                }
            } catch (err) {
                console.error('Error during login process:', err);
            }
        };

        fetchUserData();
    }, [user]);

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

            // Refresh the page after logout
            window.location.reload();
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return {
        user,
        profile,
        userId,
        login,
        logOut,
        isLoggedIn: !!userId
    };
};
