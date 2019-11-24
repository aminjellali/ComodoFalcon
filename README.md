# ComodoFalcon
A beta version of a pre-rendering engine used to solve SEO issues that comes with Client Side Rendering.
----
ComodoFalcon is a cloud-enabled, light weight, restful microservice, build with:
  - nest js: TypeScript Angular-framework (MIT licensed) :heart_eyes: .
  - puppeteer: a high end browser programatic handler (Apache licensed).
  - compodoc used to generate increadible documentation form code comments
  - mongodb.
  
----
## Overview
---

* Problematic:  
For our platform websites to be indexed by google bots we must apply to the constantly changing SEO rules, one of which is rendering time, in fact google crawlers will see how much time your website takes to render content. 
The issue in hand is that the new Minotore approach is using both rendering processes (SSR, CSR) by using spring MVC for SSR, and angular elements for CSR. The ratio though is what matters, and the website is 60% to 70% in favor of CSR. Which is a big SEO issue because more than half of the website want be refrenced. 
This is simply because crawlers do not execute JavaScript, even though google claims that sometimes they do for high ranked websites. 

* Solution: 
So, the solution here is simple, when a bot fetches content form us we should provide him with the maximum content possible, and thus we need to do what browsers are made to do.

   :collision: **We are building ComodoFalcon the pre-rendering engine** :collision:

-----
## Installation
-----

ComodoFalcon requires:
* Node.js v4+ to run.
* mongo db instance.

**Install the dependencies and devDependencies.**
```sh
$ npm install
```
**Build project**
```sh
$ npm run build
```
**Start the server in dev mode**

:warning: You must provide an development.conf that contains run time configurations in the root folder

```sh
$ NODE_ENV=development npm run start:dev
```
**Start the server production mode**

:warning: You must provide an production.conf that contains run time configurations in the root folder

```sh
$ NODE_ENV=production npm run start:prod
```
**.CONF file**

:warning: All of these fields are required.

| Variable name | Description |
| ------ | ------ |
| SERVER_PORT | Port on which the app is served |
| MONGODB_URI | The data base URI |
| LAUNCH_HEADLESS_BROWSER | If true will launch chromium GUI with each request. |
| IDENTIFY_AS_BOT | Will Identify it self to the client as bot |
| USER_AGENT_AS_BOT | Will use this user agent when requesting data|
| ENABLE_OPTIMIZATION | Enable or disable optimization that will abort all ressources from the RESSOURCES_TO_DISABLE to disable var|
| RESSOURCES_TO_DISABLE | List of the request type to disable|
| WAIT_FOR_STARTERS | List of prefixes to check for while validating the element to wait for|
|QUERY_URL_ONLY| Query Fields in order to optimize memory we will be heavily use projection|

**Generate and consult documentation**

* compodoc documentation
After launching the doculentation server `-s` it will be generated on the host 8080 port.
to change the port consult the compodoc documentation -> just click on the compodoc logo below.
    ```sh
    $ compodoc -p tsconfig.build.json -s
    ```
* swagger documentation
This will be available once the app is launched you could consult it on the ```/api``` endpoint of the project.
----
## Todos
-----
* Poc final steps:
    -  swagger documentation.
    -  insuring robustness and adding FIXME.
    -  check RMQ to avoid request time outs. ~
    -  check if feign could be added. ~
    -  check if eureka discovery is possible.
    -  create reporting service to create a report for each page:
	- implement a processor to check for the integrity of the output.
	- maybe save screen shots of the outputs as well.
    -  add js ressources handler to minimize fetching time and rendering time as well.
    -  add a light weight js dashborad to control this tiny beast.
    -  create docker compose
    -  add a notification mechanism
* Todos in mvc:
    -  if query is identified as bot fetch data form pre-rendering engine
* To dos in widgets:
    -  add tags for identification
    -  optimize rendering time by building them as aot and migration to angular 9.
    
----
## Thanks to 
----

<p align="center" style="">
  <a href="https://docs.nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
  <a href="https://www.minotore.com" target="blank"><img src="https://www.minotore.com/wp-content/uploads/thegem-logos/logo_593f23f4444b09a63ca5ef1c3c54700d_1x.png" width="320" alt="Minotore Logo" /></a>
  <a href="https://pptr.dev/" target="blank"><img src="https://user-images.githubusercontent.com/10379601/29446482-04f7036a-841f-11e7-9872-91d1fc2ea683.png" width="320" alt="puppeteer Logo" /></a>
  <a href="https://compodoc.app/" target="blank"><img src="https://compodoc.app/assets/img/logo.png" width="320" alt="compodoc Logo" /></a>
</p>

----
## VITAL NOTES:
----
> This project is in it's beta version there will be time out exceptions since the pre-processing engine takes a considerable amount of time
pre-renderign a page do this process has to be started in an a async way, the way spring batch does.
or a messaging service has to be implemented like RMQ, so we dump messages for the app to handle and that way we could avoid time out exceptions.

> **SSR**: Server-Side Rendering.

> **CSR**: Client-Side Rendering.
