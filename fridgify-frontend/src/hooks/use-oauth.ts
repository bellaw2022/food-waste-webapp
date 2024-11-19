import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/api/constants";

interface User {
    access_token: string;
}

export const useOAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState(null);
    const [userId, setUserId] = useState(null);
    const { setGlobalUserId } = useAppContext();
    const queryClient = useQueryClient();

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
                    `${API_URL}/auth/login`,
                    {
                        access_token: user.access_token
                    }
                );

                if (backendLoginRes.data.success) {
                    const combinedProfile = {
                        ...googleProfileRes.data,
                        user_id: backendLoginRes.data.user_id
                    };

                    

                    console.log('Combined Profile Data:', combinedProfile);
                    setProfile(combinedProfile);
                    setUserId(backendLoginRes.data.user_id);
                    setGlobalUserId(backendLoginRes.data.user_id);

                    localStorage.setItem('user_id', backendLoginRes.data.user_id);
                    window.location.href = "/inventory";
                } else {
                    console.error('Backend login failed:', backendLoginRes.data.error);
                }
            } catch (err) {
                console.error('Error during login process:', err);
            }
        };

        fetchUserData();
    }, [user]);

    const logOut = async () => {
        try {
            localStorage.removeItem('user_id');

            googleLogout();

            setProfile(null);
            setUser(null);
            setUserId(null);
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return {
        user,
        profile,
        userId,
        useGoogleLogin,
        login,
        logOut,
        isLoggedIn: !!userId
    };
};