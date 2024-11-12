import { Button } from "@/components/ui/button";
import { BookOpenIcon, CameraIcon, CheckIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "@/hooks";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { useScanningCart } from "@/store/scanning-cart";
import { ManualInputModal } from "./modal";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/spinner";
import { Alert } from "@/components/ui/alert";
import { useProduceCatalog } from "@/api";

export const BeginScanningPage = () => {
    const { isCatalogLoading, isCatalogError, produceCatalog } = useProduceCatalog();

    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fullImageRef = useRef<HTMLImageElement>(null);
    const croppedImageRef = useRef<HTMLImageElement>(null);

    const { width, height } = useWindowDimensions();
    const videoConstraints = useMemo(() => ({
        width, height,
        facingMode: "environment",
    }), [width, height]);

    const [isLoadingGuess, setLoadingGuess] = useState(false);
    const [pictureTaken, setPictureTaken] = useState(false);
    const [guess, setGuess] = useState("");
    
    const clearPicture = useCallback(() => {
        setLoadingGuess(false); setPictureTaken(false); setGuess("");
    }, [setLoadingGuess, setPictureTaken, setGuess]);

    const takePicture = useCallback(() => {
        if (isLoadingGuess || pictureTaken) return;

        setLoadingGuess(true);

        if (
            canvasRef.current && 
            fullImageRef.current && 
            croppedImageRef.current && 
            webcamRef.current
        ) {
            const video = webcamRef.current.video;
            if (!video) {
                setPictureTaken(false); setLoadingGuess(false);
                return;
            };

            const ctx = canvasRef.current.getContext("2d");

            // Capture full image first
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;

            ctx?.drawImage(video, 0, 0, canvasRef.current.width, canvasRef.current.height);
            const fullData = canvasRef.current.toDataURL("image/png");
            fullImageRef.current.setAttribute("src", fullData);

            fullImageRef.current.onload = async () => {
                if (
                    canvasRef.current && 
                    fullImageRef.current && 
                    croppedImageRef.current && 
                    webcamRef.current
                ) {
                    // Capture cropped image
                    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasRef.current.width = 340;
                    canvasRef.current.height = 340;

                    console.log(video.videoWidth, video.videoHeight);

                    ctx?.drawImage(
                        fullImageRef.current,
                        video.videoWidth/2-170, video.videoHeight*0.36-170, 340, 340, // region in the full image
                        0, 0, 340, 340 // destination in the canvas
                    );
                    const croppedData = canvasRef.current.toDataURL("image/png");
                    croppedImageRef.current.setAttribute("src", croppedData);
                    
                    setPictureTaken(true);
                    
                    // query api and wait then set guess
                    
                    try {
                        const formData = new FormData();
                        const blob = await (await fetch(croppedData)).blob();
                        formData.append('image', blob, 'scan.jpg');

                        const res = await fetch("http://localhost:10000/api/scan", {
                            method: "POST",
                            body: formData
                        });
                        
                        if (!res.ok) {
                            throw new Error(`Failed reason: ${res.statusText}`);
                        }
                        
                        const guessData = await res.json();
                        console.log(guessData);
                        setGuess(guessData?.results?.product_name || "");
                        setLoadingGuess(false);
                    } catch (error) {
                        console.log("Failed to send result to backend:", error);
                        alert("Error while sending result to backend!");
                        clearPicture();
                    }
                }
            }
        }
    }, [isLoadingGuess, pictureTaken, setLoadingGuess, setPictureTaken, setGuess, clearPicture]);

    const { addItem } = useScanningCart();

    const confirmGuess = useCallback(() => {
        if (guess === "") return;
        if (!produceCatalog) return;

        // add to store then clear
        addItem(guess, produceCatalog[guess]);
        clearPicture();
    }, [addItem, guess, clearPicture, produceCatalog]);

    return (
        <div className="relative w-full h-[100vh] overflow-hidden">
            <div className="absolute top-0 left-0">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                />
            </div>
            <div className="absolute top-[calc(36vh-170px)] left-[calc(50vw-170px)] border-black border-2 w-[340px] h-[340px] z-99
                rounded-full overflow-hidden p-0
            ">
                <img className="hidden" ref={fullImageRef} />
                <img className={
                    pictureTaken ? "" : "hidden"
                }
                    width={340} height={340} ref={croppedImageRef} />
                <canvas className="hidden" ref={canvasRef} />
            </div>
            <div className="absolute top-[calc(36vh-170px)] left-[calc(50vw-170px)] w-[340px] h-[340px] z-100
                overflow-hidden p-0 flex items-center justify-center"
            >
                {isCatalogLoading && <Alert className="w-fit" variant="default">Loading Catalog...</Alert>}
                {isCatalogError && <Alert className="w-fit bg-white" variant="destructive">Error Loading Catalog</Alert>}
                {isLoadingGuess && <LoadingSpinner size={72} color="lightblue" />}
                {guess !== "" && <Alert className="w-fit" variant="default">{guess.charAt(0).toUpperCase() + guess.slice(1).toLowerCase()}</Alert>}
            </div>
            <div className="w-full h-full absolute top-0 left-0 z-10">
                <Overlay takePicture={takePicture} clearPicture={clearPicture} isLoadingGuess={isLoadingGuess} 
                    confirmGuess={confirmGuess} isGuessReady={guess !== ""}
                />                
            </div>
            <div className="w-full h-[100vh] absolute top-0 left-0 z-5">
                <svg width="100%" height="100%">
                    <defs>
                        <mask id="mask" x="0" y="0" width="100%" height="100%">
                            <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
                            <circle cx="50%" cy="36%" r="170" />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" mask="url(#mask)" fillOpacity="0.3"/>    
                </svg>
            </div>
        </div>
    )
}

const Overlay = ({ takePicture, clearPicture, confirmGuess, isLoadingGuess, isGuessReady }: 
    { 
        takePicture: () => void, clearPicture: () => void, 
        confirmGuess: () => void, isLoadingGuess: boolean, isGuessReady: boolean 
     }
) => {
    const { openModal } = useScanningCart();
    const { isCatalogLoading, isCatalogError } = useProduceCatalog();

    return (
        <div className="p-4 h-full flex flex-col items-center h-screen overflow-hidden">
            <ManualInputModal />
            <div className="flex flex-row items-center justify-between w-full">
                <Link to="/inventory">
                    <Button variant="outline">Back</Button>
                </Link>
                <Link to="/scan/finish">
                    <Button>Finish</Button>
                </Link>
            </div>
            <div className="mt-[410px] flex flex-col items-center justify-center gap-10">
                {!isLoadingGuess && !isGuessReady ?
                    <div className={cn("w-fit h-fit rounded-full", isCatalogLoading || isCatalogError ? "bg-[gray]": "bg-white")}>
                        <Button variant="outline" 
                            className="rounded-full w-16 h-16 border-[orange] bg-[orange]/30 hover:bg-[orange]/50"
                            onClick={takePicture}
                            disabled={isCatalogLoading || isCatalogError}
                        >
                            <CameraIcon color="orange" />
                        </Button>
                    </div>
                    :
                    <div className="flex flex-row items-center justify-center gap-8">
                        <div className="w-fit h-fit rounded-full bg-white">
                            <Button variant="outline" 
                                className="rounded-full w-16 h-16 border-[red] bg-[red]/30 hover:bg-[red]/50"
                                onClick={clearPicture}
                            >
                                <XIcon color="red" />
                            </Button>
                        </div>
                        <div className={cn("w-fit h-fit rounded-full", !isGuessReady ? "bg-[gray]": "bg-white")}>
                            <Button variant="outline" 
                                className="rounded-full w-16 h-16 border-[green] bg-[green]/30 hover:bg-[green]/50"
                                disabled={!isGuessReady}
                                onClick={confirmGuess}
                            >
                                <CheckIcon color="green" />
                            </Button>
                        </div>
                    </div>}
                <div className={cn("w-fit h-fit rounded-full", isLoadingGuess || isGuessReady || isCatalogLoading || isCatalogError ? "bg-[gray]" : "bg-white")}>
                    <Button variant="outline" 
                        className="rounded-full w-16 h-16 border-[gray] bg-[gray]/30 hover:bg-[gray]/50"
                        onClick={openModal}
                        disabled={isLoadingGuess || isGuessReady || isCatalogLoading || isCatalogError}
                    >
                        <BookOpenIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}