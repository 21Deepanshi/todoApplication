FROM node

WORKDIR /app

COPY package.json .
# copy package.Jason to the working directory

RUN npm install

COPY . .
# Is used to be able to create snapshot images of the code that can be used to spin up the production (ready containers)
EXPOSE 3000

CMD ["node", "server.js"]