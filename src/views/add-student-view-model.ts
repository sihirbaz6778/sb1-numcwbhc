import { Observable } from '@nativescript/core';
import { DatabaseService } from '../services/database.service';
import { FaceRecognitionService } from '../services/face-recognition.service';

export class AddStudentViewModel extends Observable {
    private dbService: DatabaseService;
    private faceService: FaceRecognitionService;
    
    public studentName: string = '';
    public studentNumber: string = '';
    public studentPhoto: any = null;
    private faceData: string = '';

    constructor() {
        super();
        this.dbService = new DatabaseService();
        this.faceService = new FaceRecognitionService('YOUR_GEMINI_API_KEY');
    }

    async capturePhoto() {
        try {
            const image = await this.faceService.captureImage();
            this.studentPhoto = image;
            this.notifyPropertyChange('studentPhoto', this.studentPhoto);

            // Yüz verisini analiz et ve sakla
            this.faceData = await this.faceService.analyzeFace(image);
        } catch (error) {
            console.error('Fotoğraf çekme hatası:', error);
        }
    }

    async saveStudent() {
        if (!this.studentName || !this.studentNumber || !this.faceData) {
            console.log('Tüm alanları doldurun');
            return;
        }

        try {
            await this.dbService.addStudent(
                this.studentName,
                this.studentNumber,
                this.faceData,
                1 // Örnek sınıf ID'si
            );
            
            // Ana sayfaya geri dön
            // Frame.topmost().goBack();
        } catch (error) {
            console.error('Öğrenci kaydetme hatası:', error);
        }
    }
}