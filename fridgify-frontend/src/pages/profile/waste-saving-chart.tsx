"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { createGIF } from "gifshot";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useWasteSavingProgress } from "@/api";
import { useEffect, useMemo, useRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";

const chartConfig = {} satisfies ChartConfig;

const getImgURL = (base64ImageData: string) => {
    const contentType = 'image/png';
    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    const blobUrl = URL.createObjectURL(blob);

    return blobUrl;
}

export function WasteSavingChart({ setGif }: { setGif: (src: string) => void }) {
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
            const url = getImgURL(prevScreenshot);
            setImages((oldImages) => [...oldImages, url]);
        }
    }, [prevScreenshot]);

    useEffect(() => {
        if (imagesDone) {
            const options = {
                images: images,
                gifWidth: 320,
                gifHeight: 300,
                numWorkers: 5,
                frameDuration: 0.05,
                sampleInterval: 10,
              };
          
              createGIF(options, (obj) => {
                if (!obj.error) {
                  setGif(obj.image);
                }
              });
        }
    }, [imagesDone, images, setGif]);

    const totalCO2Saved = useMemo(() => {
        if (!progress) return 0;
        return progress.map((weekData) => weekData.amount).reduce((prev, curr) => prev + curr, 0);
    }, [progress]);

    if (!progress) return;

    return (
        <Card ref={chartRef} className="w-[320px] h-[300px] mx-auto">
            <CardHeader>
                <CardTitle>Waste Saved in CO2</CardTitle>
                <CardDescription>
                    I've saved {totalCO2Saved.toFixed(1)} kg CO2 over the last 4 weeks!
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