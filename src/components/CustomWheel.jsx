import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

const CustomWheel = forwardRef(({ 
    items = [], 
    onSpinComplete, 
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'],
    onSpinStart
}, ref) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [rotation, setRotation] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
    const [currentWeapon, setCurrentWeapon] = useState('');
    
    // Animation state stored in refs to avoid React re-renders
    const animationState = useRef({
        startRotation: 0,
        currentRotation: 0,
        targetRotation: 0,
        startTime: 0,
        duration: 0,
        isRunning: false
    });
    
    // Cache for the static wheel image
    const wheelImageRef = useRef(null);
    const wheelImageDirty = useRef(true);
    
    
    // Store onSpinComplete in ref to avoid dependency issues
    const onSpinCompleteRef = useRef(onSpinComplete);
    onSpinCompleteRef.current = onSpinComplete;

    // Calculate item angles
    const getItemAngle = useCallback(() => {
        return 360 / items.length;
    }, [items.length]);

    // Calculate current weapon based on rotation
    const calculateCurrentWeapon = useCallback((wheelRotation) => {
        if (!items.length) return '';
        
        // Convert rotation to angle (0 to 2π)
        const angle = (wheelRotation * Math.PI / 180) % (2 * Math.PI);
        // Make angle positive
        const positiveAngle = angle < 0 ? angle + 2 * Math.PI : angle;
        
        // Calculate which segment the arrow points to
        // Arrow points to the top (0 degrees), so we need to find which segment is at the top
        const segmentAngle = 2 * Math.PI / items.length;
        
        // The segment at the top is the one that contains the angle 0 (or 2π)
        // We need to find which segment index corresponds to the current rotation
        const currentIndex = Math.floor((2 * Math.PI - positiveAngle) / segmentAngle) % items.length;
        
        return items[currentIndex] || '';
    }, [items]);

    // Draw the static wheel image (without rotation)
    const drawStaticWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !items.length) return;

        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Cache frequently used values
        const itemAngle = getItemAngle();
        
        // Pre-calculate colors to avoid repeated modulo operations
        const colorCache = items.map((_, index) => colors[index % colors.length]);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw wheel segments (static, no rotation)
        const itemAngleRad = itemAngle * (Math.PI / 180);
        const baseAngle = -90 * (Math.PI / 180);
        
        items.forEach((item, index) => {
            const startAngle = index * itemAngleRad + baseAngle;
            const endAngle = (index + 1) * itemAngleRad + baseAngle;
            
            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Add subtle shadow for the segment
            ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1.5;
            ctx.shadowOffsetY = 1.5;
            
            // Create gradient for the segment
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            const baseColor = colorCache[index];
            
            // Convert hex to RGB for gradient
            const hex = baseColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            // Create gradient from lighter center to darker edge
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
            gradient.addColorStop(0.7, baseColor);
            gradient.addColorStop(1, `rgba(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)}, 0.8)`);
            
            // Fill with gradient
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Draw border (only if there are multiple sections)
            if (items.length > 1) {
                ctx.strokeStyle = '#2d2d2d';
                ctx.lineWidth = 0.4;
                ctx.stroke();
            }
            
            // Draw text
            const textAngle = startAngle + itemAngleRad / 2;
            const textRadius = radius * 0.69;
            const textX = centerX + Math.cos(textAngle) * textRadius;
            const textY = centerY + Math.sin(textAngle) * textRadius;
            
            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(textAngle);
            
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 13px Inter, sans-serif';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Truncate long text
            const maxLength = 12;
            ctx.fillText(item, 0, 0);
            ctx.restore();
        });
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = '#2d2d2d';
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Create image from the static wheel (without pointer)
        wheelImageRef.current = new Image();
        wheelImageRef.current.src = canvas.toDataURL();
        wheelImageDirty.current = false;
    }, [items, colors, getItemAngle]);


    // Draw the wheel using cached image (no rotation - handled by CSS)
    const drawWheel = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !items.length) return;

        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (wheelImageRef.current && !wheelImageDirty.current) {
            // Draw the cached wheel image (rotation handled by CSS)
            ctx.drawImage(wheelImageRef.current, 0, 0);
        } else {
            // Fallback to drawing static wheel if no cached image
            drawStaticWheel();
        }
    }, [items, drawStaticWheel]);

    // Update cached wheel image when items change
    const updateWheelImage = useCallback(() => {
        wheelImageDirty.current = true;
        drawStaticWheel();
    }, [drawStaticWheel]);

    // Simple animation loop
    const animate = useCallback(() => {
        if (!animationState.current.isRunning) {
            return;
        }
        
        const now = Date.now();
        const elapsed = now - animationState.current.startTime;
        const progress = Math.min(elapsed / animationState.current.duration, 1);
        
        
        // Simple easing function: f(0) = 0, f(1) = targetRotation
        // Low derivative at beginning and end for smooth start/stop
        const easeInOut = (t) => {
            // Extra smooth S-curve with very gradual end (2x smoother)
            return -t * t * t * t * (t * (t * (t * 20 - 70) + 84) - 35); // Higher-order smoothstep
        };
        
        // Calculate current rotation directly
        const startRotation = animationState.current.startRotation;
        const targetRotation = animationState.current.targetRotation;
        const rotationDelta = targetRotation - startRotation;
        const currentRotation = startRotation + rotationDelta * easeInOut(progress);

        animationState.current.currentRotation = currentRotation;
        
        // Update current weapon
        const weapon = calculateCurrentWeapon(currentRotation);
        setCurrentWeapon(weapon);
        
        // Update CSS transform directly without causing re-render
        if (canvasRef.current && canvasRef.current.parentElement) {
            canvasRef.current.parentElement.style.transform = `rotate(${currentRotation}deg)`;
        }
        
        if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            // Animation finished - stop the loop first
            animationState.current.isRunning = false;
            animationState.current.currentRotation = targetRotation;
            
            // Set final rotation state
            setRotation(targetRotation);
            
            
            // Calculate winner first
            const itemAngle = getItemAngle();
            const normalizedRotation = targetRotation % 360;
            const winningIndex = Math.floor((360 - normalizedRotation) / itemAngle) % items.length;
            
            // Set final rotation and states immediately
            setRotation(targetRotation);
            setCurrentIndex(winningIndex);
            setIsAnimating(false);
            
            // Reset rotation to 0 after a short delay to show the final position
            setTimeout(() => {
                setRotation(0);
            }, 100);
            
            // Update final weapon
            const finalWeapon = calculateCurrentWeapon(targetRotation);
            setCurrentWeapon(finalWeapon);
            
            
            // Call onSpinComplete immediately with setTimeout to break out of animation frame
            setTimeout(() => {
                if (onSpinCompleteRef.current && items[winningIndex]) {
                    onSpinCompleteRef.current(winningIndex, items[winningIndex]);
                }
            }, 0);
        }
    }, [drawWheel, getItemAngle, items]);

    // Start animation when isAnimating changes
    useEffect(() => {
        if (isAnimating) {
            // Initialize animation state only if not already running
            if (!animationState.current.isRunning) {
                animationState.current.startTime = Date.now();
                animationState.current.duration = 15000; // 5 seconds
                animationState.current.startRotation = rotation;
                animationState.current.currentRotation = rotation;
                
                // Calculate target rotation only once
                animationState.current.targetRotation = rotation + 1440 + (Math.random() * 720); // 4 full spins + random
                
                animationState.current.isRunning = true;
            }
            
            // Start animation loop
            animationRef.current = requestAnimationFrame(animate);
        } else if (!isAnimating && animationRef.current && !animationState.current.isRunning) {
            animationState.current.isRunning = false;
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        
        return () => {
            if (animationRef.current) {
                animationState.current.isRunning = false;
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isAnimating, animate]);

    // Reset hasStartedSpinning when animation completes
    useEffect(() => {
        if (!isAnimating && hasStartedSpinning) {
            setHasStartedSpinning(false);
        }
    }, [isAnimating, hasStartedSpinning]);

    // Start spinning
    const startSpin = useCallback(() => {
        if (isAnimating || !items.length) {
            return;
        }
        
        setIsAnimating(true);
        setHasStartedSpinning(true);
        if (onSpinStart) onSpinStart();
    }, [isAnimating, items, onSpinStart]);

    // Handle canvas resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (!container) return;
            
            // Get container dimensions
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            
            // Calculate size - use 90% of the smaller dimension, but at least 600px
            const size = Math.max(700, Math.min(containerWidth, containerHeight) * 0.9);
            
            
            // Set both canvas dimensions and CSS size
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            
            drawWheel();
        };
        
        // Initial resize
        resizeCanvas();
        
        // Also resize after a short delay to ensure container is ready
        const timeoutId = setTimeout(resizeCanvas, 100);
        
        window.addEventListener('resize', resizeCanvas);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [drawWheel]);

    // Note: Animation is now controlled directly via ref, not through isSpinning prop

    // Update cached wheel image when items change
    useEffect(() => {
        updateWheelImage();
    }, [items, colors, updateWheelImage]);

    // Redraw when items or rotation changes (throttled)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            drawWheel();
        }, 16); // Throttle to ~60fps
        
        return () => clearTimeout(timeoutId);
    }, [drawWheel]);

    // Force resize when items change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (!container) return;
            
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const size = Math.max(700, Math.min(containerWidth, containerHeight) * 0.9);
            
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = size + 'px';
            canvas.style.height = size + 'px';
            drawWheel();
        };
        
        // Resize after items change
        setTimeout(resizeCanvas, 50);
    }, [items, drawWheel]);

    // Expose startSpin method to parent component
    useImperativeHandle(ref, () => ({
        startSpin
    }));

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Current weapon display */}
            {isAnimating && currentWeapon && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-20">
                    <div className="bg-black/80 backdrop-blur-sm border border-gold-500 rounded-lg px-4 py-2">
                        <span className="text-gold-400 font-bold text-lg">
                            {currentWeapon}
                        </span>
                    </div>
                </div>
            )}
            
            {/* Wheel container with CSS rotation */}
            <div 
                className="relative flex items-center justify-center"
                style={{
                    width: '700px',
                    height: '700px',
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: animationState.current.isRunning ? 'none' : 'transform 0.1s ease-out',
                    willChange: 'transform'
                }}
            >
                <canvas
                    ref={canvasRef}
                    className="drop-shadow-lg"
                    style={{ 
                        width: '700px', 
                        height: '700px',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'block'
                    }}
                />
            </div>
            
            {/* Static arrow pointer with gradient and shadow */}
            <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                style={{
                    marginTop: '-350px', // Position on the edge of the wheel
                    transform: 'translateX(-50%) translateY(-50%)', // Override the class transform
                }}
            >
                {/* SVG arrow with copper gradient */}
                <svg
                    width="36"
                    height="42"
                    viewBox="0 0 36 42"
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(180deg)',
                        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                    }}
                >
                    <defs>
                        <linearGradient id="copperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#D4A017" />
                            <stop offset="30%" stopColor="#B8860B" />
                            <stop offset="70%" stopColor="#9A7209" />
                            <stop offset="100%" stopColor="#7A5A07" />
                        </linearGradient>
                    </defs>
                    <polygon
                        points="18,0 0,42 36,42"
                        fill="url(#copperGradient)"
                        stroke="#6B4C00"
                        strokeWidth="1.5"
                    />
                </svg>
            </div>
        </div>
    );
});

export default CustomWheel;
