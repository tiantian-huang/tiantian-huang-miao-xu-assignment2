// CreditsPage.js
import React from 'react';
import './CreditsPage.css'; // Make sure to create a CreditsPage.css file with your desired styles

const CreditsPage = () => {
    return (
        <div className="credits-container">
            <h1 className="credits-title">Credits</h1>
            <p className="credits-description">This project was developed by Tiantian Huang and Miao Xu.</p>
            <a href="https://github.com/yourusername" className="github-link">GitHub Repository</a>
        </div>
    );
}

export default CreditsPage;
