module.exports = {
  apps: [
    {
      name: "frontend",
      script: "reactserver.js",
      exec_mode: "cluster",
      instances: 3,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    dev: {
      user: "root",
      host: "139.59.7.187",
      ref: "origin/development",
      repo: "git@git.codingmart.com:senthil/extramile-frontend.git",
      path: "/var/www/extramile/frontend",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env development",
    },
  },
};
