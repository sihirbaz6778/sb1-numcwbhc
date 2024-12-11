import { DatabaseService } from './database.service';
import { FaceRecognitionService } from './face-recognition.service';
import { AppConfig } from '../config/app.config';

export class AttendanceService {
    private dbService: DatabaseService;
    private faceService: FaceRecognitionService;

    constructor() {
        this.dbService = new DatabaseService();
        this.faceService = new FaceRecognitionService(AppConfig.GEMINI_API_KEY);
    }

    async takeAttendance(classId: number) {
        try {
            const students = await this.dbService.getStudentsByClass(classId);
            const image = await this.faceService.captureImage();
            const faceData = await this.faceService.analyzeFace(image);

            const presentStudents = [];
            const absentStudents = [];

            for (const student of students) {
                const similarity = await this.faceService.compareFaces(faceData, student.faceData);
                if (similarity > AppConfig.FACE_MATCH_THRESHOLD) {
                    await this.dbService.recordAttendance(student.id, true);
                    presentStudents.push(student);
                } else {
                    await this.dbService.recordAttendance(student.id, false);
                    absentStudents.push(student);
                }
            }

            return {
                presentStudents,
                absentStudents,
                totalStudents: students.length,
                date: new Date().toISOString().split('T')[0]
            };
        } catch (error) {
            console.error('Yoklama alma hatası:', error);
            throw error;
        }
    }

    async getAttendanceReport(classId: number, date: string) {
        try {
            const absentStudents = await this.dbService.getAbsentStudents(classId, date);
            const allStudents = await this.dbService.getStudentsByClass(classId);
            
            return {
                date,
                totalStudents: allStudents.length,
                presentCount: allStudents.length - absentStudents.length,
                absentCount: absentStudents.length,
                absentStudents
            };
        } catch (error) {
            console.error('Rapor oluşturma hatası:', error);
            throw error;
        }
    }
}