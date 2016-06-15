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

Structor is a tool which helps to create UI in a Web application. So, the first thing that you need - clone or download one of the existing Web application projects from GitHub.

___Clone project from GitHub:___  
* Clone one of existing projects (BTW, you can request your own structure of Structor project with own generators, just [write to us](mailto:support@helmetrex.com)):
   * `git clone https://github.com/ipselon/bootstrap-prepack.git` for Bootstrap project
   * `git clone https://github.com/ipselon/material-ui-prepack.git` for Material UI project
   * `git clone https://github.com/ipselon/structor-starter-prepack.git` for starter project
* Go to appeared folder:
   * `cd bootstrap-prepack` for Bootstrap project
   * `cd material-ui-prepack` for Material UI project
   * `cd structor-starter-prepack` for starter project
* Install dependencies: `npm install`

___Or download & unpack:___  
* Go to Structor Market [http://helmetrex.com](http://helmetrex.com), choose suitable project.
* Download package on localhost and unpack it in some empty folder.
* cd to this folder and run ```npm install``` command.

#### Install Stuctor
If you are going to work in Structor with many projects, it's better to install Structor globally. But if you do not have an access to install globally or your environment has issues with global paths (see [#56](https://github.com/ipselon/structor/issues/56) issue), you can install and run Structor locally.

**Global installation**
```
npm install structor -g
```

**Local installation**
```
npm install structor
```
* Add the following line into `package.json` file in ```scripts``` section:
```
"structor": "structor"
```

#### Run Structor

Being in project's folder run from command line:
* In case Structor installed globally:
```
structor
```
* In case Structor installed locally:
```
npm run structor
```

##### Tips
* To run with different port: ```structor -p <port>```<br/>
* To specify different project's working directory: ```structor -d <path_to_project_dir>```
* To in verbose mode: ```structor -v```

### License
Apache License, Version 2.0 (Apache-2.0)
