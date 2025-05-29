// Initialize Capacitor
(async () => {
  try {
    // Import Capacitor dynamically
    const { Capacitor } = await import('@capacitor/core');
    const { App } = await import('@capacitor/app');
    const { Share } = await import('@capacitor/share');

    // Initialize Capacitor first
    Capacitor.initialize();

    // Set up plugins
    window.Capacitor = Capacitor;
    window.App = App;
    window.Share = Share;

    // Initialize App plugin
    await App.initialize();

    // Create event listeners with error handling and retry mechanism
    const createListener = async (eventName, callback, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          // Ensure App plugin is available
          if (!window.App) {
            console.error('App plugin not available');
            await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
            continue;
          }

          // Create the listener
          const listener = await window.App.addListener(eventName, callback);
          console.log(`Created listener for ${eventName} on attempt ${i + 1}`);
          return listener;
        } catch (error) {
          console.error(`Error creating ${eventName} listener (attempt ${i + 1}):`, error);
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
          }
        }
      }
      return null;
    };

    // Create and store event listeners with retry mechanism
    const listeners = {
      appStateChange: await createListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        // Trigger any necessary UI updates
        document.dispatchEvent(new CustomEvent('appStateChange', { detail: { isActive } }));
      }),
      pause: await createListener('pause', () => {
        console.log('App paused');
        document.dispatchEvent(new CustomEvent('appPause'));
      }),
      resume: await createListener('resume', () => {
        console.log('App resumed');
        document.dispatchEvent(new CustomEvent('appResume'));
      })
    };

    // Store listeners for cleanup
    window._capacitorListeners = listeners;

    // Verify listeners were created successfully
    const failedListeners = Object.entries(listeners)
      .filter(([_, listener]) => listener === null)
      .map(([name]) => name);

    if (failedListeners.length > 0) {
      console.warn('Failed to create listeners for:', failedListeners);
      // Attempt to recreate failed listeners
      for (const name of failedListeners) {
        listeners[name] = await createListener(name, () => {
          console.log(`${name} event triggered`);
          document.dispatchEvent(new CustomEvent(name));
        });
      }
    } else {
      console.log('Capacitor initialized successfully with all event listeners');
    }

    // Ensure listeners are properly bound
    Object.entries(listeners).forEach(([name, listener]) => {
      if (listener) {
        console.log(`Listener for ${name} is properly bound`);
      }
    });

    // Add a small delay to ensure everything is properly initialized
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify Capacitor is properly initialized
    if (window.Capacitor && window.App) {
      console.log('Capacitor and App plugin are properly initialized');
    } else {
      console.error('Capacitor or App plugin not properly initialized');
    }
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
})(); 