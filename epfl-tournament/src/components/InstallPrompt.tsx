import React, { useState, useEffect } from 'react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return;
    }

    const dismissed = localStorage.getItem('efpl_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isIOSDevice) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS prompt anyway if not standalone
    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!showPrompt || isStandalone) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('efpl_install_dismissed', Date.now().toString());
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="bg-brand-surface border-t-2 border-brand-accent shadow-2xl p-4 flex items-center justify-between pointer-events-auto rounded-sm border-x border-b border-brand-border box-shadow-editorial w-full max-w-md">
        <div className="flex items-center gap-3">
          <img src="/icon-192.png" alt="EFPL" className="w-10 h-10 rounded-sm" />
          <div className="flex flex-col">
            <span className="font-sans font-bold text-brand-dark text-sm leading-tight">Install EFPL App</span>
            <span className="font-sans text-[10px] text-brand-gray">
              {isIOS ? 'Tap Share → Add to Home Screen' : 'Add to home screen'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isIOS && (
            <button 
              onClick={handleInstall}
              className="border border-brand-accent text-brand-accent px-4 py-2 font-sans font-bold text-[10px] tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-colors"
            >
              Install
            </button>
          )}
          <button 
            onClick={handleDismiss}
            className="text-brand-gray p-2 hover:text-brand-dark"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
