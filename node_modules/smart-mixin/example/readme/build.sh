cd "$(dirname $0)"

browserify -t 6to5ify index.js > bundle.js

if hash open 2>/dev/null; then
    open index.html
else
    xdg-open index.html
fi

