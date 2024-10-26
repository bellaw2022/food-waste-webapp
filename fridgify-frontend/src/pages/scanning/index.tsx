import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { Alert } from "@/components/ui/alert";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import { detectVideo } from "./utils/detect";
import Webcam from "react-webcam";
// import { Webcam } from "./utils/webcam";

export default function ScanningPage() {
    // const webcamRef = new Webcam();
    const webcamRef = useRef<Webcam>(null);
    // const cameraRef = useRef(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { width, height } = useWindowDimensions();
    const videoConstraints = useMemo(() => ({
        width, height,
        facingMode: "environment",
    }), [width, height]);

    // const [loading, setLoading] = useState({ loading: true, progress: 0 }); // loading state
    const [model, setModel] = useState({
        net: null,
        inputShape: [1, 0, 0, 3],
    }); // init model & input shape

    // references

    // model configs
    const modelName = "yolov8n";

    // useEffect(() => {
    //     webcam.open(cameraRef.current); // open webcam
    //     // cameraRef.current.style.display = "block"; // show camera
    // }, []);

    useEffect(() => {
        tf.ready().then(async () => {
        const yolov8 = await tf.loadGraphModel(
            `/${modelName}_web_model/model.json`,
            {
            onProgress: (fractions) => {
                // setLoading({ loading: true, progress: fractions }); // set loading fractions
                console.log(fractions);
            },
            }
        ); // load model

            // warming up model
            const dummyInput = tf.ones(yolov8.inputs[0].shape);
            const warmupResults = yolov8.execute(dummyInput);

            // setLoading({ loading: false, progress: 1 });
            setModel({
                net: yolov8,
                inputShape: yolov8.inputs[0].shape,
            }); // set model & input shape

            tf.dispose([warmupResults, dummyInput]); // cleanup memory
        });
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="absolute top-0 left-0">
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    onPlay={() => detectVideo(webcamRef.current?.video, model, canvasRef.current)}
                />
                {/* <video
                    autoPlay
                    muted
                    ref={cameraRef}
                    width={width}
                    height={height}
                    onPlay={() => detectVideo(cameraRef.current, model, canvasRef.current)}
                /> */}
                 {/* <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} /> */}
            </div>
            <div className="absolute top-0 left-0">
                <canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef} />
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