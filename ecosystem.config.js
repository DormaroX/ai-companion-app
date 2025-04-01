module.exports = {
  apps: [{
    name: 'ai-companion-hub',
    script: 'src/server.js',
    watch: ['src'],
    ignore_watch: ['node_modules', 'logs', 'data'],
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000,
    exp_backoff_restart_delay: 100
  }]
};
