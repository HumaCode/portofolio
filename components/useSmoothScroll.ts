"use client";

import { useCallback } from "react";
import type { MouseEvent } from "react";
import { useLenis } from "lenis/react";

// Easing for a smooth, deliberate scroll transition on menu clicks.
export const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Returns helpers for smooth-scrolling with Lenis (with a native fallback
 * before the Lenis instance is ready on first render).
 */
export function useSmoothScroll() {
    const lenis = useLenis();

    const scrollToSection = useCallback(
        (e: MouseEvent<HTMLAnchorElement>, href: string) => {
            if (!href.startsWith("#")) return;

            e.preventDefault();

            if (lenis) {
                lenis.scrollTo(href, { duration: 1.2, easing: easeInOutCubic });
            } else {
                document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
            }
        },
        [lenis]
    );

    const scrollToTop = useCallback(() => {
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.2, easing: easeInOutCubic });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [lenis]);

    return { scrollToSection, scrollToTop };
}
