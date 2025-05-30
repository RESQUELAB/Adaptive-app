# AdaptiveApp

AdaptiveApp es una aplicación de escritorio multiplataforma construida con Electron, diseñada para ofrecer una experiencia de catálogo adaptable y personalizable para el usuario. Permite cambiar el modo de visualización, el tema, el idioma, el tamaño de fuente, la información mostrada y la categoría de productos, entre otras opciones.

## Características principales

* Interfaz adaptable: cambia entre vista de lista y cuadrícula.
* Temas claro y oscuro.
* Soporte para varios idiomas (español e inglés).
* Personalización de la información mostrada y el tamaño de fuente.
* Gestión de categorías y filtros de productos.
* Integración con servidor externo para autenticación y datos protegidos.

## Instalación

### Requisitos previos

* [Node.js](https://nodejs.org/) (recomendado v18 o superior)
* [npm](https://www.npmjs.com/)

### Pasos

1. Clona este repositorio:
   

```powershell
   git clone https://github.com/RESQUELAB/Adaptive-app.git
   cd Adaptive-app/src
   ```

2. Instala las dependencias:
   

```powershell
   npm install
   ```

3. Inicia la aplicación:
   

```powershell
   npm start
   ```

## Estructura del proyecto

* `src/` - Código fuente principal de la aplicación.
  + `main.js` - Proceso principal de Electron.
  + `preload.js` - Comunicación segura entre el frontend y Node.js.
  + `public/` - Archivos HTML, JS y CSS del frontend.
    - `js/` - Lógica de la interfaz y controladores.
    - `style/` - Hojas de estilo.
    - `img/` - Imágenes y logotipos.
* `release-builds/` - Paquetes generados para distribución.

## Dependencias principales

* [Electron](https://www.electronjs.org/)
* [axios](https://www.npmjs.com/package/axios)
* [socket.io](https://socket.io/)
* [gulp](https://gulpjs.com/) (solo desarrollo)

## ¿Qué esperar?

* Una aplicación de catálogo de productos adaptable y personalizable.
* Cambios de tema, idioma y visualización en tiempo real.
* Experiencia de usuario moderna y responsiva.

## Notas

* El componente "proxy" y la carpeta `proxy_src/` ya no se utilizan en esta versión.
* El backend para autenticación y datos protegidos debe estar disponible en la URL configurada en `preload.js`.

## Autor

RESQUELAB
