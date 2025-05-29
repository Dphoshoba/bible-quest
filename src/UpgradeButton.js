import React from 'react';

const UpgradeButton = () => {
  const handleUpgrade = async () => {
    try {
      const response = await fetch('http://localhost:5050/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: Unable to start checkout.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: Please try again.');
    }
  };

  return (
    <button onClick={handleUpgrade} className="upgrade-btn">
      Upgrade to Premium
    </button>
  );
};

export default UpgradeButton;


