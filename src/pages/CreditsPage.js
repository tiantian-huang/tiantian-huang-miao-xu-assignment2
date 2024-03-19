import React from 'react';
import './CreditsPage.css';

const CreditsPage = () => {
    return (
        <div className="credits-container">
            <h1 className="credits-title">Credits</h1>
            <p className="credits-description">This project was developed by Tiantian Huang and Miao Xu.</p>
            <a href="https://github.com/tiantian-huang/tiantian-huang-miao-xu-assignment2/tree/main" className="github-link">GitHub Repository</a>
        </div>
    );
}

export default CreditsPage;
