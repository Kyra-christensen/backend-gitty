const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatarUrl;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatarUrl = row.avatar_url;
  }

  static async insert({
    username, email, avatarUrl
  }) {
    const { rows } = await pool.query(
      `
        INSERT INTO
          github_users (username, email, avatar_url)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
      [username, email, avatarUrl]
    );
    return new GithubUser(rows[0]);
  }

  static async findByEmail(email) {
    const { rows } = await pool.query (
      `
        SELECT
          *
        FROM
          github_users
        WHERE
          email=$1
      `,
      [email]
    );
    if (!rows[0]) return null;
    return new GithubUser(rows[0]);
  }

  toJSON() {
    return { ...this };
  }
};
