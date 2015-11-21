Structor - a user interface builder for React
----------

[![Join the chat at https://gitter.im/ipselon/structor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ipselon/structor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://img.shields.io/npm/v/structor.svg?style=flat)](https://www.npmjs.com/package/structor)
[![npm downloads](https://img.shields.io/npm/dt/structor.svg?style=flat)](https://www.npmjs.com/package/structor)
[![structor channel on discord](https://img.shields.io/badge/discord-structor%40reactiflux-0077dd.svg?style=flat)](https://discord.gg/0ZcbPKXt5bWioOhk)

<img src="https://github.com/ipselon/structor/blob/master/images/title-background.png" style="width: 100%;"></img>


### Short presentation
Watch the presentation about how Structor works. This presentation shows all capabilities of Structor as development tool and describe its user interface controls: [How does Structor work ?](http://slides.com/alexanderpustovalov/deck)

### Description
Structor is former React UI Builder. If you are not familiar with React UI Builder you can watch the video here: [https://www.youtube.com/watch?v=5nqOFSjXKPI](https://www.youtube.com/watch?v=5nqOFSjXKPI).

But, it is better to read the following text because the builder has absolutely redesigned look and feel and has a lot of new features.

First of all, Structor is a visual development environment for node.js Web applications with React UI.

The essential part of the builder is a project boilerplate. The boilerplate is a prepacked source code of node.js application in which metainfo included. Using this info Structor knows how to use components included into the package. There is a place where you can find and download boilerplates - a Structor Market [http://helmetrex.com](http://helmetrex.com).

It absolutely doesn't mean that you has to strictly follow the rules by which the boilerplate was designed and change the development process you used to follow. Each project is completely hackable and you can change almost everything. For example, if you don't want to use Redux or React Bootstrap in the project you may remove them from the source code. The builder is only the environment which uses metadata of the project to provide UI building. 

More about the structure of pre-pack and how it is used by Structor please read Wiki of the project [bootstrap-prepack](https://github.com/ipselon/bootstrap-prepack).

The builder runs as HTTP server with ```webpack-dev-middleware``` + ```webpack-hot-middleware``` + ```react-transform-hmr``` inside.
So, the builder can be used as an HTTP server with all hot reloading capabilities from the box.

Switching between two modes: edit mode and live-preview mode gives a feeling as if you are creating the Web app right in the browser. And of course, you can edit the source code in your favorite IDE or text editor and don't worry about page reloading (maybe in rear cases).

Apparently, we can admit that this tool having such features can be used not only in starter prototyping phase of development process, but used during all development process instead of HTTP backend server for Web app.

### Documentation

* [Wiki](https://github.com/ipselon/structor/wiki)
* [Shortcuts](https://github.com/ipselon/structor/wiki/Structor-shortcuts)

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
To run with different port: ```structor -p <port>```<br/>
To specify different project's working directory: ```structor -d <path_to_project_dir>```

### How to add own boilerplate to Srtuctor Market
The source code of all boilerplates wich are presented on Structor Market are located on GitHub. Consequently, you can add to the market the reference of your own Structor compatible boilerplate which exists on GitHub. To do that you have to visit [Structor Market](http://helmetrex.com) and enter the name of repository into add form.

The source code has to be compatible with Structor, to see examples of compatible repositories just visit any of already presented boilerplates. Also please note, in order to have a good looking thumbnail of your project on the market add 'screenshot.png' file with screen shot of the Structor's workspace with your project open.

Or if you know repositoires of Structor compatible repos not presented on the market, please add it to the market's gallery. We appreciate your contribution to the market.

### Discussion

You are welcome to join Discord channel: [#structor](https://discord.gg/0ZcbPKXt5bWioOhk)

#### License
GNU GENERAL PUBLIC LICENSE Version 3 (GPL-3.0)
