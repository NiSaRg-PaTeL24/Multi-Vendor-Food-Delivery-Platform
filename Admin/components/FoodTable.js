import { useState } from 'react';
import { useRouter } from 'next/router';

export default function FoodTable({ foods = [], isAuthenticated }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      setIsDeleting(true);
      
      try {
        const res = await fetch(`/api/foods/${id}`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          // Refresh the page to show updated data
          router.push('/?success=food_deleted');
        } else {
          console.error('Delete failed');
          router.push('/?error=delete_failed');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="food-table-container">
      <h2>Available Foods</h2>
      {foods.length === 0 ? (
        <p>No food items available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Restaurant</th>
              <th>Price</th>
              <th>Available</th>
              {isAuthenticated && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id}>
                <td>{food.name}</td>
                <td>{food.restaurant}</td>
                <td>${food.price.toFixed(2)}</td>
                <td>{food.available ? "✅ Yes" : "❌ No"}</td>
                {isAuthenticated && (
                  <td>
                    <button 
                      onClick={() => handleDelete(food._id)} 
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}