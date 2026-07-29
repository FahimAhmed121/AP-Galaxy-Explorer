import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, ArrowLeft, Check, Sparkles, Star, User } from 'lucide-react';
import { Galaxy } from '../../types';
import { audioEngine } from '../../engine/audioEngine';

interface CertificateProps {
  galaxy: Galaxy;
  soundEnabled: boolean;
  onReturnToSpace: () => void;
}

export default function Certificate({ galaxy, soundEnabled, onReturnToSpace }: CertificateProps) {
  const [explorerName, setExplorerName] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [certImgUrl, setCertImgUrl] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Render certificate onto a canvas and set state for img src
  useEffect(() => {
    const name = explorerName.trim() || 'COSMIC EXPLORER';

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient (Deep Space Sophisticated Black)
    const bgGrad = ctx.createRadialGradient(600, 400, 50, 600, 400, 800);
    bgGrad.addColorStop(0, '#0c0a09'); // rich warm near-black
    bgGrad.addColorStop(1, '#050508'); // dark cosmic space black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative Stars (Deterministic using trigonometry)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 70; i++) {
      const sx = (Math.sin(i * 1234.5) * 0.5 + 0.5) * 1200;
      const sy = (Math.cos(i * 5678.9) * 0.5 + 0.5) * 800;
      const size = (Math.sin(i * 999.9) * 0.5 + 0.5) * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer Luxury Gold Border
    const borderGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    borderGrad.addColorStop(0, '#c5a059'); // Gold
    borderGrad.addColorStop(0.5, '#e5c17e'); // Rich Gold highlight
    borderGrad.addColorStop(1, '#c5a059'); // Gold
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 1160, 760);

    // Inner Gold Fine Border
    ctx.strokeStyle = '#c5a05980';
    ctx.lineWidth = 2;
    ctx.strokeRect(38, 38, 1124, 724);

    // Corner Ornament Shapes
    ctx.fillStyle = '#c5a059';
    const corners = [
      { x: 38, y: 38 },
      { x: 1162, y: 38 },
      { x: 38, y: 762 },
      { x: 1162, y: 762 }
    ];
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Typography
    // 1. Astronomy Pathshala Header
    ctx.font = 'bold 20px "Courier New", Courier, monospace';
    ctx.fillStyle = '#c5a059';
    ctx.textAlign = 'center';
    ctx.fillText('ASTRONOMY PATHSHALA', 600, 110);

    // 2. Main Title (Elegant Serif)
    ctx.font = 'italic 50px Georgia, "Times New Roman", serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CERTIFICATE OF COSMIC DISCOVERY', 600, 195);

    // 3. Sub title description
    ctx.font = 'italic 16px "Arial", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('This certificate is proudly awarded to', 600, 265);

    // 4. Player Name
    ctx.font = 'italic bold 42px Georgia, "Times New Roman", serif';
    ctx.fillStyle = '#c5a059'; // Golden name
    ctx.fillText(name.toUpperCase(), 600, 345);

    // 5. Line spacer
    ctx.strokeStyle = '#c5a05940';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(400, 385);
    ctx.lineTo(800, 385);
    ctx.stroke();

    // 6. Detailed Body Narrative
    ctx.font = '16px "Arial", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    const text1 = `For successfully navigating deep space hazards and discovering the ${galaxy.name}.`;
    const text2 = 'Having successfully completed all educational research quizzes and core astronomic evaluations,';
    const text3 = 'they are hereby officially decorated with the title of Honorary Galaxy Explorer.';
    ctx.fillText(text1, 600, 435);
    ctx.fillText(text2, 600, 470);
    ctx.fillText(text3, 600, 505);

    // 7. Galaxy Seal / Medal graphic
    ctx.strokeStyle = '#c5a059';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#0c0a09';
    ctx.beginPath();
    ctx.arc(600, 615, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Star in seal
    ctx.fillStyle = '#c5a059';
    ctx.beginPath();
    ctx.arc(600, 615, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 11px "Arial", sans-serif';
    ctx.fillStyle = '#c5a059';
    ctx.fillText('OFFICIAL SEAL', 600, 685);

    // 8. Bottom Date & Authority signature
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.font = '13px "Courier New", monospace';
    ctx.fillStyle = '#a8a29e';
    ctx.fillText(`Date: ${dateStr}`, 250, 685);
    ctx.fillText('Director, Astronomy Pathshala', 950, 685);

    // Draw lines for date & signature
    ctx.strokeStyle = '#c5a05940';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(150, 660);
    ctx.lineTo(350, 660);
    ctx.moveTo(850, 660);
    ctx.lineTo(1050, 660);
    ctx.stroke();

    try {
      const dataUrl = canvas.toDataURL('image/png');
      setCertImgUrl(dataUrl);
    } catch (err) {
      console.error('Failed to pre-generate certificate image', err);
    }
  }, [explorerName, galaxy]);

  // Trigger direct download
  const handleDownload = () => {
    if (!certImgUrl) return;
    setDownloading(true);
    audioEngine.playSound('powerup', soundEnabled);

    try {
      const link = document.createElement('a');
      link.download = `AP_Galaxy_Explorer_Certificate_${galaxy.id}.png`;
      link.href = certImgUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to download PNG certificate', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-y-auto p-4 md:p-6 select-none font-sans">
      <div 
        id="certificate-container"
        className="w-full max-w-3xl rounded-sm border border-white/10 bg-[#050508]/95 text-slate-100 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-y-auto max-h-[95vh] glow-gold"
      >
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-yellow-600 to-gold"
        ></div>

        {/* TOP CONFIGURATION BOX (User name input) */}
        <div className="p-4 rounded-sm border border-white/10 bg-black/40 space-y-3">
          <div className="flex items-center gap-2 text-gold font-bold text-xs md:text-sm font-mono uppercase tracking-wider">
            <Sparkles size={16} className="animate-pulse" />
            <span>Claim Your Celestial Honor</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Congratulations on mastering the {galaxy.name}! Enter your full name below to personalize your official certificate of discovery and download it.
          </p>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <User size={14} />
            </div>
            <input
              id="explorer-name-input"
              type="text"
              placeholder="Enter your full name..."
              value={explorerName}
              onChange={(e) => setExplorerName(e.target.value)}
              maxLength={40}
              className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-white/10 bg-black/60 text-white placeholder-slate-500 text-xs tracking-wider uppercase focus:outline-none focus:border-gold transition-colors font-mono"
            />
          </div>
        </div>

        {/* CERTIFICATE PREVIEW CARD (Aesthetic, premium design) */}
        <div 
          ref={previewRef}
          className="relative aspect-[3/2] w-full rounded-sm border-2 overflow-hidden shadow-inner text-center select-none bg-[#050508]"
          style={{
            borderColor: '#c5a059',
          }}
        >
          {certImgUrl ? (
            <img 
              src={certImgUrl} 
              alt="Certificate of Cosmic Discovery" 
              className="w-full h-full object-contain cursor-pointer"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Award size={32} className="animate-spin text-gold" />
              <span className="text-xs font-mono">Generating Certificate...</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-amber-500/90 font-mono mt-1 text-center bg-amber-500/5 border border-amber-500/20 p-2 rounded-sm">
          PRO-TIP: If direct download is blocked by your browser's sandbox/iframe security, you can right-click (or tap & hold on mobile) the certificate image above to save it directly!
        </p>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            id="return-space-btn"
            onClick={onReturnToSpace}
            className="w-full sm:w-auto px-5 py-2.5 rounded-sm border border-white/10 hover:border-gold hover:bg-gold/10 text-slate-300 hover:text-gold text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Exploration
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {downloadSuccess && (
              <span className="text-green-400 text-xs font-mono flex items-center gap-1 animate-pulse mb-1 sm:mb-0">
                <Check size={14} /> PNG Saved!
              </span>
            )}
            <button
              id="download-certificate-btn"
              onClick={handleDownload}
              disabled={downloading || !certImgUrl}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-gold hover:bg-gold-hover text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={14} />
              {downloading ? 'Compiling...' : 'Download PNG'}
            </button>

            {certImgUrl && (
              <a
                href={certImgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-sm border border-gold text-gold hover:bg-gold/10 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow transition-all text-center pointer-events-auto cursor-pointer"
                title="Open in new window for easy mobile save or printing"
              >
                <Sparkles size={14} /> Open in New Tab (Print/Save)
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

