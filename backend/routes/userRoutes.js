import express from 'express';
import {
  getUsers,
  createUser,
  changeUserPassword,
  toggleUserArchive,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id/change-password', changeUserPassword);
router.patch('/:id/toggle-archive', toggleUserArchive);
router.delete('/:id', deleteUser);

export default router;
