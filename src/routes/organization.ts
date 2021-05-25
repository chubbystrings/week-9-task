import express from 'express';
import {
  createOrganization,
  getAllOrganizations,
  getOneOrganization,
  updateAnOrganization,
  deleteOrganization,
} from '../controllers/organizations';

import { verifyToken } from '../middleware/user';

const router = express.Router();

router.get('/', verifyToken, getAllOrganizations);
router.get('/:id', verifyToken, getOneOrganization);
router.post('/', verifyToken, createOrganization);
router.put('/:id', verifyToken, updateAnOrganization);
router.delete('/:id', verifyToken, deleteOrganization);

export default router;
