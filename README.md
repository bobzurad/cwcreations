cwcreations
===========
This is my own personal experiment at creating a web app using the node.js platform. I've spent my entire career building and supporting web applications with the .NET platform, so node.js is very new to me. This project is my way of learning something new. This project uses [Firebase](www.firebase.com) for a backend and the [BackboneFire](https://www.firebase.com/docs/web/libraries/backbone/quickstart.html) library. The goal of this project is to create an application that my wife can use to sell her handmade creations online.

##Development
Developing this project requires
* [node.js](http://nodejs.org/)
* [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
* [bower](http://bower.io)
* A [firebase](http://www.firebase.com) account

###Installation
Once you've cloned this repository, cd to it's location and run:

```bash
$ npm install
$ bower install
```

###Configuration
The only thing that needs to be configured is the location of the firebase app. I currently have that set in im/js/main.js

```javascript
define('firebaseConfig', {
  url: 'https://cwcreations.firebaseio.com/'
  });
```

###Running this app
You can run the app locally at http://localhost:8001 by running:
```bash
$ npm start
```

If you need to run the app at a different port you can change it in package.json.
```json
"start": "http-server ./app -a localhost -p 8001",
```
