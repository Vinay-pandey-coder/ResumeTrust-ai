const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const githubData = {
                githubId: profile.id,
                githubUsername: profile.username,
                name: profile.displayName || profile.username,
                avatar: profile.photos?.[0]?.value || '',
            };

            console.log(`✅ GitHub OAuth verified: ${githubData.githubUsername}`);
            return done(null, githubData);

        } catch (error) {
            return done(error, null);
        }
    }));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;