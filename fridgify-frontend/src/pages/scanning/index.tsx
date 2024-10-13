import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon } from "lucide-react";
import Webcam from "react-webcam";
import { useMemo, useRef } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { Alert } from "@/components/ui/alert";

export default function ScanningPage() {
    const webcamRef = useRef<Webcam>(null);

    const { width, height } = useWindowDimensions();
    const videoConstraints = useMemo(() => ({
        width, height,
        facingMode: "environment",
    }), [width, height]);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-0 left-0">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onUserMedia={() => {}}
                />
            </div>
            <div className="w-full h-full absolute top-0 left-0 z-10">
                <Overlay />                
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

const Overlay = () => {
    return (
        <div className="p-4 h-full flex flex-col items-center h-screen overflow-hidden">
            <div className="flex flex-row items-center justify-between w-full">
                <Button variant="outline">Back</Button>
                <Button>Finish</Button>
            </div>

            <Alert className="mt-[380px] flex flex-col items-center gap-2 bg-white/50">
                <Input type="text" className="bg-white"></Input>
                <div className="flex flex-row gap-4">
                    <Input type="number" className="bg-white"></Input>
                    <Select>
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="count">count</SelectItem>
                            {/* <SelectItem value="dark">Dark</SelectItem> */}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    Expires in: <Input type="number" className="inline mx-2 w-14 bg-white"></Input> days
                </div>
            </Alert>

            <div className="mt-8 w-fit h-fit rounded-full bg-white">
                <Button variant="outline" 
                    className="rounded-full w-14 h-14 border-[green] bg-[green]/30 hover:bg-[green]/50"
                >
                    <CheckIcon color="green" />
                </Button>
            </div>
        </div>
    )
}