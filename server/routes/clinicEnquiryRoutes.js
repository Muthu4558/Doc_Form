import express from 'express';
import { submitClinicEnquiry, getAllClinicEnquiries } from '../controllers/clinicEnquiryController.js';

const router = express.Router();

router.post('/submit', submitClinicEnquiry);
router.get('/all', getAllClinicEnquiries);

export default router;