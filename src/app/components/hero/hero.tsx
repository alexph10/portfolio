'use client';

import React from 'react';
import styles from './hero.module.css';
import RightPanel from './sidepanel/right-panel';
import BottomPanel from './bottompanel/bottom-panel';
import AsciiDonut from "./ascii-donut";

export default function Hero() {
    return (
        <div className={styles.hero}>
            <div className="absolute inset-4 border border-[#FF4500] pointer-events-none"></div>
            <AsciiDonut />
            <BottomPanel />
            <RightPanel />
        </div>
    );
}