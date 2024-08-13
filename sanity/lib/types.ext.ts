import { internalGroqTypeReferenceTo, SanityImageHotspot, SanityImageCrop } from "./sanity.types";

export type ImageAsset = {
    asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
}