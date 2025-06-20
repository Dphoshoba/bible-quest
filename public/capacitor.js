// Initialize Capacitor for web environment
(async () => {
  try {
    // Check if we're in a web environment
    const isWeb = typeof window !== 'undefined' && !window.Capacitor?.isNative;
    
    if (isWeb) {
      console.log('Running in web environment - initializing web-compatible Capacitor');
      
      // Create mock Capacitor objects for web
      window.Capacitor = {
        isNative: false,
        isPluginAvailable: () => false,
        registerPlugin: () => ({}),
        initialize: () => console.log('Capacitor initialized for web')
      };
      
      window.App = {
        initialize: async () => console.log('App plugin initialized for web'),
        addListener: async (eventName, callback) => {
          console.log(`Web listener created for ${eventName}`);
          return {
            remove: () => console.log(`Web listener removed for ${eventName}`)
          };
        }
      };
      
      window.Share = {
        share: async (options) => {
          // Use Web Share API if available
          if (navigator.share) {
            try {
              await navigator.share(options);
              return { value: 'shared' };
            } catch (error) {
              console.log('Web share cancelled or failed:', error);
              return { value: 'cancelled' };
            }
          } else {
            console.log('Web Share API not available');
            return { value: 'not_available' };
          }
        }
      };
      
      console.log('Capacitor initialized successfully for web environment');
    } else {
      // Native environment - try to import actual Capacitor modules
      try {
        const { Capacitor } = await import('@capacitor/core');
        const { App } = await import('@capacitor/app');
        const { Share } = await import('@capacitor/share');

        window.Capacitor = Capacitor;
        window.App = App;
        window.Share = Share;

        await App.initialize();
        console.log('Capacitor initialized successfully for native environment');
      } catch (importError) {
        console.warn('Could not import Capacitor modules, using web fallback:', importError);
        // Fall back to web implementation
        window.Capacitor = {
          isNative: false,
          isPluginAvailable: () => false,
          registerPlugin: () => ({}),
          initialize: () => console.log('Capacitor initialized (fallback)')
        };
      }
    }
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
    // Ensure we have at least basic Capacitor object
    if (!window.Capacitor) {
      window.Capacitor = {
        isNative: false,
        isPluginAvailable: () => false,
        registerPlugin: () => ({}),
        initialize: () => console.log('Capacitor initialized (error fallback)')
      };
    }
  }
})(); 