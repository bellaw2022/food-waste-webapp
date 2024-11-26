"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { API_URL, useWasteSavingProgress } from "@/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";

const chartConfig = {} satisfies ChartConfig;

export function WasteSavingChart({ setVideo }: { setVideo: (src: string) => void }) {
    const { progress } = useWasteSavingProgress();

    const chartRef = useRef<HTMLDivElement>(null);
    const [prevScreenshot, takeScreenshot] = useScreenshot({ type: "image/png", quality: 1.0 });
    const [images, setImages] = useState<string[]>([]);
    const [imagesStarted, setImagesStarted] = useState(false);
    const [imagesDone, setImagesDone] = useState(false);

    useEffect(() => {
        if (!progress) return;
        if (chartRef.current && !imagesStarted) {
            setImagesStarted(true);
            const takeImagesInterval = setInterval(() => takeScreenshot(chartRef.current!), 20);
            setTimeout(() => {
                clearInterval(takeImagesInterval);
                setTimeout(() => setImagesDone(true), 500);
            }, 1500);
            
        }
    }, [progress, chartRef, imagesStarted, setImagesStarted, setImagesDone, takeScreenshot]);

    useEffect(() => {
        if (prevScreenshot) {
            setImages((oldImages) => [...oldImages, prevScreenshot]);
        }
    }, [prevScreenshot]);

    useEffect( () => {
        const getVideo = async () => {
            const userId = localStorage.getItem("user_id")!;
            const res = await fetch(`${API_URL}/user/${userId}/video`, {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "69420",
                }),
                body: JSON.stringify(images)
            })
            .then(res => res.blob())
            .then(blob => window.URL.createObjectURL(blob));
            setVideo(res);
        }
        if (imagesDone) {
            getVideo();
        }
    }, [imagesDone, images]);

    const totalCO2Saved = useMemo(() => {
        if (!progress) return 0;
        return progress.map((weekData) => weekData.amount).reduce((prev, curr) => prev + curr, 0);
    }, [progress]);

    if (!progress) return;

    return (
        <Card ref={chartRef} className="w-[320px] h-[300px] mx-auto">
            <CardHeader>
                <CardTitle>Waste Saved in CO₂ emissions</CardTitle>
                <CardDescription>
                    {/* I've saved {totalCO2Saved.toFixed(1)} kg CO2 over the last 4 weeks! */}
                    Tracking My Carbon Footprint | Over the past 4 weeks, I've saved {totalCO2Saved.toFixed(1)} kg of CO₂ emissions by consuming food before it expires using Fridgify!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={progress}
                        margin={{
                            left: 0,
                            right: 24,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="weekNumber"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            tickFormatter={(val) => `Week ${val}`}
                        />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="amount"
                            type="natural"
                            fill="green"
                            fillOpacity={0.4}
                            stroke="green"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};