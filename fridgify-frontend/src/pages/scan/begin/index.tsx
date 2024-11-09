import { Button } from "@/components/ui/button";
import { BookOpenIcon, CameraIcon, CheckIcon, XIcon } from "lucide-react";
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "@/hooks";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { useScanningCart } from "@/store/scanning-cart";
import { ManualInputModal } from "./modal";

export const BeginScanningPage = () => {
    const webcamRef = useRef<Webcam>(null);

    const { width, height } = useWindowDimensions();
    const videoConstraints = useMemo(() => ({
        width, height,
        facingMode: "environment",
    }), [width, height]);

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
            <div className="w-full h-full absolute top-0 left-0 z-10">
                <Overlay webcam={webcamRef} />                
            </div>
            <div className="w-full h-[100vh] absolute top-0 left-0 z-5">
                <svg viewBox="0 50 100 100" width="100%" height="100%">
                    <defs>
                        <mask id="mask" x="0" y="0" width="100" height="100">
                            <rect x="0" y="0" width="100" height="300" fill="#fff"/>
                            <circle cx="50" cy="70" r="45" />
                        </mask>
                    </defs>
                    <rect x="0" y="0" width="100" height="300" mask="url(#mask)" fillOpacity="0.3"/>    
                </svg>
            </div>
        </div>
    )
}

const Overlay = ({ webcam }: { webcam: RefObject<Webcam> }) => {
    const { openModal } = useScanningCart();
    const [picTaken, setPicTaken] = useState(false);

    const takePicture = useCallback(() => {
        if (webcam.current) {
            console.log(webcam.current.getScreenshot());
            setPicTaken(true);
        }
    }, [webcam, setPicTaken]);

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
                 <div className="w-fit h-fit rounded-full bg-white">
                    <Button variant="outline" 
                        className="rounded-full w-16 h-16 border-[orange] bg-[orange]/30 hover:bg-[orange]/50"
                        onClick={takePicture}
                    >
                        <CameraIcon color="orange" />
                    </Button>
                </div>
                {/* <div className="flex flex-row items-center justify-center gap-8">
                    <div className="w-fit h-fit rounded-full bg-white">
                        <Button variant="outline" 
                            className="rounded-full w-16 h-16 border-[red] bg-[red]/30 hover:bg-[red]/50"
                        >
                            <XIcon color="red" />
                        </Button>
                    </div>
                    <div className="w-fit h-fit rounded-full bg-white">
                        <Button variant="outline" 
                            className="rounded-full w-16 h-16 border-[green] bg-[green]/30 hover:bg-[green]/50"
                        >
                            <CheckIcon color="green" />
                        </Button>
                    </div>
                </div> */}
                <div className="w-fit h-fit rounded-full bg-white">
                    <Button variant="outline" 
                        className="rounded-full w-16 h-16 border-[gray] bg-[gray]/30 hover:bg-[gray]/50"
                        onClick={openModal}
                    >
                        <BookOpenIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}