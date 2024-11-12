import { PlusCircleIcon, Share2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const buttonRoutes = [
    { name: "Inventory", path: "/inventory" },
    { name: "Recipes", path: "/recipe" },
    { name: "Profile", path: "/profile" },
];

// report in image format
const placeholderImageUrl = "https://i.imgur.com/Ah6bu4J.jpeg";

export const Navbar = () => {
    const location = useLocation();

    if (location.pathname.startsWith("/scan")) return null;

    // Function to handle image sharing
    const shareImageAsset = async () => {
        try {
            console.log("Share button clicked");

            if (!navigator.canShare) {
                console.log("Share API is not supported in this browser.");
                showErrorPopup('Share API is not supported in this browser.');
                return;
            }

            const response = await fetch(placeholderImageUrl);
            console.log("Image fetch response:", response);

            //  if the image is fetched successfully
            if (response.ok) {
                const blobImageAsset = await response.blob();
                console.log("Image fetched and converted to blob");

                //create a file from the blob
                const filesArray = [
                    new File([blobImageAsset], "shared-image.png", {
                        type: "image/png",
                        lastModified: new Date().getTime(),
                    }),
                ];

                const shareData = {
                    title: "Shared Image",
                    text: "Check out this shared image!",
                    files: filesArray,
                };

                // Check if sharing is possible
                if (navigator.canShare(shareData)) {
                    console.log("Attempting to share the image...");
                    await navigator.share(shareData);
                    console.log("Image shared successfully!");
                } else {
                    console.log("Sharing not supported for this file type.");
                    showErrorPopup('Sharing not supported for this file type.');
                }
            } else {
                console.error("Failed to fetch image. Response:", response);
                showErrorPopup('Failed to fetch image. Please try again.');
            }
        } catch (error) {
            console.error("Error sharing image:", error);
            showErrorPopup('Error sharing image. Please try again.');
        }
    };

    
    const showErrorPopup = (message) => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popup.style.color = 'white';
        popup.style.fontSize = '16px';
        popup.style.borderRadius = '8px';
        popup.style.zIndex = '1000';
        popup.style.textAlign = 'center';
        popup.textContent = message;

        document.body.appendChild(popup);

        
        setTimeout(() => {
            popup.remove();
        }, 3000);
    };

    return (
        <div className="m-3 flex flex-row items-center justify-between">
            <Link to="/scan">
                <Button className="p-2 h-fit w-fit rounded-full bg-[#3EA32E]" variant="outline">
                    <PlusCircleIcon size={32} color="white" />
                </Button>
            </Link>
            <div className="flex flex-row items-center justify-center gap-1">
                {buttonRoutes.map((route) => (
                    <Link key={route.name} to={route.path}>
                        <Button variant="outline"
                            className={cn("px-3", route.path === location.pathname ? "border-black" : "")}
                        >
                            {route.name}
                        </Button>
                    </Link>
                ))}
            </div>
            <Button
                onClick={shareImageAsset}
                className="px-2 w-fit h-fit rounded-sm bg-[#3EA32E]"
                variant="outline"
            >
                <Share2Icon size={18} />
            </Button>
        </div>
    );
};
