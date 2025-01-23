import express from 'express';
import { checkAccess } from '../controllers/accessController.js';

const router = express.Router();

router.get('/check-access', checkAccess);

export default router;  // Use 'export default' to maintain consistency
