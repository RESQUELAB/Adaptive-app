# AdaptiveApp

AdaptiveApp is a cross-platform desktop application built with Electron, designed to provide an adaptable and customizable product catalog experience for users. It allows you to change the view mode, theme, language, font size, displayed information, product category, and more.

## Main Features

* Adaptable interface: switch between list and grid views.
* Light and dark themes.
* Support for multiple languages (Spanish and English).
* Customization of displayed information and font size.
* Product category and filter management.
* Integration with an external server for authentication and protected data.

## Installation

### Prerequisites

* [Node.js](https://nodejs.org/) (recommended v18 or higher)
* [npm](https://www.npmjs.com/)

### Steps

1. Clone this repository:

```powershell
   git clone https://github.com/RESQUELAB/Adaptive-app.git
   cd Adaptive-app/src
```

2. Install dependencies:

```powershell
   npm install
```

3. Start the application:

```powershell
   npm start
```

## Project Structure

* `src/` - Main source code of the application.
  + `main.js` - Electron main process.
  + `preload.js` - Secure communication between frontend and Node.js.
  + `public/` - Frontend HTML, JS, and CSS files.
    - `js/` - UI logic and controllers.
    - `style/` - Stylesheets.
    - `img/` - Images and logos.
* `release-builds/` - Generated packages for distribution.

## Main Dependencies

* [Electron](https://www.electronjs.org/)
* [axios](https://www.npmjs.com/package/axios)
* [socket.io](https://socket.io/)
* [gulp](https://gulpjs.com/) (development only)

## What to Expect?

* An adaptable and customizable product catalog application.
* Real-time theme, language, and view changes.
* Modern and responsive user experience.

## Notes

* The "proxy" component and the `proxy_src/` folder are no longer used in this version.
* The backend for authentication and protected data must be available at the URL configured in `preload.js`.

## Author

RESQUELAB
