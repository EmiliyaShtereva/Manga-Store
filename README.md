# Manga-Store

This is a React project for an online manga shop which is for manga lovers to be able to buy and sell their favorite titles.

![image](https://github.com/EmiliyaShtereva/Manga-Store/assets/123276538/ede711c3-7e47-4223-b33c-6a925966aaf9)

## Summary

- [Technologies Used](##-technologies-used)
- [Backend](##-backend)
- [Architecture and Directories](##-architecture-and-directories)
- [License](##-license)

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/en/main)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) & [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [NPM](https://www.npmjs.com/)

## Backend

The used backend in this project is [softuni's practice server](https://github.com/softuni-practice-server/softuni-practice-server) where data is stored and fetched.

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

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/EmiliyaShtereva/Manga-Store/blob/main/LICENSE) file for details
