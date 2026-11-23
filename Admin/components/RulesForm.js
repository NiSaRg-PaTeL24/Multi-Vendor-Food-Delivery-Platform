import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RulesForm({ initialRules }) {
  const [formData, setFormData] = useState({
    taxPercentage: initialRules.taxPercentage,
    discountThreshold: initialRules.discountThreshold,
    discountPercentage: initialRules.discountPercentage,
    deliveryChargeThreshold: initialRules.deliveryChargeThreshold,
    deliveryCharge: initialRules.deliveryCharge,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/rules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/?success=rules_updated');
      } else {
        console.error('Rules update failed');
        router.push('/?error=update_failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      <h2>Manage Pricing Rules</h2>
      <p>Configure tax, discounts, and delivery charges for your food delivery service.</p>

      <form onSubmit={handleSubmit} className="rules-form">
        <div className="form-group">
          <label htmlFor="taxPercentage">🧾 Tax Percentage (%):</label>
          <input
            type="number"
            id="taxPercentage"
            name="taxPercentage"
            step="0.1"
            min="0"
            max="30"
            value={formData.taxPercentage}
            onChange={handleChange}
            required
          />
          <small>Current value: {initialRules.taxPercentage}%</small>
        </div>
        
        <div className="rule-section">
          <h3>Discount Rules</h3>
          <div className="form-group">
            <label htmlFor="discountThreshold">💰 Order Amount Threshold for Discount ($):</label>
            <input
              type="number"
              id="discountThreshold"
              name="discountThreshold"
              step="1"
              min="0"
              value={formData.discountThreshold}
              onChange={handleChange}
              required
            />
            <small>Orders above this amount qualify for discount</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="discountPercentage">🏷️ Discount Percentage (%):</label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              step="0.1"
              min="0"
              max="50"
              value={formData.discountPercentage}
              onChange={handleChange}
              required
            />
            <small>Amount of discount applied to qualifying orders</small>
          </div>
        </div>
        
        <div className="rule-section">
          <h3>Delivery Charge Rules</h3>
          <div className="form-group">
            <label htmlFor="deliveryChargeThreshold">📦 Delivery Charge Threshold ($):</label>
            <input
              type="number"
              id="deliveryChargeThreshold"
              name="deliveryChargeThreshold"
              step="0.1"
              min="0"
              value={formData.deliveryChargeThreshold}
              onChange={handleChange}
              required
            />
            <small>Orders below this amount incur delivery charges</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryCharge">🚚 Delivery Charge Amount ($):</label>
            <input
              type="number"
              id="deliveryCharge"
              name="deliveryCharge"
              step="0.01"
              min="0"
              value={formData.deliveryCharge}
              onChange={handleChange}
              required
            />
            <small>Fixed delivery fee for small orders</small>
          </div>
        </div>
        
        <div className="form-footer">
          <p className="last-updated">Last updated: {formatDate(initialRules.lastUpdated)}</p>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : '💾 Save Rules'}
          </button>
        </div>
      </form>

      <div className="rule-info">
        <h3>How These Rules Are Applied:</h3>
        <ul>
          <li><strong>Tax:</strong> Applied to all orders at the specified percentage rate</li>
          <li><strong>Discount:</strong> Applied when order subtotal exceeds the threshold amount</li>
          <li><strong>Delivery Fee:</strong> Applied when order subtotal is below the threshold amount</li>
        </ul>
      </div>
    </div>
  );
}