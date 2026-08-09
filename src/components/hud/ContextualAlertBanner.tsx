import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Radio, ShieldAlert, Sparkles, X } from 'lucide-react';
import { eventBus } from '../../core/events';

interface AlertData {
  id: string;
  title: string;
  subtitle?: string;
  severity: 'warning' | 'danger' | 'info';
}

export const ContextualAlertBanner: React.FC = () => {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showAlert = (title: string, subtitle?: string, severity: 'warning' | 'danger' | 'info' = 'warning', durationMs = 4200) => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
    }

    setActiveAlert({
      id: `alert-${Date.now()}`,
      title,
      subtitle,
      severity,
    });
    setIsVisible(true);

    dismissTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setActiveAlert(null), 300); // Allow fade out animation
    }, durationMs);
  };

  useEffect(() => {
    const handleDroneDetected = () => {
      showAlert('⚠ ALIEN SURVEY DRONE DETECTED', 'Autonomous probe present in local sector.', 'warning');
    };

    const handleDroneStateChanged = (payload: { droneId: string; state: string }) => {
      if (payload.state === 'ATTACK') {
        showAlert('⚠ ALIEN PROBE ENGAGING', 'Hostile lock detected! Evasive maneuvers advised.', 'danger', 4500);
      }
    };

    const handleInterferenceChanged = (payload: { active: boolean }) => {
      if (payload.active) {
        showAlert('⚠ SCANNER INTERFERENCE DETECTED', 'Alien probe signal affecting scan resolution.', 'warning');
      }
    };

    const handleAuraAlert = (payload: { message: string; severity?: 'info' | 'warning' | 'danger' }) => {
      showAlert('AURA ADVISORY', payload.message, payload.severity || 'info', 5000);
    };

    const handleDroneDestroyed = () => {
      showAlert('DRONE NEUTRALIZED', 'Alien survey probe destroyed. Telemetry data recovered.', 'info', 3500);
    };

    eventBus.on('DRONE_DETECTED', handleDroneDetected);
    eventBus.on('DRONE_STATE_CHANGED', handleDroneStateChanged);
    eventBus.on('SCANNER_INTERFERENCE_CHANGED', handleInterferenceChanged);
    eventBus.on('AURA_ALERT', handleAuraAlert);
    eventBus.on('DRONE_DESTROYED', handleDroneDestroyed);

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      eventBus.off('DRONE_DETECTED', handleDroneDetected);
      eventBus.off('DRONE_STATE_CHANGED', handleDroneStateChanged);
      eventBus.off('SCANNER_INTERFERENCE_CHANGED', handleInterferenceChanged);
      eventBus.off('AURA_ALERT', handleAuraAlert);
      eventBus.off('DRONE_DESTROYED', handleDroneDestroyed);
    };
  }, []);

  if (!activeAlert) return null;

  const getThemeClasses = () => {
    switch (activeAlert.severity) {
      case 'danger':
        return {
          bg: 'bg-red-950/90 border-red-500/70 text-red-200',
          iconBg: 'bg-red-500/20 text-red-400 border-red-500/40',
          titleColor: 'text-red-300',
          Icon: ShieldAlert,
        };
      case 'info':
        return {
          bg: 'bg-cyan-950/90 border-cyan-500/70 text-cyan-200',
          iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
          titleColor: 'text-cyan-300',
          Icon: Sparkles,
        };
      case 'warning':
      default:
        return {
          bg: 'bg-amber-950/90 border-amber-500/70 text-amber-200',
          iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
          titleColor: 'text-amber-300',
          Icon: AlertTriangle,
        };
    }
  };

  const theme = getThemeClasses();
  const IconComponent = theme.Icon;

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-md w-[90vw] pointer-events-auto font-sans select-none transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
      }`}
    >
      <div className={`p-3 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 ${theme.bg}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`p-2 rounded-lg border shrink-0 ${theme.iconBg}`}>
            <IconComponent size={16} className="animate-pulse" />
          </div>
          <div className="min-w-0">
            <h4 className={`text-xs font-mono font-extrabold uppercase tracking-wider ${theme.titleColor} truncate`}>
              {activeAlert.title}
            </h4>
            {activeAlert.subtitle && (
              <p className="text-[11px] font-sans text-slate-300 leading-tight mt-0.5 truncate">
                {activeAlert.subtitle}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ContextualAlertBanner;
