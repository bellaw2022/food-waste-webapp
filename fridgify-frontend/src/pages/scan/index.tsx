import { Button } from "@/components/ui/button";
import { BookOpenIcon, CheckIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowDimensions } from "@/hooks";
import { Alert } from "@/components/ui/alert";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import { detectVideo } from "./utils/detect";
import Webcam from "react-webcam";
import { Link } from "react-router-dom";
import { useScanningCart } from "@/store/scanning-cart";
import { ManualInputModal } from "./modal";
// import { Webcam } from "./utils/webcam";

export const ScanningPage = () => {
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
    const { openModal } = useScanningCart();

    return (
        <div className="p-4 h-full flex flex-col items-center h-screen overflow-hidden">
            <ManualInputModal />
            <div className="flex flex-row items-center justify-between w-full">
                <Link to="/inventory">
                    <Button variant="outline">Back</Button>
                </Link>
                <Button>Finish</Button>
            </div>
            <div className="mt-[390px] flex flex-row items-center justify-center">
                <Alert className="w-[200px] p-2 bg-white rounded-r-none text-center text-xl">
                    Scan an item
                </Alert>
                <Button className="h-full rounded-l-none bg-orange-300" variant="outline"
                    onClick={openModal}
                >
                    <BookOpenIcon />
                </Button>            
            </div>

            <div className="mt-16 w-fit h-fit rounded-full bg-white">
                <Button variant="outline" 
                    className="rounded-full w-16 h-16 border-[green] bg-[green]/30 hover:bg-[green]/50"
                >
                    <CheckIcon color="green" />
                </Button>
            </div>
        </div>
    )
}