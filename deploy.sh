#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate to build directory
cd dist

# after hyperchef.xyz is set up
# echo 'www.hyperchef.xyz' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:cgardn/hyperchef.git master:gh-pages

cd -
