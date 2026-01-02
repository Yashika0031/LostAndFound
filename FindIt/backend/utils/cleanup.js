import Item from '../models/itemModel.js';
import Response from '../models/responseModel.js';

const DAYS_BEFORE_DELETION = 7;

/**
 * Delete resolved items older than specified days
 * Returns number of items deleted
 */
const cleanupOldResolvedItems = async () => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_BEFORE_DELETION);

  try {
    // Find all resolved items older than cutoff date
    const oldItems = await Item.find({
      status: 'Resolved',
      updatedAt: { $lt: cutoffDate }
    });

    if (oldItems.length === 0) {
      console.log('No old resolved items to clean up');
      return 0;
    }

    // Get IDs of items to be deleted
    const itemIds = oldItems.map(item => item._id);

    // Delete associated responses first
    await Response.deleteMany({ item: { $in: itemIds } });

    // Delete the items
    await Item.deleteMany({
      _id: { $in: itemIds }
    });

    console.log(`Cleaned up ${itemIds.length} old resolved items`);
    return itemIds.length;
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
};

export { cleanupOldResolvedItems };