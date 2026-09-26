"use client";

import { useCallback } from "react";
import type { MouseEvent } from "react";
import { useLenis } from "lenis/react";

// Kurva Easing: Dimulai sangat lambat (slow start), meluncur cepat di tengah, lalu melambat secara halus di akhir (Ease In-Out Quintic)
export const customEasing = (t: number): number =>
    t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;

// Smooth Scroll Animate Fallback (100% terjamin bekerja dengan efek lambat-cepat-lambat)
function animateScrollTo(targetY: number, duration = 1200) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    function step(currentTime: number) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = customEasing(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

export function useSmoothScroll() {
    const lenis = useLenis();

    const scrollToSection = useCallback(
        (e: MouseEvent<HTMLAnchorElement | HTMLElement>, href: string, customOffset = -60) => {
            if (!href.startsWith("#")) return;

            e.preventDefault();

            // Khusus seksi home, scroll ke paling atas (top: 0)
            if (href === "#home") {
                if (lenis) {
                    lenis.scrollTo(0, {
                        duration: 1.6,
                        easing: customEasing,
                    });
                } else {
                    animateScrollTo(0, 1200);
                }
                return;
            }

            const targetElement = document.querySelector(href) as HTMLElement | null;
            if (!targetElement) return;

            // Target persis di garis atas section
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

            if (lenis) {
                lenis.scrollTo(targetPosition, {
                    duration: 1.6,
                    easing: customEasing,
                });
            } else {
                animateScrollTo(targetPosition, 1200);
            }
        },
        [lenis]
    );

    const scrollToTop = useCallback(() => {
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.6,
                easing: customEasing,
            });
        } else {
            animateScrollTo(0, 1200);
        }
    }, [lenis]);

    return { scrollToSection, scrollToTop };
}

