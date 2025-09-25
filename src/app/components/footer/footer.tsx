'use client';

import React from 'react';
import styles from './footer.module.css';
import EyeScene from '../3d-eye/3d-eye';

export default function Footer() {
    return (
        <div className={styles.footer}>
            <div className="absolute inset-4 border border-[#FF4500] pointer-events-none"></div>
            <EyeScene />
        </div>
    );
}