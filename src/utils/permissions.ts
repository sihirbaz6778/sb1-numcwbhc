import { Camera } from '@nativescript/camera';
import { isAndroid } from '@nativescript/core';

export async function requestCameraPermission(): Promise<boolean> {
    if (isAndroid) {
        const hasPermission = await Camera.requestPermissions();
        return hasPermission;
    }
    return true;
}

export async function checkCameraPermission(): Promise<boolean> {
    if (isAndroid) {
        const hasPermission = await Camera.isAvailable();
        return hasPermission;
    }
    return true;
}