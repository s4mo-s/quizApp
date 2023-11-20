### START UP GUIDE

~~~text
SERVER
    npm run dev
DOCKER
    docker-compose up
MIGRATE
    npx prisma migrate dev --name init
SEED
    npx prisma db seed
STUDIO
    npx prisma studio
~~~

### DOCUMENTATION

#### 1 Follow standards

##### 1.1 Linters & Fixers - Use the configured formatting tools (eslint)

* single quotes
* no semicolons
* tab width 2 spaces

##### 1.2 Branching - Follow the set branching standard

If you want to add something:
Create your own feature or hotfix branch from develop branch
and then merge it with develop branch after reviewing the changes with others

* master    - production branch with tagged versions
* develop   - pre-master main development branch
* *feature   - for new stuff to be added
* hotfix    - for fixing something minor
