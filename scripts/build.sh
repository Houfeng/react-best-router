set -e

NODE_ENV=production
pnpm clean 
pnpm lint
pnpm test
NODE_ENV=production rollup -c rollup.config.js
NODE_ENV=production rollup -c rollup.cdn.config.js
mkdir -p ./docs
NODE_ENV=production webpack
cp ./CNAME ./docs/CNAME
rm -rf ./types
tsc --emitDeclarationOnly