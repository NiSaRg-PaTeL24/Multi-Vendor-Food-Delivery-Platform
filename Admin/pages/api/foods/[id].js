import dbConnect from '../../../lib/mongodb';
import Food from '../../../models/Food';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const { 
    query: { id },
    method
  } = req;

  await dbConnect();

  // For all methods except GET, check authentication
  if (method !== 'GET') {
    const session = await getSession(req, res);
    if (!session) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
  }

  switch (method) {
    case 'GET':
      try {
        const food = await Food.findById(id);
        if (!food) {
          return res.status(404).json({ success: false, message: 'Food not found' });
        }
        res.status(200).json({ success: true, data: food });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedFood = await Food.findByIdAndDelete(id);
        if (!deletedFood) {
          return res.status(404).json({ success: false, message: 'Food not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
}