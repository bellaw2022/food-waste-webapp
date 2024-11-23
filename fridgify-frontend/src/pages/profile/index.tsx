import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { WasteSavingChart } from "./waste-saving-chart";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { googleLogout } from "@react-oauth/google";
import { useProfile } from "@/context/ProfileContext"; 

export const ProfilePage = () => {
    const { profile, setProfile } = useProfile(); 
    const [badgeCount, setBadgeCount] = useState(0); 

    const logout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("profile"); 
        googleLogout();
        window.location.href = "/";
        setProfile(null); 
    };
  

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            fetch(`http://127.0.0.1:10000/api/users/${userId}`, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "69420",
                }),
            })
                .then((response) => {
                    console.log("Response status:", response.status);
                    console.log("Response headers:", response.headers);

                    if (!response.ok) {
                        console.error("Error response from server:", response.status, response.statusText);
                        return Promise.reject("Failed to fetch user data");
                    }

                    return response.json();
                })
                .then((data) => {
                    console.log("Fetched user data:", data);
                    if (data && data.badge !== undefined) {
                        setBadgeCount(data.badge);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        } else {
            console.error("No user ID in localStorage");
        }
    }, []);    

    return (
        <div className="mx-4 mb-10">
            <h1 className="text-3xl font-bold mb-3">Profile</h1>
            <Card className="pb-2 flex flex-col items-center gap-2">
                <CardHeader className="flex flex-row items-center justify-center pb-0">
                    <div className="w-[120px] h-[120px] rounded-full text-center
                        flex flex-row items-center justify-center"
                    >
                        <img src={profile?.picture} alt="User" className="rounded-full" />
                    </div>
                </CardHeader>
                {/* Name and email display */}
                <div className="text-center">
                    <h2 className="font-semibold text-lg">{profile?.name}</h2>
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                </div>
                <Button onClick={logout}>Log out</Button>
            </Card>
            <div className="border-2 border-black/10 rounded-md">
                <Table>
                    <TableBody className="bg-[gray]/10">
                        <ProgressSection />
                        <NotificationSection />
                        <AchievementsSection badgeCount={badgeCount} /> {/* New Achievements section */}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// New AchievementsSection component
const AchievementsSection = ({ badgeCount }: { badgeCount: number }) => {
    console.log("AchievementsSection badgeCount:", badgeCount); 
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Achievements</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Badges Earned</div>
                </TableCell>
                <TableCell className="text-right font-bold mr-5">{badgeCount}</TableCell>
            </TableRow>
        </>
    );
};

const NotificationSection = () => {
    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Notification Preferences</TableCell>
            </TableRow>
            <TableRow className="h-10">
                <TableCell className="font-medium">
                    <div className="ml-2">Expiration Alerts</div>
                </TableCell>
                <TableCell className="text-right">
                    <Select defaultValue="4">
                        <SelectTrigger id="expiration-selection" className="bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="4">Every 4 days</SelectItem>
                            <SelectItem value="7">Every 7 days</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
            </TableRow>
        </>
    );
};

const ProgressSection = () => {
    const [video, setVideo] = useState("");

    const shareVideo = useCallback(async () => {
        try {
            console.log("Share button clicked");

            if (!navigator.canShare) {
                console.log("Share API is not supported in this browser.");
                return;
            }

            const response = await fetch(video);
            console.log("Video fetch response:", response);

            const blobVideoAsset = await response.blob();
            console.log("Video fetched and converted to blob");

            //create a file from the blob
            const filesArray = [
                new File([blobVideoAsset], "shared-video.mp4", {
                    type: "video/mp4",
                    lastModified: new Date().getTime(),
                }),
            ];

            const shareData = {
                title: "",
                text: "Check out my waste saving progress!",
                files: filesArray,
            };

            // Check if sharing is possible
            if (navigator.canShare(shareData)) {
                console.log("Attempting to share the image...");
                await navigator.share(shareData);
                console.log("Image shared successfully!");
            } else {
                console.log("Sharing not supported for this file type.");
            }
        } catch (error) {
            console.error("Error sharing image:", error);
        }
    }, [video]);

    return (
        <>
            <TableRow className="h-10 bg-white">
                <TableCell className="text-large font-bold">Progress Tracking</TableCell>
                <TableCell className="text-large font-bold">
                    <Button disabled={video === ""} onClick={shareVideo}
                        className="w-full gap-2"
                    >
                        Share! <InstagramLogoIcon />
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell className="w-full" colSpan={2}>
                    <WasteSavingChart setVideo={(src: string) => setVideo(src)} />
                </TableCell>
            </TableRow>
        </>
    )
}