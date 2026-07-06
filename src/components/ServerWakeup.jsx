import { useEffect, useState } from 'react';
import { checkHealth } from '../api';

const SLOW_THRESHOLD_MS = 2000;
const MAX_WAIT_MS = 90000;
const RETRY_INTERVAL_MS = 3000;

export default function ServerWakeup() {
  const [visible, setVisible] = useState(false);
  const [dots, setDots] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let done = false;
    let dotInterval;

    const slowTimer = setTimeout(() => {
      if (!done) {
        setVisible(true);
        dotInterval = setInterval(() => {
          setDots(d => d.length >= 3 ? '' : d + '.');
        }, 500);
      }
    }, SLOW_THRESHOLD_MS);

    const tryWake = async () => {
      const deadline = Date.now() + MAX_WAIT_MS;
      while (Date.now() < deadline) {
        try {
          await checkHealth();
          done = true;
          clearTimeout(slowTimer);
          clearInterval(dotInterval);
          setDots('');
          setReady(true);
          setTimeout(() => setVisible(false), 2000);
          return;
        } catch {
          await new Promise(r => setTimeout(r, RETRY_INTERVAL_MS));
        }
      }
      // 타임아웃 시에도 배너 숨김 (무한 표시 방지)
      clearInterval(dotInterval);
      setVisible(false);
    };

    tryWake();

    return () => {
      done = true;
      clearTimeout(slowTimer);
      clearInterval(dotInterval);
    };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 9999,
      background: ready ? '#22c55e' : '#534AB7',
      color: '#fff',
      fontSize: '14px',
      textAlign: 'center',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background 0.3s ease',
    }}>
      <span style={{ fontSize: '16px' }}>{ready ? '✅' : '☕'}</span>
      <span>{ready ? '서버가 준비됐어요! 이제 이용하실 수 있어요.' : `서버를 깨우는 중이에요${dots}  잠시만 기다려 주세요 (최대 1분)`}</span>
    </div>
  );
}