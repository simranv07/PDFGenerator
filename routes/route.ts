import express from 'express';
import { pdfGenebrtor } from '../controllers/pdf.js';

const router = express.Router();

router.post('/pdf',pdfGenebrtor);


export default router;