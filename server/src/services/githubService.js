// Octokit / GitHub API calls
const axios = require('axios');

/**
 * @desc    GitHub profile ka data fetch karna [LOGIC]
 * @param   {String} username - GitHub username
 */
exports.fetchGitHubData = async (username) => {
    try {
        // 1. User ki Basic Profile fetch karna
        const userRes = await axios.get(`https://api.github.com/users/${username}`);
        
        // 2. User ki Repositories fetch karna
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);

        // 3. Logic: Total Stars aur Top Languages nikalna [MATH]
        let totalStars = 0;
        const languages = new Set();

        reposRes.data.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) languages.add(repo.language);
        });

        // 4. Data return karna analysis ke liye
        return {
            profile: {
                name: userRes.data.name,
                bio: userRes.data.bio,
                public_repos: userRes.data.public_repos,
                followers: userRes.data.followers
            },
            stats: {
                totalStars,
                topLanguages: Array.from(languages),
                repoCount: reposRes.data.length
            }
        };

    } catch (error) {
        console.error("GitHub API Error:", error.message);
        throw new Error('Could not fetch GitHub data. Check the username.');
    }
};