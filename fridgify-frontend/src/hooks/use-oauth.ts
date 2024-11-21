import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { useQueryClient } from "@tanstack/react-query";

interface User {
    access_token: string;
}

export interface Profile {
    user_id: number;
    email?: string;
    name?: string;
    picture: string;
}

export const useOAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const { globalUserId,setGlobalUserId } = useAppContext();
    const queryClient = useQueryClient();

    const login = () => {
        console.log('Mock Login Success');
        setUser({ access_token: 'mock_token' });
        queryClient.invalidateQueries({
            queryKey: ['inventory', 'waste-saving-progress'],
        });
    };

    useEffect(() => {
        const mockLogin = async () => {
            const mockProfile = {
                user_id: 38,
                email: 'bellatesing@gmail.com',
                name: 'Bella Wu',
                picture: "",
            };

            setProfile(mockProfile);
            setUserId(mockProfile.user_id);
            setGlobalUserId(mockProfile.user_id);
            console.log("user id: ",globalUserId );

            localStorage.setItem('user_id', String(mockProfile.user_id));
            window.location.href = "/inventory";
        };

        if (user) {
            mockLogin();
        }
    }, [user]);

    const logOut = () => {
        localStorage.removeItem('user_id');
        setProfile(null);
        setUser(null);
        setUserId(null);
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