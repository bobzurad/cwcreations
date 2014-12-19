cwcreations
===========
This is my own personal experiment at creating a native web application using the node.js platform. I've spent my entire career building and supporting web applications with the .NET platform, so node.js is very new to me. This project is my way of learning something new. This project uses [Firebase](http://www.firebase.com) as a BaaS (Backend-as-a-Service) and [BackboneFire](https://github.com/firebase/backbonefire) to sync data with Firebase. The goal of this project is to create an application that my wife can use to sell her handmade creations online.

##Development
Developing this project requires
* [node.js](http://nodejs.org/)
* [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
* [bower](http://bower.io)
* A [firebase](http://www.firebase.com) account
  * Only needed if you want to write to your own firebase.

###Installation
Once you've cloned this repository, cd to it's location and run:

```bash
$ npm install
$ bower install
```

###Running on localhost
You can run this application locally at http://localhost:8001 by running:
```bash
$ npm start
```

If you need to run this application at a different port you can change it in package.json.
```json
"start": "http-server ./app -a localhost -p 8001",
```

###Configuration and Firebase Schema
This project uses Firebase as a BaaS. You can configure this application to point to your own firebase by changing the FirebaseUrl in app/js/models/common.js

```javascript
FirebaseUrl: 'https://cwcreations.firebaseio.com/',
```

This application expects a firebase with the following schema. Note that an example record is shown (with an auto-generated key) for each collection.
```json
{
  "bracelets" : {
    "-JdYHWmQGGO9oIn-NQ1s" : {
      "description" : "some description",
      "isOnSale" : false,
      "name" : "Chainmaille Bracelet",
      "price" : 28.95,
      "salePrice" : 18.95,
      "tileImage" : "image.png"
    }
  }
}
```
Access to the Inventory Management application (located at /app/_im) will require you to enable [Email & Password authentication](https://www.firebase.com/docs/web/guide/login/password.html) on your firebase.
