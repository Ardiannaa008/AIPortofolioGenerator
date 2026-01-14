// GitHub API Configuration
const GITHUB_API_BASE = 'https://api.github.com';
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    'Go': '#00ADD8',
    'Rust': '#ce422b',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'React': '#61dafb',
    'Vue': '#4FC08D',
    'Angular': '#DD0031',
    'Node.js': '#68a063',
};

let currentPortfolioData = null;
let currentTheme = 'minimal';

// DOM Elements
const landingPage = document.getElementById('landingPage');
const portfolioPage = document.getElementById('portfolioPage');
const githubUsernameInput = document.getElementById('githubUsername');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const previewBtn = document.getElementById('previewBtn');
const exportBtn = document.getElementById('exportBtn');
const shareBtn = document.getElementById('shareBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorMessage = document.getElementById('errorMessage');
const themeSelect = document.getElementById('themeSelect');
const sectionToggles = document.querySelectorAll('.section-toggle');
const templateRadios = document.querySelectorAll('input[name="template"]');
const shareModal = document.getElementById('shareModal');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const closeModal = document.querySelector('.close');

// Event Listeners
generateBtn.addEventListener('click', handleGeneratePortfolio);
githubUsernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGeneratePortfolio();
});

backBtn.addEventListener('click', goBack);
previewBtn.addEventListener('click', handlePreview);
exportBtn.addEventListener('click', handleExport);
shareBtn.addEventListener('click', handleShare);
themeSelect.addEventListener('change', handleThemeChange);
sectionToggles.forEach(toggle => {
    toggle.addEventListener('change', handleSectionToggle);
});
copyLinkBtn.addEventListener('click', handleCopyLink);
closeModal.addEventListener('click', closeShareModal);
shareModal.addEventListener('click', (e) => {
    if (e.target === shareModal) closeShareModal();
});

// Main Functions
async function handleGeneratePortfolio() {
    const username = githubUsernameInput.value.trim();
    
    if (!username) {
        showError('Please enter a GitHub username');
        return;
    }

    const selectedTemplate = document.querySelector('input[name="template"]:checked').value;
    currentTheme = selectedTemplate;

    try {
        showLoading(true);
        const portfolioData = await fetchGitHubData(username);
        currentPortfolioData = portfolioData;
        
        populatePortfolio(portfolioData);
        applyTheme(currentTheme);
        showPage('portfolio');
        document.body.classList.add('editor-mode');

        showLoading(false);
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

async function fetchGitHubData(username) {
    try {
        // Fetch user data
        const userResponse = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!userResponse.ok) throw new Error('User not found');
        const user = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=stars&per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
        const repos = await reposResponse.json();

        // Enrich repos with contribution data
        const reposWithContributions = await Promise.all(
            repos.map(async (repo) => {
                try {
                    const commitsResponse = await fetch(
                        `${GITHUB_API_BASE}/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&per_page=1`,
                        {
                            headers: {
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        }
                    );

                    if (!commitsResponse.ok) return { ...repo, contributionCount: 0 };

                    const linkHeader = commitsResponse.headers.get('link');
                    let contributionCount = 1;

                    // Extract total commits from Link header
                    if (linkHeader) {
                        const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                        if (match) {
                            contributionCount = parseInt(match[1], 10);
                        }
                    }

                    return { ...repo, contributionCount };
                } catch {
                    return { ...repo, contributionCount: 0 };
                }
            })
        );

        // Sort by contribution count
        reposWithContributions.sort(
            (a, b) => b.contributionCount - a.contributionCount
        );

        return {
            user,
            repos: reposWithContributions
        };


        return {
            user,
            repos: repos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        };
    } catch (error) {
        throw new Error(`GitHub API Error: ${error.message}`);
    }
}

function populatePortfolio(data) {
    const { user, repos } = data;

    // Populate Hero Section
    document.getElementById('avatarImg').src = user.avatar_url;
    document.getElementById('profileName').textContent = user.name || user.login;
    document.getElementById('profileBio').textContent = user.bio || 'Full-stack developer';
    
    const githubLink = document.getElementById('githubLink');
    githubLink.href = user.html_url;
    githubLink.textContent = `@${user.login}`;

    // Populate About Section
    document.getElementById('aboutBio').textContent = user.bio || 'No bio provided';
    document.getElementById('locationInfo').textContent = user.location || '-';
    document.getElementById('companyInfo').textContent = user.company || '-';
    document.getElementById('websiteInfo').innerHTML = user.blog ? 
        `<a href="${user.blog}" target="_blank" style="color: var(--primary); text-decoration: none;">${user.blog}</a>` : 
        '-';

    // Populate Stats Section
    document.getElementById('repoCount').textContent = user.public_repos;
    document.getElementById('followerCount').textContent = user.followers;
    document.getElementById('followingCount').textContent = user.following;

    // Populate Skills Section
    const skillsSet = new Set();
    repos.forEach(repo => {
        if (repo.language) {
            skillsSet.add(repo.language);
        }
    });
    
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    Array.from(skillsSet).sort().forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        skillsList.appendChild(skillTag);
    });

    // Populate Projects Section
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    repos.slice(0, 10).forEach(repo => {
        const projectCard = createProjectCard(repo);
        projectsList.appendChild(projectCard);
    });

    // Populate Contact Section
    document.getElementById('contactLink').href = user.html_url;
}

