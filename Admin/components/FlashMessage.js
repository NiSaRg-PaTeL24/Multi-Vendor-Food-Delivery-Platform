import { useEffect, useState } from 'react';

export default function FlashMessage({ type, message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto hide the message after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`flash-message flash-${type}`}>
      {message}
    </div>
  );
}