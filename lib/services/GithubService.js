const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');

module.exports = class GithubService {
  static create(code) {
    let githubProfile;
    return exchangeCodeForToken(code)
      .then((token) => getGithubProfile(token))
      .then((profile) => {
        githubProfile = profile;
        return GithubUser.findByEmail(profile.email); 
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert(githubProfile);
        } else {
          return user;
        }
      });
  }
};


// static async create(code) {
//   const token = await exchangeCodeForToken(code);

//   const { login, avatar_url, email } = await getGithubProfile(token);
    
//   let user = await GithubUser.findByEmail(email);

//   if(!user) {
//     user = await GithubUser.insert({
//       username: login,
//       avatarUrl: avatar_url,
//       email,
//     });
//   }
//   return user;
// }

