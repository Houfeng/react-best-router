set -e

NODE_ENV=production
pnpm clean 
rollup -c rollup.config.js
rollup -c rollup.cdn.config.js
mkdir -p ./docs
webpack
cp ./CNAME ./docs/CNAME
pnpm lint
rm -rf ./types
tsc --emitDeclarationOnly