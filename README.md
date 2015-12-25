Structor - a user interface builder for React
----------

[![structor channel on discord](https://img.shields.io/badge/discord-structor%40reactiflux-0077dd.svg?style=flat)](https://discord.gg/0ZcbPKXt5bWioOhk)

[![npm version](https://img.shields.io/npm/v/structor.svg?style=flat)](https://www.npmjs.com/package/structor)
[![npm downloads](https://img.shields.io/npm/dt/structor.svg?style=flat)](https://www.npmjs.com/package/structor)

<img src="https://github.com/ipselon/structor/blob/master/images/title-background.png" style="width: 100%;"></img>

Are you thinking about changing the old-school looking interface of your Web Application into the modern one? Do you want to make it fast, convenient and just exciting?

But maybe you are not ready to step into a gamble and seek for new employees who already obtained the cutting-edge technologies?

Structor is our new Open Source project, which were developed especially to overcome such challenges. Structor is the Swiss Army knife in UI-development. Structor eliminates the routine tasks, it’s a fast and handy tool for the visual construction of User Interface from a pre-created components.

Structor is not just a next visual UI-builder. Structor is an effective and valuable tool for a whole development life-cycle from interface design through prototyping to implementation.

### Features

* Visual combining of interface elements (well known WYSIWYG principals, from now - for your web-applications). You always get the instant result - how your UI-components look, feel, how they can interact with each other and with User.
* A unique flexible and configurable code generation. UI developer is able to configure the existing code generators or create his own code generator. Both options are quick and simple. And the result is - clear and clean code generated with taking into account your preferable design patterns.
* Advanced documentation features for components. All components used in Structor has built-in documentation. Thus, it’s easy and convenient to configure and modify components within Structor.
* Structor has “boilerplates” - bundles with a sets of simple basic components or components with an advanced complicated logic. It’s really easy to reuse components in Structor.
* Structor’s Team support. We are providing service support both for integration of Structor into your development process and overall fulfillment.

The builder runs as HTTP server with ```webpack-dev-middleware``` + ```webpack-hot-middleware``` + ```react-transform-hmr``` inside.
So, the builder can be used as an HTTP server with all hot reloading capabilities from the box.

Watch the presentation about how Structor works. This presentation shows all capabilities of Structor as development tool and describe its user interface controls: [How does Structor work ?](http://slides.com/alexanderpustovalov/deck)


### Videos

* [Fetch data from GitHub | Part 1](https://www.youtube.com/watch?v=AY65e6Ry_rY)
* [Fetch data from GitHub | Part 2](https://www.youtube.com/watch?v=JLz8B0XJPyk)
* [Speed designing of ToDo list](https://www.youtube.com/watch?v=PggnIYdaJFI&list=PLAcaUOtEwjoR_U6eE2HQEXwkefeVESix1&index=3)
* [How to create login menu to Facebook and GooglePlus](https://www.youtube.com/watch?v=Ks2tWAJvDqo&list=PLAcaUOtEwjoR_U6eE2HQEXwkefeVESix1&index=4)

### Structor Market

##### Site 
[http://helmetrex.com](http://helmetrex.com)

##### List of existing boilerplates

* [bootstrap-prepack](https://github.com/ipselon/bootstrap-prepack)
* [material-ui-prepack](https://github.com/ipselon/material-ui-prepack)

### Documentation

* [Structor's component model representation](https://github.com/ipselon/structor/wiki/Structor's-component-model-representation)
* [Generators metadata overview](https://github.com/ipselon/structor/wiki/Generators-metadata-overview)
* [Shortcuts](https://github.com/ipselon/structor/wiki/Structor-shortcuts)

### Tutorials

* [Fetch data from GitHub (part 1)](https://github.com/ipselon/structor/wiki/Structor-tutorial:-%22Fetch-data-from-GitHub%22-(part-1))
* [Fetch data from GitHub (part 2)](https://github.com/ipselon/structor/wiki/Structor-tutorial:-%22Fetch-data-from-GitHub%22-(part-2))

### Getting started

Install Structor in global scope:
```
npm install structor -g
```

Then you have two ways to start working in the builder.

The first way:
* Create an empty folder on local machine.
* cd to this folder and run command: ```structor```.
* Open the browser and enter the address: ```http://localhost:2222/structor```.
* Choose suitable prepack and click clone option.
* Start composing UI...

The second way:
* Go to Structor Market [http://helmetrex.com](http://helmetrex.com), choose suitable boilerplate.
* Download package on localhost and unpack it in some empty folder.
* cd to this folder and run ```npm install``` command.
* Once installation is finished run ```structor```.
* Open the browser and enter the address: ```http://localhost:2222/structor```.
* Start composing UI...
 
The next time you want to open project in Structor, just go to the folder where project is and run ```structor```.

##### Tips
* To run with different port: ```structor -p <port>```<br/>
* To specify different project's working directory: ```structor -d <path_to_project_dir>```

### How to add own boilerplate to Structor Market
The source code of all boilerplates which are presented on Structor Market are located on GitHub. Consequently, you can add a reference of your own Structor compatible boilerplate to the market which exists on GitHub. To do that you have to visit [Structor Market](http://helmetrex.com) and enter the name of repository into add form.

The source code has to be compatible with Structor, to see examples of compatible repositories just visit any of already presented boilerplates. Also please note, in order to have a good looking thumbnail of your project on the market add 'screenshot.png' file with screen shot of the Structor's workspace with your project open.

Or if you know repositories of Structor compatible repos not presented on the market, please add it to the market's gallery. We appreciate your contribution to the market.

### Discussion

You are welcome to join Discord channel: [#structor](https://discord.gg/0ZcbPKXt5bWioOhk)

#### License
Apache License, Version 2.0 (Apache-2.0)
