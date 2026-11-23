import dbConnect from '../../../lib/mongodb';
import Rule from '../../../models/Rule';
import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const rule = await Rule.getActiveRules();
        res.status(200).json({ success: true, data: rule });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        // Check if user is authenticated
        const session = await getSession(req, res);
        if (!session) {
          return res.status(401).json({ success: false, message: 'Not authenticated' });
        }
        
        const rule = await Rule.getActiveRules();
        
        // Update rule values
        rule.taxPercentage = parseFloat(req.body.taxPercentage);
        rule.discountThreshold = parseFloat(req.body.discountThreshold);
        rule.discountPercentage = parseFloat(req.body.discountPercentage);
        rule.deliveryChargeThreshold = parseFloat(req.body.deliveryChargeThreshold);
        rule.deliveryCharge = parseFloat(req.body.deliveryCharge);
        rule.lastUpdated = new Date();
        
        await rule.save();
        
        res.status(200).json({ success: true, data: rule });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' });
      break;
  }
}