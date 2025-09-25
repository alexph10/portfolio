'use client';

import React from 'react';
import styles from './footer.module.css';
import TerrainMap from '../terrain-map/terrain-map';
import AsciiEye from '../ascii-eye/ascii-eye';

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div className="absolute inset-4 border border-[#FF4500] pointer-events-none"></div>
            <div className="absolute inset-28 overflow-hidden">
                <TerrainMap />
            </div>
            <div className="absolute inset-39 overflow-hidden">
                <AsciiEye />
            </div>
        </div>
    );
}