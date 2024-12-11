import { ImageAsset, ImageSource } from '@nativescript/core';

export async function imageAssetToBase64(asset: ImageAsset): Promise<string> {
    try {
        const imageSource = await ImageSource.fromAsset(asset);
        return imageSource.toBase64String('jpg', 80);
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
}