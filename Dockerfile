FROM node:carbon
MAINTAINER @oduonye1992

# Create app directory
RUN mkdir -p /usr/src/snitch
WORKDIR /usr/src/snitch

# Install app dependencies
# COPY package.json /usr/src/snitch/

# Bundle app source
COPY . /usr/src/snitch

RUN mkdir mytmp
RUN chmod -R 777 mytmp

RUN npm run setup


EXPOSE 3016
CMD [ "npm", "start" ]