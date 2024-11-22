import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useQueryClient } from "@tanstack/react-query";

export const useOAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const { globalUserId, setGlobalUserId } = useAppContext();
    const queryClient = useQueryClient();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
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

                    localStorage.setItem('user_id', String(backendLoginRes.data.user_id));
                    console.log("User ID saved to localStorage:", backendLoginRes.data.user_id);

                    console.log('Global User ID:', backendLoginRes.data.user_id);
                    console.log('Is Logged In:', !!backendLoginRes.data.user_id); 
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
        login,
        logOut,
        isLoggedIn: !!userId
    };
};
