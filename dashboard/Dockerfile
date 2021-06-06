FROM node:16.2.0
RUN npm i -g npm@7.16.0
COPY . /srv/dashboard
WORKDIR /srv/dashboard
RUN npm ci --also=dev
RUN npm run build

FROM node:16.2.0
EXPOSE 5000
RUN npm i -g npm@7.16.0 serve
WORKDIR /srv/dashboard
COPY --from=0 /srv/dashboard/build /srv/dashboard
CMD [ "serve" ]
