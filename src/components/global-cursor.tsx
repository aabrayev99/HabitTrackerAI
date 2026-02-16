'use client';

import { useEffect, useRef } from 'react';

export function GlobalCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        // Trail particles pool
        const trailPool: HTMLDivElement[] = [];
        for (let i = 0; i < 10; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            document.body.appendChild(trail);
            trailPool.push(trail);
        }
        let trailIndex = 0;

        const moveCursor = (e: MouseEvent) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Trail effect
            const trail = trailPool[trailIndex % trailPool.length];
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.opacity = '0.6';
            setTimeout(() => { trail.style.opacity = '0'; }, 300);
            trailIndex++;
        };

        const addHover = () => cursor.classList.add('hovering');
        const removeHover = () => cursor.classList.remove('hovering');
        const addClick = () => {
            cursor.classList.add('clicking');
            setTimeout(() => cursor.classList.remove('clicking'), 300);
        };

        document.addEventListener('mousemove', moveCursor);
        document.addEventListener('mousedown', addClick);

        // Observe DOM for dynamically added clickables
        const attachHoverListeners = () => {
            const clickables = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label[for]');
            clickables.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
                el.addEventListener('mouseenter', addHover);
                el.addEventListener('mouseleave', removeHover);
            });
        };
        attachHoverListeners();
        const observer = new MutationObserver(attachHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousedown', addClick);
            observer.disconnect();
            trailPool.forEach(t => t.remove());
        };
    }, []);

    return <div ref={cursorRef} className="custom-cursor" style={{ zIndex: 9999 }} />;
}
