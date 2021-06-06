FROM node:16.2.0
RUN npm i -g npm@7.16.0
COPY . /srv/event-resource
WORKDIR /srv/event-resource
RUN npm ci --also=dev
RUN npm run build

FROM node:16.2.0
EXPOSE 80
RUN npm i -g npm@7.16.0
WORKDIR /srv/event-resource
COPY ./package.json /srv/event-resource/package.json
COPY ./package-lock.json /srv/event-resource/package-lock.json
COPY --from=0 /srv/event-resource/build /srv/event-resource/build
RUN npm ci --only=production
ENTRYPOINT [ "npm", "run", "start", "--" ]
