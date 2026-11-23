import dbConnect from '../../../lib/mongodb';
import Food from '../../../models/Food';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const foods = await Food.find({});
        res.status(200).json({ success: true, data: foods });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'POST':
      try {
        // Check if user is authenticated
        const session = await getSession(req, res);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        
        const food = await Food.create(req.body);
        res.status(201).json({ success: true, data: food });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
}