function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const languageColor = LANGUAGE_COLORS[repo.language] || '#6f42c1';
    
    card.innerHTML = `
        <div class="project-header">
            <a href="${repo.html_url}" target="_blank" class="project-name">${repo.name}</a>
            <span class="project-stars">⭐ ${repo.stargazers_count || 0}</span>
        </div>
        <p class="project-description">${repo.description || 'No description provided'}</p>
        <div class="project-meta">
        ${repo.language ? `
            <div class="project-language">
                <span class="language-dot" style="background-color: ${languageColor}"></span>
                ${repo.language}
            </div>` : ''}
        <span>🧠 Contributions: ${repo.contributionCount}</span>
    </div>

    `;
    
    return card;
}

function applyTheme(theme) {
    document.body.className = '';
    
    currentTheme = theme;
    themeSelect.value = theme;
    
    switch(theme) {
        case 'dark':
            document.body.classList.add('theme-dark');
            break;
        case 'colorful':
            document.body.classList.add('theme-colorful');
            break;
        case 'tech':
            document.body.classList.add('theme-tech');
            break;
        default:
            // minimal theme (default)
            break;
    }
}

function handleThemeChange(e) {
    applyTheme(e.target.value);
}

function handleSectionToggle(e) {
    const sectionId = e.target.value;
    const section = document.getElementById(sectionId);
    
    if (e.target.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

function handleExport() {
    if (!currentPortfolioData) return;

    const { user } = currentPortfolioData;
    const html = generateStandaloneHTML();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${user.login}-portfolio.html`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


function generateStandaloneHTML() {
    const portfolioNode = document
        .getElementById('portfolioContainer')
        .cloneNode(true);

    const portfolioHTML = portfolioNode.innerHTML;

    // Grab current CSS + theme styles
    const baseCSS = getCSSContent();
    const themeCSS = getThemeCSS(); // << new function

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${currentPortfolioData.user.name || currentPortfolioData.user.login} - Portfolio</title>
<style>
${baseCSS}

/* Theme styles */
${themeCSS}

/* Ensure exported portfolio is centered */
body .portfolio-container {
    margin-right: 0 !important;
}

* { box-sizing: border-box; }
body { margin:0; padding:0; display:flex; justify-content:center; background: var(--bg, #fff);}
.standalone-wrapper { width:100%; max-width:1200px; padding:2rem; }
</style>
</head>
<body class="theme-${currentTheme}">
<div class="standalone-wrapper">
${portfolioHTML}
</div>
</body>
</html>`;
}

// New helper to extract only the CSS for current theme
function getThemeCSS() {
    const styleSheets = Array.from(document.styleSheets);
    let themeCSS = '';

    styleSheets.forEach(sheet => {
        try {
            Array.from(sheet.cssRules).forEach(rule => {
                if (rule.selectorText?.includes('.theme-')) {
                    themeCSS += rule.cssText + '\n';
                }
            });
        } catch(e) {
            // ignore cross-origin stylesheets
        }
    });

    return themeCSS;
}



function handleShare() {
    if (!currentPortfolioData) return;
    
    const { user } = currentPortfolioData;
    const baseURL = window.location.origin + window.location.pathname;
    const shareURL = `${baseURL}?username=${user.login}&theme=${currentTheme}`;
    
    shareLink.value = shareURL;
    shareModal.classList.remove('hidden');
}

function handlePreview() {
    document.body.classList.remove('editor-mode');

    if (!currentPortfolioData) return;

    const html = generateStandaloneHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
    document.body.classList.add('editor-mode');

}


function handleCopyLink() {
    shareLink.select();
    document.execCommand('copy');
    
    const originalText = copyLinkBtn.textContent;
    copyLinkBtn.textContent = '✓ Copied!';
    setTimeout(() => {
        copyLinkBtn.textContent = originalText;
    }, 2000);
}

function closeShareModal() {
    shareModal.classList.add('hidden');
}

function showPage(page) {
    if (page === 'landing') {
        landingPage.classList.remove('hidden');
        portfolioPage.classList.add('hidden');
    } else {
        landingPage.classList.add('hidden');
        portfolioPage.classList.remove('hidden');
    }
}

function goBack() {
    showPage('landing');
    githubUsernameInput.value = '';
    currentPortfolioData = null;
}

function showLoading(show) {
    if (show) {
        loadingSpinner.classList.remove('hidden');
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function getCSSContent() {
    const styleSheet = Array.from(document.styleSheets).find(sheet => 
        sheet.href && sheet.href.includes('styles.css')
    );
    
    if (styleSheet) {
        try {
            return Array.from(styleSheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
        } catch (e) {
            return document.querySelector('style')?.textContent || '';
        }
    }
    return '';
}

// Check for URL parameters to auto-load portfolio
function checkURLParameters() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const theme = params.get('theme');
    
    if (username) {
        githubUsernameInput.value = username;
        if (theme) {
            document.querySelector(`input[name="template"][value="${theme}"]`).checked = true;
        }
        handleGeneratePortfolio();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkURLParameters();
});