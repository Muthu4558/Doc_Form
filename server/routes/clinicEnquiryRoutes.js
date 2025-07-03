import express from 'express';
import { submitClinicEnquiry, getAllClinicEnquiries, updateClinicEnquiry, deleteClinicEnquiry  } from '../controllers/clinicEnquiryController.js';

const router = express.Router();

router.post('/submit', submitClinicEnquiry);
router.get('/all', getAllClinicEnquiries);
router.patch('/update/:id', updateClinicEnquiry);
router.delete('/delete/:id', deleteClinicEnquiry);

export default router;