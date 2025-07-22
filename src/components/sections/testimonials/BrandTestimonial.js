import React, { useEffect, useRef, useState } from 'react';

const LineChart = ({ data, className = '' }) => {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    
    // Set canvas size
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Chart dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Data processing
    const maxROI = Math.max(...data.map(d => d.roi));
    const minROI = Math.min(...data.map(d => d.roi));
    const roiRange = maxROI - minROI;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length - 1; i++) {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Draw ROI line with animation
    let animationProgress = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Redraw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      for (let i = 0; i <= data.length - 1; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
      }

      // Draw line
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const visiblePoints = Math.floor(data.length * animationProgress);
      
      if (visiblePoints > 1) {
        ctx.beginPath();
        
        for (let i = 0; i < visiblePoints; i++) {
          const x = padding + (chartWidth / (data.length - 1)) * i;
          const normalizedROI = (data[i].roi - minROI) / roiRange;
          const y = height - padding - (normalizedROI * chartHeight);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#8B5CF6';
        for (let i = 0; i < visiblePoints; i++) {
          const x = padding + (chartWidth / (data.length - 1)) * i;
          const normalizedROI = (data[i].roi - minROI) / roiRange;
          const y = height - padding - (normalizedROI * chartHeight);
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Y-axis labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'right';
      
      for (let i = 0; i <= 5; i++) {
        const value = minROI + (roiRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(`${Math.round(value)}%`, padding - 10, y + 4);
      }

      // Draw X-axis labels
      ctx.textAlign = 'center';
      for (let i = 0; i < data.length; i++) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        ctx.fillText(`Week ${data[i].week}`, x, height - 10);
      }

      if (animationProgress < 1) {
        animationProgress += 0.02;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, data]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '300px' }}
    />
  );
};

const BrandTestimonial = ({ brand }) => {
  if (!brand) return null;

  return (
    <section className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Quote */}
          <div className="relative mb-12 lg:mb-0">
            {/* Large quotation mark background */}
            <div className="absolute -top-8 -left-4 text-8xl text-purple-500/20 font-serif">
              "
            </div>
            
            <div className="relative z-10">
              <blockquote className="text-xl md:text-2xl leading-relaxed text-gray-800 dark:text-white mb-8">
                {brand.quote}
              </blockquote>

              <div className="flex items-center gap-4">
                <img
                  src={brand.logo}
                  alt={brand.brand_name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{brand.contact_person}</p>
                  <p className="text-purple-600 dark:text-purple-300">{brand.designation}</p>
                  <p className="text-gray-600 dark:text-white/70">{brand.brand_name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Chart and Stats */}
          <div className="bg-gray-100 dark:bg-dark-card rounded-3xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Campaign ROI</h3>
            
            {/* Chart Container */}
            <div className="mb-6 bg-white dark:bg-gray-700 rounded-2xl p-4">
              <LineChart data={brand.roi_history} />
            </div>

            {/* Stats Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  +{brand.campaign_details.roi_percentage}%
                </p>
                <p className="text-sm text-green-300">ROI</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">
                  26 days
                </p>
                <p className="text-sm text-blue-300">to breakeven</p>
              </div>
            </div>

            {/* Additional Campaign Details */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/70">Total Reach</p>
                  <p className="text-white font-semibold">{brand.campaign_details.total_reach}</p>
                </div>
                <div>
                  <p className="text-white/70">Creators</p>
                  <p className="text-white font-semibold">{brand.campaign_details.creators_engaged}</p>
                </div>
                <div>
                  <p className="text-white/70">Engagement</p>
                  <p className="text-white font-semibold">{brand.campaign_details.engagement_rate}</p>
                </div>
                <div>
                  <p className="text-white/70">Conversion</p>
                  <p className="text-white font-semibold">{brand.campaign_details.conversion_rate}</p>
                </div>
              </div>
            </div>

            {/* Revenue Details */}
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-sm">Total Spend</p>
                <p className="text-xl font-bold text-white">{brand.campaign_details.total_spend}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm">Revenue Generated</p>
                <p className="text-xl font-bold text-green-400">{brand.campaign_details.revenue_generated}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandTestimonial;
