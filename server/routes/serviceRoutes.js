import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(createService);

router.route('/:id')
  .get(getServiceById);

export default router;
