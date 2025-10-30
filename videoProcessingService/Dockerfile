#official node runtime as parent image
FROM node:18

#set my working directory to /app
WORKDIR /app

#copy package.json and package-lock.json into working dir
COPY package*.json ./

#install ffmpeg on container (might need to change this to brew)
RUN apt-get update && apt-get install -y ffmpeg

#installs needed packages from package.json
RUN npm install

#copy app source code into the docker image
COPY . .

#make port 3000 available outside this container
EXPOSE 3000

#command that runs when we start up the container (only one cmd allowed)
CMD [ "npm", "start" ]

