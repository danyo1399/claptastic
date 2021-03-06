# Claptastic

Published at 
https://danyo1399.github.io/claptastic/

setup local cert 
https://web.dev/how-to-use-local-https/

## Setup
- install mkcert for your os
- run npm run ssh-setup to setup dev build
- run npm run start:dev to start web server
- open browser to https://localhost:8080/claptastic/

## Deployment stuff
Setting up dev/test/preview deployments can be done via netlify

- Setup an account and website
- run npm run deploy:netlify:preview to deploy it.

Dont forget to add /claptastic/ to the end of the url.

## Publish to github docs
- Just run npm script npm run publish publish to github
- check in to main and youre done.
