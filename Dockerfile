FROM rosenhouse/phantomjs2

# TODO Move to base image

ENV NPM_CONFIG_REGISTRY="http://registry.npmjs.org/" \
 PHANTOMJS2_VERSION="2.0.0"

RUN apt-get update
RUN apt-get install --yes curl git
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install --yes nodejs
 
# Commands

WORKDIR /tmp
COPY package.json package.json
RUN npm install --no-optional
RUN mkdir /ng2-starter-kit
WORKDIR /ng2-starter-kit
ADD . /ng2-starter-kit
RUN mv /tmp/node_modules ./
RUN npm run-script package
RUN tar -C target/ -czf probe-ts.tar.gz .

CMD ["cat ng2-starter-kit.tar.gz"] 