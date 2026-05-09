import { useState, useEffect } from 'react';

interface JoystickProps {
  direction: { x: number; y: number };
}

export function Joystick({ direction }: JoystickProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (direction.x !== 0 || direction.y !== 0) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  const stickX = direction.x * 40;
  const stickY = direction.y * 40;

  return (
    <div className="joystick-overlay" style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: '40%',
      height: '100%',
      pointerEvents: 'none',
    }}>
      <div
        className="joystick-base"
        style={{
          position: 'absolute',
          left: 50,
          bottom: 80,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(0, 240, 255, 0.15)',
          border: '2px solid rgba(0, 240, 255, 0.4)',
          opacity: visible ? 0.7 : 0.3,
          transition: 'opacity 0.2s',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(0, 240, 255, 0.3) 100%)',
            transform: `translate(-50%, -50%) translate(${stickX}px, ${stickY}px)`,
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.8)',
            transition: 'transform 0.05s',
          }}
        />
      </div>
    </div>
  );
}
