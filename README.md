# Manga-Store

This is a React project for an online manga shop, where manga lovers are able to buy and sell their favorite titles.

![image](https://github.com/EmiliyaShtereva/Manga-Store/assets/123276538/ede711c3-7e47-4223-b33c-6a925966aaf9)

## Table of Contents

- [Setup](#setup)
- [Technologies Used](#technologies-used)
- [Backend](#backend)
- [Features](#features)
- [Architecture and Directories](#architecture-and-directories)
- [License](#license)

## Setup
Download GitHub repo

Server init:
- Open CMD in the server folder and enter "npm install" to install all the server dependencies.
- Enter "node server.js" in the command prompt in the same folder.
- There are over 30 default manga on the server.
- There are 3 default users: 
  - email: peter@abv.bg / password: 123456, 
  - email: george@abv.bg / password: 123456,
  - email: admin@abv.bg / password: admin

Application init:
- Open a new terminal in the client folder and enter "npm install" to install the app dependencies.
- Enter "npm run dev" in the command prompt in the same folder to start the app in developement mode.
- To open the app in the browser, open the link provided in the terminal after entering the previous command.

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/en/main)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) & [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [NPM](https://www.npmjs.com/)

## Backend

The used backend in this project is [softuni's practice server](https://github.com/softuni-practice-server/softuni-practice-server) where data is stored and fetched.

## Features
- Home page - When the application first starts the guest/user will be able to see latest 15 manga and their details.
- Catalog - Upon clicking on the Catalog on the side nav bar the guest/user will be able to see all uploaded manga and their details.
- Details - Upon clicking on the details for each manga it will open a detailed information about the selected manga.
- Login/Register - The user can create his own profile and log in the application with email and password.
- CRUD manga - When logged in the user can create, edit and delete their own manga.
- CRUD comment - When logged in the user can create their own comment in the details of every manga.
- Buy manga - When looged in the user can buy a manga only if the manga is not created by the user.
- Search - Search page will be availabe for all users or guests who visit the manga store.

## Architecture and Directories
```
Manga Store
├── .client
│   ├── public
|   |   ├── css: global css
|   |   ├── images: images used in the project
|   ├── src
│   |   ├── assets: Project assets
│   |   ├── components
|   |   |   ├── catalog
|   |   |   ├── create
|   |   |   ├── guards: guard for not authenticated users
|   |   |   ├── footer
|   |   |   ├── home-page
|   |   |   |   ├── main
|   |   |   ├── list-item: single manga component and css
|   |   |   ├── logout
|   |   |   ├── manga-details
|   |   |   |   ├── comments
|   |   |   |   ├── edit
|   |   |   |   ├── purchase
|   |   |   ├── navbar
|   |   |   |   ├── search
|   |   |   |   ├── side-nav
|   |   |   ├── page404
|   |   |   ├── sign-forms: forms for login and register
|   |   |   ├── something-went-wrong
|   |   |   ├── spinner: loading spinner
|   |   |   ├── static-pages: about, contact and frequently asked questions pages
│   |   ├── context: login, register, logout and search handlers
│   |   ├── hooks: custom hooks for forms and for persisted state
│   |   ├── services: requests to server for data
│   |   ├── App.jsx: Main application component and router
│   |   ├── main.jsx: EntryPoint of application.
|   ├── index.html
|   ├── package.json: File that manages all the dependecies and contains script definitions.
|   ├── vite.config.js: vite configuration
├── .server
```
## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/EmiliyaShtereva/Manga-Store/blob/main/LICENSE) file for details.
