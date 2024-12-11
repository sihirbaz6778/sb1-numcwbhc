import { Observable } from '@nativescript/core';
import { DatabaseService } from '../services/database.service';
import { FaceRecognitionService } from '../services/face-recognition.service';

export class MainViewModel extends Observable {
    private dbService: DatabaseService;
    private faceService: FaceRecognitionService;
    public students: any[] = [];

    constructor() {
        super();
        this.dbService = new DatabaseService();
        this.faceService = new FaceRecognitionService('YOUR_GEMINI_API_KEY');
        this.loadStudents();
    }

    async loadStudents() {
        const classId = 1; // Örnek sınıf ID'si
        this.students = await this.dbService.getStudentsByClass(classId);
        this.notifyPropertyChange('students', this.students);
    }

    async startAttendance() {
        try {
            const image = await this.faceService.captureImage();
            const faceData = await this.faceService.analyzeFace(image);
            
            // Sınıftaki tüm öğrencilerin yüzlerini karşılaştır
            for (const student of this.students) {
                const similarity = await this.faceService.compareFaces(faceData, student.faceData);
                if (similarity > 0.8) { // Eşleşme eşiği
                    await this.dbService.recordAttendance(student.id, true);
                }
            }

            // Yoklamaya katılmayan öğrencileri getir
            const date = new Date().toISOString().split('T')[0];
            const absentStudents = await this.dbService.getAbsentStudents(1, date);
            
            // Yoklama raporu oluştur
            console.log('Devamsız öğrenciler:', absentStudents);
        } catch (error) {
            console.error('Yoklama alma hatası:', error);
        }
    }

    navigateToAddStudent() {
        // Öğrenci ekleme sayfasına yönlendirme
    }

    navigateToReports() {
        // Raporlar sayfasına yönlendirme
    }

    onStudentTap(args) {
        const student = this.students[args.index];
        // Öğrenci detay sayfasına yönlendirme
    }
}