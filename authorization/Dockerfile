FROM node:16.2.0
RUN npm i -g npm@7.16.0
COPY . /srv/authorization
WORKDIR /srv/authorization
RUN npm ci --also=dev
RUN npm run build

FROM node:16.2.0
EXPOSE 80
RUN npm i -g npm@7.16.0
WORKDIR /srv/authorization
COPY ./package.json /srv/authorization/package.json
COPY ./package-lock.json /srv/authorization/package-lock.json
COPY --from=0 /srv/authorization/build /srv/authorization/build
RUN npm ci --only=production
ENTRYPOINT [ "npm", "run", "start", "--" ]
