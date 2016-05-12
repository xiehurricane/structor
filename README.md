Structor - visual GUI editor for React.
----------

[![facebook group](https://img.shields.io/badge/facebook%20group-follow-blue.svg?style=flat)](https://www.facebook.com/groups/structor/)
[![Twitter Follow](https://img.shields.io/twitter/follow/@helmetrex.svg?style=social)](https://twitter.com/helmetrex)

[![npm version](https://img.shields.io/npm/v/structor.svg?style=flat)](https://www.npmjs.com/package/structor)
[![npm downloads](https://img.shields.io/npm/dt/structor.svg?style=flat)](https://www.npmjs.com/package/structor)

<img src="https://github.com/ipselon/structor/blob/master/images/title-background.png" style="width: 100%;"></img>

Structor is a fast and handy tool for the visual construction of User Interface from pre-created components.

### Introduction

* [Structor as playground for React Applications](https://medium.com/@alex_pustovalov/structor-as-a-playground-for-react-applications-49accf4544b8#.auvm78l7v)

### Videos

* [Videos on Structor Market](https://helmetrex.com/videos)

### Existing projects on GitHub

* [material-ui-prepack](https://github.com/ipselon/material-ui-prepack)
* [bootstrap-prepack](https://github.com/ipselon/bootstrap-prepack)
* [structor-starter-prepack](https://github.com/ipselon/structor-starter-prepack)

### Articles

* [Using React Router inside of components](https://github.com/ipselon/structor/wiki/Using-React-Router-inside-of-components)
* [Structor's component model representation](https://github.com/ipselon/structor/wiki/Structor's-component-model-representation)
* [Shortcuts](https://github.com/ipselon/structor/wiki/Structor-shortcuts)
* [Troubleshooting](https://github.com/ipselon/structor/wiki/Trobleshooting)

### Requirements

* node.js 5.x
* npm 3.8.x

### Getting started

Install Structor in global scope:
```
npm install structor -g
```

Then you have the following ways to start working in the builder.

#### The fastest way
* Clone one of existing projects (BTW, you can request your own structure of Structor project with own generators, just [write to us](mailto:support@helmetrex.com)):
   * `git clone https://github.com/ipselon/bootstrap-prepack.git` for Bootstrap project
   * `git clone https://github.com/ipselon/material-ui-prepack.git` for Material UI project
   * `git clone https://github.com/ipselon/structor-starter-prepack.git` for starter project
* Go to appeared folder:
   * `cd bootstrap-prepack` for Bootstrap project
   * `cd material-ui-prepack` for Material UI project
   * `cd structor-starter-prepack` for starter project
* Install dependencies: `npm install`
* Run Structor: `structor` (`structor -p <some another port>`)
* Open your browser with address: `http://localhost:2222/structor` (`http://localhost:<some another port>/structor`)

#### The lazy way (often buggy):
* Create an empty folder on local machine.
* Go to this folder.
* Run Structor: `structor` (`structor -p <some another port>`)
* Open your browser with address: `http://localhost:2222/structor` (`http://localhost:<some another port>/structor`)
* Choose suitable project and click clone option.

#### One more way (preferable for Windows users):
* Go to Structor Market [http://helmetrex.com](http://helmetrex.com), choose suitable project.
* Download package on localhost and unpack it in some empty folder.
* cd to this folder and run ```npm install``` command.
* Run Structor: `structor` (`structor -p <some another port>`)
* Open your browser with address: `http://localhost:2222/structor` (`http://localhost:<some another port>/structor`)
 
The next time you want to open project in Structor, just go to the folder where project is and run ```structor```.

##### Tips
* To run with different port: ```structor -p <port>```<br/>
* To specify different project's working directory: ```structor -d <path_to_project_dir>```

### License
Apache License, Version 2.0 (Apache-2.0)
