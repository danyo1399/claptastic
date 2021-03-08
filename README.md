# Claptastic

Published at 
https://danyo1399.github.io/claptastic/

setup local cert 
https://web.dev/how-to-use-local-https/

## Setup
- install mkcert for your os
- Execute the following commands  
```
npm install
npm run ssh-setup
npm run start:dev
```
- open browser to https://localhost:8080/claptastic/

### Dev workflow setup
If you want to setup dev workflow process, you will need to setup an account on 
netlify to host a pre prod env for testing on mobile phones etc

- Setup an account on netlify
- Create a website on netlify
- run npm run deploy:netlify:preview to deploy it(setup process first time run)
- open website url. Dont forget to add /claptastic/ to the end of the url


### testing
- start local server with npm run start:dev
- Run npm run test to perform cypress tests.


## Publish to github docs
- check in to main and youre done.
- Just run npm script npm run publish publish to github
