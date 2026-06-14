import express from 'express';
import {
  getFloors, createFloor, updateFloor, deleteFloor,
  getTables, createTable, updateTable, deleteTable,
} from '../controllers/floorController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/floors')
  .get(getFloors)
  .post(authorize('admin'), createFloor);

router.route('/floors/:id')
  .put(authorize('admin'), updateFloor)
  .delete(authorize('admin'), deleteFloor);

router.route('/tables')
  .get(getTables)
  .post(authorize('admin'), createTable);

router.route('/tables/:id')
  .put(updateTable)
  .delete(authorize('admin'), deleteTable);

export default router;
