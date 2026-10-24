'use client';

import { ImageSlideShow } from "./images/ImageSlideShow"

export const TopBanner = () => {
    return (
        <div className="relative w-full min-w-0 px-4 py-4 md:pl-8 md:pr-2 flex flex-col md:flex-row md:w-[80%]">
            {/* Left slideshow section with fixed dimensions to prevent layout shift */}
            <div className="w-full md:w-[60%] aspect-video max-w-[718px] relative h-96 bg-gray-100">
                <ImageSlideShow />
            </div>
        </div>
    )
}