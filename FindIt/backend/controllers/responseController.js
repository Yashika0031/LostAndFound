import asyncHandler from 'express-async-handler';
import Response from '../models/responseModel.js';
import Item from '../models/itemModel.js';
import User from '../models/userModel.js';
import { sendMatchNotification, sendClaimNotification } from '../utils/emailService.js';

// @desc    Create a new response
// @route   POST /api/items/:id/responses
// @access  Private
const createResponse = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('user', 'name email');

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  const { message, claimingMatch } = req.body;
  const responder = await User.findById(req.user._id);

  const response = await Response.create({
    item: item._id,
    user: req.user._id,
    message,
    claimingMatch
  });

  const populatedResponse = await Response.findById(response._id)
    .populate('user', 'name email')
    .populate('item', 'name category');

  // Send notifications asynchronously
  Promise.all([
    sendClaimNotification(item.user, responder, item, message, claimingMatch),
    claimingMatch ? sendMatchNotification(item.user, responder, item) : Promise.resolve()
  ]).catch(err => console.error('Error sending notifications:', err));

  if (response) {
    res.status(201).json(populatedResponse);
  } else {
    res.status(400);
    throw new Error('Invalid response data');
  }
});

// @desc    Get responses for an item
// @route   GET /api/items/:id/responses
// @access  Private
const getItemResponses = asyncHandler(async (req, res) => {
  const responses = await Response.find({ item: req.params.id })
    .populate('user', 'name email')
    .populate('item', 'name category');

  res.json(responses);
});

// @desc    Update response status
// @route   PUT /api/responses/:id
// @access  Private
const updateResponseStatus = asyncHandler(async (req, res) => {
  const response = await Response.findById(req.params.id)
    .populate({
      path: 'item',
      populate: { path: 'user', select: 'name email' }
    })
    .populate('user', 'name email');

  if (!response) {
    res.status(404);
    throw new Error('Response not found');
  }

  // Check if the user is the owner of the item
  if (response.item.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this response');
  }

  const previousStatus = response.status;
  response.status = req.body.status;
  
  // If accepting a match claim, update the item status and send notifications
  if (response.claimingMatch && req.body.status === 'Accepted' && previousStatus !== 'Accepted') {
    // Update item status
    const item = await Item.findById(response.item._id);
    
    // For both Lost and Found items, mark as Resolved when accepted
    item.status = 'Resolved';
    await item.save();

    // Send acceptance notification to the responder
    await sendMatchNotification(
      response.user,  // Responder
      {
        name: response.item.user.name,
        email: response.item.user.email
      },
      {
        ...item.toObject(),
        status: 'Resolved'
      }
    );

    // Update all other responses to Rejected
    await Response.updateMany(
      { 
        item: item._id, 
        _id: { $ne: response._id },
        status: 'Pending'
      },
      { status: 'Rejected' }
    );
  }

  const updatedResponse = await response.save();
  res.json(updatedResponse);
});

// @desc    Get my responses
// @route   GET /api/responses/me
// @access  Private
const getMyResponses = asyncHandler(async (req, res) => {
  const responses = await Response.find({ user: req.user._id })
    .populate({
      path: 'item',
      select: 'name category status location date images user',
      populate: { path: 'user', select: 'name email' }
    })
    .sort('-createdAt');

  if (!responses) {
    return res.json([]);
  }

  res.json(responses);
});

export {
  createResponse,
  getItemResponses,
  updateResponseStatus,
  getMyResponses,
};