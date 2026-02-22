import { useState, useEffect, useRef } from 'react';
import './DemoVideo.css';

function DemoVideo({ isOpen, onClose, inline = false }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [workerPos, setWorkerPos] = useState({ x: 50, y: 280 });
  const [showPath, setShowPath] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('2d');
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);
  const totalDuration = 15;

  useEffect(() => {
    if ((!inline && !isOpen) || !isPlaying) return;

    const startTime = Date.now() - (currentTime * 1000);
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (elapsed >= totalDuration) {
        setCurrentTime(0);
        setIsPlaying(false);
        return;
      }

      setCurrentTime(elapsed);

      // Phase 1: Search animation (0-2.5s)
      if (elapsed < 2.5) {
        const searchProgress = elapsed / 2.5;
        const fullText = 'Sony Headphones';
        setSearchText(fullText.substring(0, Math.floor(searchProgress * fullText.length)));
        setShowProduct(searchProgress > 0.6);
        setViewMode('2d');
        setShowPath(false);
        setWorkerPos({ x: 50, y: 280 });
      }
      // Phase 2: Path appears (2.5-4s)
      else if (elapsed < 4) {
        setSearchText('Sony Headphones');
        setShowProduct(true);
        setShowPath(true);
        setViewMode('2d');
      }
      // Phase 3: Worker walks to product (4-9s)
      else if (elapsed < 9) {
        const walkProgress = (elapsed - 4) / 5;
        const path = [
          { x: 50, y: 280 },
          { x: 200, y: 280 },
          { x: 200, y: 150 },
          { x: 350, y: 150 },
        ];
        
        const totalSegments = path.length - 1;
        const currentSegment = Math.min(Math.floor(walkProgress * totalSegments), totalSegments - 1);
        const segmentProgress = (walkProgress * totalSegments) % 1;
        
        const start = path[currentSegment];
        const end = path[Math.min(currentSegment + 1, path.length - 1)];
        
        setWorkerPos({
          x: start.x + (end.x - start.x) * segmentProgress,
          y: start.y + (end.y - start.y) * segmentProgress,
        });
        setViewMode('2d');
      }
      // Phase 4: Switch to 3D view (9-12s)
      else if (elapsed < 12) {
        setViewMode('3d');
        setRotation((elapsed - 9) * 60);
      }
      // Phase 5: Show stats (12-15s)
      else {
        setViewMode('stats');
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [inline, isOpen, isPlaying, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    setCurrentTime(progress * totalDuration);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setWorkerPos({ x: 50, y: 280 });
    setShowPath(false);
    setShowProduct(false);
    setSearchText('');
    setViewMode('2d');
    setRotation(0);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    handleRestart();
    onClose?.();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!inline && !isOpen) return null;

  const progress = (currentTime / totalDuration) * 100;

  const racks = [
    { id: 'A-1', x: 100, y: 80, color: '#3B82F6' },
    { id: 'A-2', x: 180, y: 80, color: '#3B82F6' },
    { id: 'A-3', x: 260, y: 80, color: '#3B82F6' },
    { id: 'A-4', x: 340, y: 80, color: '#3B82F6', highlight: showProduct },
    { id: 'B-1', x: 100, y: 160, color: '#10B981' },
    { id: 'B-2', x: 180, y: 160, color: '#10B981' },
    { id: 'B-3', x: 260, y: 160, color: '#10B981' },
    { id: 'B-4', x: 340, y: 160, color: '#10B981' },
    { id: 'C-1', x: 100, y: 240, color: '#F59E0B' },
    { id: 'C-2', x: 180, y: 240, color: '#F59E0B' },
    { id: 'C-3', x: 260, y: 240, color: '#F59E0B' },
    { id: 'C-4', x: 340, y: 240, color: '#F59E0B' },
  ];

  const videoContent = (
    <>
      <div className="video-search-bar">
        <span className="search-icon">🔍</span>
        <span className="search-input">{searchText}<span className="cursor">|</span></span>
      </div>

      {viewMode === '2d' && (
        <svg viewBox="0 0 450 350" className="warehouse-svg">
          <rect x="0" y="0" width="450" height="350" fill="#1F2937" />
          
          {[...Array(10)].map((_, i) => (
            <g key={i}>
              <line x1={i * 50} y1="0" x2={i * 50} y2="350" stroke="#374151" strokeWidth="0.5" />
              <line x1="0" y1={i * 35} x2="450" y2={i * 35} stroke="#374151" strokeWidth="0.5" />
            </g>
          ))}

          <rect x="20" y="260" width="40" height="60" fill="#4B5563" rx="4" />
          <text x="40" y="295" textAnchor="middle" fill="#9CA3AF" fontSize="8">Entry</text>

          {racks.map(rack => (
            <g key={rack.id}>
              <rect 
                x={rack.x} 
                y={rack.y} 
                width="60" 
                height="40" 
                fill={rack.highlight ? '#EF4444' : rack.color}
                rx="4"
                className={rack.highlight ? 'rack-pulse' : ''}
              />
              <text x={rack.x + 30} y={rack.y + 25} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                {rack.id}
              </text>
              {rack.highlight && (
                <>
                  <circle cx={rack.x + 30} cy={rack.y + 20} r="25" fill="none" stroke="#EF4444" strokeWidth="2" className="pulse-ring" />
                  <text x={rack.x + 30} y={rack.y - 10} textAnchor="middle" fill="#EF4444" fontSize="10">📍 Sony Headphones</text>
                </>
              )}
            </g>
          ))}

          {showPath && (
            <path 
              d="M 50 280 L 200 280 L 200 150 L 350 150 L 350 100"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="4"
              strokeDasharray="10 5"
              className="animated-path-line"
            />
          )}

          <g className="worker-marker" transform={`translate(${workerPos.x}, ${workerPos.y})`}>
            <circle r="15" fill="#10B981" />
            <text y="5" textAnchor="middle" fontSize="16">👷</text>
          </g>

          {showPath && (
            <g>
              <rect x="380" y="250" width="60" height="50" fill="#374151" rx="6" />
              <text x="410" y="270" textAnchor="middle" fill="#60A5FA" fontSize="10">📏 45m</text>
              <text x="410" y="290" textAnchor="middle" fill="#10B981" fontSize="10">⏱️ 35s</text>
            </g>
          )}

          {showPath && currentTime > 8 && (
            <g className="nav-instruction">
              <rect x="10" y="10" width="150" height="60" fill="rgba(0,0,0,0.8)" rx="8" />
              <text x="20" y="30" fill="#10B981" fontSize="10">✓ Walk straight 15m</text>
              <text x="20" y="45" fill="#60A5FA" fontSize="10">→ Turn right at B-1</text>
              <text x="20" y="60" fill="#9CA3AF" fontSize="10">○ Continue to A-4</text>
            </g>
          )}
        </svg>
      )}

      {viewMode === '3d' && (
        <div className="video-3d-view" style={{ transform: `rotateY(${rotation}deg)` }}>
          <div className="floor-3d"></div>
          <div className="racks-3d">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`rack-3d ${i === 3 ? 'highlighted' : ''}`}
                style={{ left: `${(i % 4) * 80 + 40}px`, top: `${Math.floor(i / 4) * 60 + 20}px` }}
              >
                <div className="shelf"></div>
                <div className="shelf"></div>
                <div className="shelf"></div>
              </div>
            ))}
          </div>
          <div className="worker-3d">👷</div>
          <div className="camera-label">🎥 3D View - Rotating</div>
        </div>
      )}

      {viewMode === 'stats' && (
        <div className="video-stats-view">
          <h2>📊 Results Summary</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">⏱️</div>
              <div className="stat-number">42%</div>
              <div className="stat-label">Time Saved</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">💰</div>
              <div className="stat-number">$540K</div>
              <div className="stat-label">Annual Savings</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📦</div>
              <div className="stat-number">+35%</div>
              <div className="stat-label">More Orders</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-number">99.2%</div>
              <div className="stat-label">Accuracy</div>
            </div>
          </div>
          <div className="cta-area">
            <button className="video-cta" onClick={inline ? handleRestart : onClose}>🚀 Try WareTrack Now</button>
          </div>
        </div>
      )}

      <div className="phase-indicator">
        {currentTime < 2.5 && '🔍 Searching for product...'}
        {currentTime >= 2.5 && currentTime < 4 && '📍 Product found! Calculating route...'}
        {currentTime >= 4 && currentTime < 9 && '🚶 Following navigation to product...'}
        {currentTime >= 9 && currentTime < 12 && '🎮 Exploring 3D view...'}
        {currentTime >= 12 && '📈 See your potential savings!'}
      </div>
    </>
  );

  if (inline) {
    return (
      <div className="demo-section">
        <div className="demo-header">
          <span className="demo-title">📹 Interactive Demo</span>
          <span className="demo-duration">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
        </div>

        <div className="demo-content">
          {videoContent}
        </div>

        <div className="demo-controls">
          <button className="control-btn" onClick={handleRestart}>⏮️</button>
          <button className="control-btn play-btn" onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
            </div>
            <div className="phase-markers">
              <div className="marker" style={{ left: '0%' }} title="Search"></div>
              <div className="marker" style={{ left: '17%' }} title="Find Path"></div>
              <div className="marker" style={{ left: '27%' }} title="Navigate"></div>
              <div className="marker" style={{ left: '60%' }} title="3D View"></div>
              <div className="marker" style={{ left: '80%' }} title="Results"></div>
            </div>
          </div>
          <span className="time-display">{formatTime(currentTime)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="demo-overlay" onClick={onClose}>
      <div className="demo-modal video-modal" onClick={e => e.stopPropagation()}>
        <button className="demo-close" onClick={onClose}>✕</button>
        
        <div className="video-header">
          <span className="video-title">📹 WareTrack Demo</span>
          <span className="video-duration">{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
        </div>

        <div className="video-content">
          {videoContent}
        </div>

        <div className="video-controls">
          <button className="control-btn" onClick={handleRestart}>⏮️</button>
          <button className="control-btn play-btn" onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
            </div>
            <div className="phase-markers">
              <div className="marker" style={{ left: '0%' }} title="Search"></div>
              <div className="marker" style={{ left: '17%' }} title="Find Path"></div>
              <div className="marker" style={{ left: '27%' }} title="Navigate"></div>
              <div className="marker" style={{ left: '60%' }} title="3D View"></div>
              <div className="marker" style={{ left: '80%' }} title="Results"></div>
            </div>
          </div>
          <span className="time-display">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
}

export default DemoVideo;
