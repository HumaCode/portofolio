"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export const LenisProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ReactLenis
            root
            options={{
                // "Buttery" feel for wheel/trackpad scrolling (default is 0.1).
                lerp: 0.1,
                smoothWheel: true,
            }}
        >
            {children}
        </ReactLenis>
    );
};
