import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';

// @desc    Create a new item
// @route   POST /api/items
// @access  Private
const createItem = asyncHandler(async (req, res) => {
  const { name, description, category, itemCategory, location, date, images } = req.body;

  const item = await Item.create({
    user: req.user._id,
    name,
    description,
    category,
    itemCategory,
    location,
    date,
    images
  });

  if (item) {
    res.status(201).json(item);
  } else {
    res.status(400);
    throw new Error('Invalid item data');
  }
});

// @desc    Get all items with filters
// @route   GET /api/items
// @access  Public
const getItems = asyncHandler(async (req, res) => {
  const { category, itemCategory, search } = req.query;
  
  let query = {};
  
  if (category) {
    query.category = category;
  }

  if (itemCategory) {
    query.itemCategory = itemCategory;
  }
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const items = await Item.find(query).populate('user', 'name email');
  res.json(items);
});

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('user', 'name email');

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Get user's items
// @route   GET /api/items/myitems
// @access  Private
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id });
  res.json(items);
});

// @desc    Update item status
// @route   PUT /api/items/:id/status
// @access  Private
const updateItemStatus = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this item');
    }

    item.status = req.body.status || item.status;
    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this item');
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    if (item.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this item');
    }

    const { name, description, category, itemCategory, location, date, images } = req.body;

    item.name = name || item.name;
    item.description = description || item.description;
    item.category = category || item.category;
    item.itemCategory = itemCategory || item.itemCategory;
    item.location = location || item.location;
    item.date = date || item.date;
    item.images = images || item.images;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

export {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItemStatus,
  updateItem,
  deleteItem,
};