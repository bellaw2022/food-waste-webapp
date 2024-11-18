/// <reference types="vite/client" />

declare module 'use-react-screenshot' {
    type UseScreenshot = (options: {
      type: 'image/jpeg' | 'image/png'
      quality: number
    }) => [string | null, (ref: HTMLDivElement) => void]
    declare const useScreenshot: UseScreenshot
    export { useScreenshot }
}

declare module 'gifshot' {
  type Options = {
    images: string[],
    gifWidth: number,
    gifHeight: number,
    numWorkers: number,
    frameDuration: number,
    sampleInterval: number
  };
  type Obj = {
    error: string
    image: string
  };
  type objCallback = (obj: Obj) => void;
  declare const createGIF: (options: Options, callback: objCallback) => void;
}