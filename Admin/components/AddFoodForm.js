import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddFoodForm() {
  const [formData, setFormData] = useState({
    name: '',
    restaurant: '',
    price: '',
    available: true,
    appClient: "Uber",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked} = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/foods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        }),
      });

      if (res.ok) {
        router.push('/?success=food_added');
      } else {
        console.error('Submission failed');
        router.push('/?error=submission_failed');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-food-container">
      <h2>Add a New Food Item</h2>
      <form onSubmit={handleSubmit} className="food-form">
        <div className="form-group">
          <label htmlFor="name">🍔 Food Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter food name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="restaurant">🏬 Provider Restaurant:</label>
          <input
            type="text"
            id="restaurant"
            name="restaurant"
            value={formData.restaurant}
            onChange={handleChange}
            required
            placeholder="Enter restaurant name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">💰 Price ($):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            required
            placeholder="Enter price"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="available"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label htmlFor="available">✅ Available</label>
        </div>

        <div>
          
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : '➕ Add Food'}
        </button>
      </form>
    </div>
  );
}