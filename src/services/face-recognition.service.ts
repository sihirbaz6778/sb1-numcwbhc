import { GoogleGenerativeAI } from '@google/generative-ai';
import { ImageAsset } from '@nativescript/core';
import { imageAssetToBase64 } from '../utils/image-utils';
import { AppConfig } from '../config/app.config';

export class FaceRecognitionService {
    private genAI: GoogleGenerativeAI;

    constructor() {
        this.genAI = new GoogleGenerativeAI(AppConfig.GEMINI_API_KEY);
    }

    async analyzeFace(imageAsset: ImageAsset): Promise<string> {
        try {
            const base64Image = await imageAssetToBase64(imageAsset);
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
            
            const result = await model.generateContent({
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                }
            });

            return result.response.text();
        } catch (error) {
            console.error('Yüz analizi hatası:', error);
            throw new Error('Yüz analizi yapılamadı');
        }
    }

    async compareFaces(faceData1: string, faceData2: string): Promise<number> {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Compare these two face descriptions and return a similarity score between 0 and 1:
                          Face 1: ${faceData1}
                          Face 2: ${faceData2}`;
            
            const result = await model.generateContent(prompt);
            const similarityScore = parseFloat(result.response.text());
            
            return isNaN(similarityScore) ? 0 : Math.max(0, Math.min(1, similarityScore));
        } catch (error) {
            console.error('Yüz karşılaştırma hatası:', error);
            throw new Error('Yüzler karşılaştırılamadı');
        }
    }
}