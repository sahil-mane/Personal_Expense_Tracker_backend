import { Router } from 'express';
import { createExpense, deleteExpense, getExpenses } from '../controllers/expenseController.js';

const router = Router();

router.route('/').get(getExpenses).post(createExpense);
router.delete('/:id', deleteExpense);

export default router;
