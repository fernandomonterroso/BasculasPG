# Proyecto Básculas - Frontend

Este proyecto es el frontend de la aplicación web para el manejo de cargas en depósitos aduaneros. El sistema está desarrollado con **Angular** y permite gestionar el pesaje de guías, consultar información de básculas, registrar y almacenar pesos, y generar reportes.

## Características

- **Módulo de Básculas**: Consultar básculas disponibles y capturar pesos.
- **Pesaje de Guías**: Registrar pesos para cada guía en importaciones, exportaciones y courier.
- **Reportes**: Generar reportes de pesajes realizados, exportables en PDF.
- **Autenticación de Usuarios**: Sistema de login basado en gafetes para acceso de operadores.

## Tecnologías Utilizadas

- **Angular** 18 standalone
- **Bootstrap** para el diseño responsivo
- **Ngx-Toastr** para las notificaciones emergentes
- **API REST** para interactuar con el backend desarrollado en .NET Core

## Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Angular CLI](https://angular.io/cli)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/fernandomonterroso/BasculasPG.git
   ```

2. Accede al directorio del proyecto:

   ```bash
   cd BasculasPG
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

## Ejecución del Proyecto

Para ejecutar el proyecto en un entorno de desarrollo, usa el siguiente comando:

```bash
ng serve
```

Esto iniciará un servidor local en la URL: `http://localhost:4200/`.

## Configuración

### Variables de Entorno

Puedes configurar las variables de entorno creando o modificando el archivo `src/environments/environment.ts`. Ejemplo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://apibasculas.sistemasdeguatemala.online/api',
};
```

### Compilación para Producción

Para compilar el proyecto para producción, ejecuta:

```bash
ng build --prod
```

Los archivos compilados estarán disponibles en el directorio `dist/`.

## Funcionalidades Clave

- **Login**: Los usuarios deben autenticarse con su número de gafete.
- **Pesaje**: Captura de pesos en tiempo real utilizando básculas conectadas.
- **Generación de Reportes**: Permite generar un PDF con la información del pesaje registrado.

## Contribución

Si deseas contribuir a este proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama con tu feature: `git checkout -b feature-nueva-funcionalidad`
3. Haz commit de tus cambios: `git commit -m 'Agrega nueva funcionalidad'`
4. Haz push a tu rama: `git push origin feature-nueva-funcionalidad`
5. Abre un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para obtener más detalles.

---

¡Gracias por utilizar el sistema de pesaje de básculas para depósitos aduaneros!
