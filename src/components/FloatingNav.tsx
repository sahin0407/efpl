import { motion } from 'motion/react';
import { Home, Trophy, Calendar, BarChart2, Shield, Settings } from 'lucide-react';

type Tab = 'home' | 'standings' | 'fixtures' | 'results' | 'stats' | 'graph' | 'clubs' | 'rules' | 'admin';

interface FloatingNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  hasLiveMatch: boolean;
}

export function FloatingNav({ activeTab, setActiveTab, hasLiveMatch }: FloatingNavProps) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'standings', label: 'TABLE', icon: Trophy },
    { id: 'fixtures', label: 'FIXTURES', icon: Calendar, showLiveIndicator: hasLiveMatch },
    { id: 'graph', label: 'GRAPH', icon: BarChart2 },
    { id: 'clubs', label: 'CLUBS', icon: Shield },
    { id: 'admin', label: 'ADMIN', icon: Settings },
  ] as const;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.3, 
        ease: [0.34, 1.56, 0.64, 1] 
      }}
      className="fixed z-50 flex items-center justify-around px-2 py-2 mx-4 bottom-[calc(24px+env(safe-area-inset-bottom))]"
      style={{
        left: 0,
        right: 0,
        width: 'calc(100% - 32px)',
        maxWidth: '420px',
        marginInline: 'auto',
        borderRadius: '100px',
        backgroundColor: 'var(--floating-nav-bg, rgba(255, 255, 255, 0.85))',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--floating-nav-border, rgba(200, 168, 75, 0.2))',
        boxShadow: 'var(--floating-nav-shadow, 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9))',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className="group relative flex flex-col items-center justify-start h-[52px] min-w-[50px] transition-transform active:scale-[0.98]"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="relative flex items-center justify-center h-[36px] px-[14px]">
              {isActive && (
                <motion.div
                  layoutId="floatingNavIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 rounded-[100px]"
                  style={{
                    backgroundColor: '#C8A84B',
                    zIndex: 0
                  }}
                />
              )}
              
              <div className="relative z-10">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.15, 1] : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon 
                    size={20} 
                    className="transition-colors duration-200"
                    style={{ 
                      color: isActive ? 'var(--floating-nav-icon-active, #111111)' : '#999999',
                    }}
                  />
                </motion.div>
                
                {('showLiveIndicator' in item && item.showLiveIndicator) && (
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#E63946] rounded-full animate-pulse" />
                )}
              </div>
            </div>
            
            <div className="h-[12px] flex items-end justify-center w-full">
              {isActive && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="font-sans tracking-wide text-center uppercase"
                  style={{ 
                    fontSize: '8px', 
                    color: '#C8A84B',
                    lineHeight: '1',
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </div>
          </button>
        );
      })}
    </motion.div>
  );
}
