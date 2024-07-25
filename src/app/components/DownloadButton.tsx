import React from 'react';
import styles from './DownloadButton.module.css';

interface DownloadButtonProps {
    image: string
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ image }) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'processed_image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={styles.stack}>
            <h1>Preview:</h1>
            <img src={image} alt="Processed preview" className={styles.preview} />
            <button className={styles.download} onClick={handleDownload}>Download Processed Image</button>
        </div>
    );
};

export default DownloadButton;
