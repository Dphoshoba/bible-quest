import React from 'react';

import { startCheckout } from './premium.js';

const UpgradeButton = () => {
  return (
    <button onClick={startCheckout} className="upgrade-btn">
      Upgrade to Premium
    </button>
  );
};

export default UpgradeButton;


