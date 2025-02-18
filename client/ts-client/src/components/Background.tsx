import React from 'react';
import styles from './Background.module.css';

interface BackgroundProps {
    children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
    return <div className={styles.background}>{children}</div>;
};

export default Background;
