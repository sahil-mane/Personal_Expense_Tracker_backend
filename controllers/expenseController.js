import Expense from '../models/Expense.js';

const VALID_SORT_FIELDS = new Set(['date', 'amount', 'createdAt']);
const VALID_SORT_ORDERS = new Set(['asc', 'desc']);
const VALID_CATEGORIES = new Set(['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other']);

export async function getExpenses(req, res, next) {
  try {
    const requestedPage = Number.parseInt(req.query.page, 10);
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 50) : 10;
    const skip = (page - 1) * limit;

    // Build filter query
    const filter = {};
    if (req.query.category && VALID_CATEGORIES.has(req.query.category)) {
      filter.category = req.query.category;
    }
    if (req.query.dateFrom || req.query.dateTo) {
      filter.date = {};
      if (req.query.dateFrom) filter.date.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) {
        const to = new Date(req.query.dateTo);
        to.setHours(23, 59, 59, 999);
        filter.date.$lte = to;
      }
    }

    // Build sort
    const sortField = VALID_SORT_FIELDS.has(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const sortOrder = VALID_SORT_ORDERS.has(req.query.sortOrder) ? req.query.sortOrder : 'desc';
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

    const [expenses, totalExpenses, totals] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(limit),
      Expense.countDocuments(filter),
      Expense.aggregate([
        { $match: filter },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      expenses,
      pagination: {
        page,
        limit,
        totalExpenses,
        totalPages: Math.max(1, Math.ceil(totalExpenses / limit)),
        totalAmount: totals[0]?.totalAmount ?? 0
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createExpense(req, res, next) {
  try {
    const { amount, description, category, date } = req.body;
    if (!amount || !description?.trim() || !category?.trim() || !date) {
      return res.status(400).json({ message: 'Amount, description, category, and date are required.' });
    }
    const expense = await Expense.create({ amount, description, category, date });
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
      data: expense
    });
  } catch (error) {
    next(error);
  }
}
