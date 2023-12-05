set -e

NODE_ENV=production
pnpm clean 
pnpm lint
pnpm test
rollup -c rollup.config.js
rollup -c rollup.cdn.config.js
mkdir -p ./docs
webpack
cp ./CNAME ./docs/CNAME
rm -rf ./types
tsc --emitDeclarationOnly