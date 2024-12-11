import { Camera, CameraOptions, ImageAsset } from '@nativescript/camera';

export class CameraService {
    private camera: Camera;

    constructor() {
        this.camera = new Camera();
    }

    async requestPermissions(): Promise<boolean> {
        return await this.camera.requestPermissions();
    }

    async takePicture(): Promise<ImageAsset> {
        const options: CameraOptions = {
            width: 640,
            height: 480,
            keepAspectRatio: true,
            saveToGallery: false
        };

        try {
            return await this.camera.takePicture(options);
        } catch (error) {
            console.error('Kamera hatası:', error);
            throw new Error('Fotoğraf çekilemedi');
        }
    }
}