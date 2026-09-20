"use client";

import { useCallback } from "react";
import type { MouseEvent } from "react";
import { useLenis } from "lenis/react";

// Smooth custom cubic-bezier easing curve for luxury scrolling feel
export const smoothEasing = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Helper hook for ultra-smooth menu scroll transitions leveraging Lenis.
 */
export function useSmoothScroll() {
    const lenis = useLenis();

    const scrollToSection = useCallback(
        (e: MouseEvent<HTMLAnchorElement>, href: string) => {
            if (!href.startsWith("#")) return;

            e.preventDefault();

            if (lenis) {
                lenis.scrollTo(href, {
                    duration: 1.2,
                    easing: smoothEasing,
                    offset: 98,
                });
            } else {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                }
            }
        },
        [lenis]
    );

    const scrollToTop = useCallback(() => {
        if (lenis) {
            lenis.scrollTo(90, {
                duration: 1.4,
                easing: smoothEasing,
            });
        } else {
            window.scrollTo({ top: 90, behavior: "smooth" });
        }
    }, [lenis]);

    return { scrollToSection, scrollToTop };
}

