rm -r node_modules/
npm install
node ace migration:run
node ace build
cd build/
npm ci --omit="dev"  
pm2 stop server 
# ENV_PATH=$ENV_PATH pm2 start bin/server.js
cp ../.env .env