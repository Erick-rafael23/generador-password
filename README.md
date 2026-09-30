# Generador de Contraseñas Seguras

Aplicación web que permite generar contraseñas aleatorias seguras seleccionando longitud y tipos de caracteres. Funciona en el navegador, sin backend, base de datos, registros, dependencias ni conexiones externas.

## Estructura

```text
generador-password/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Tecnologías

- HTML5: estructura semántica y controles accesibles.
- CSS3: diseño oscuro, Grid, Flexbox y estilos responsivos.
- JavaScript puro: generación, evaluación y portapapeles.

## Funciones

- Generación automática al abrir la página y mediante el botón «Generar contraseña».
- Longitud configurable de 6 a 32 caracteres, con 12 como valor inicial.
- Mayúsculas, minúsculas, números y símbolos activados por defecto.
- Cada contraseña incluye al menos un carácter de cada tipo seleccionado.
- Validación cuando no hay ningún tipo seleccionado.
- Indicador de seguridad: Débil, Media, Fuerte y Muy fuerte, con barra y colores.
- Botón para copiar al portapapeles con confirmación o mensaje de error.
- Diseño responsivo, navegación por teclado, mensajes accesibles y compatibilidad con movimiento reducido.

## Cómo ejecutar el proyecto

Abre la carpeta `generador-password` en Visual Studio Code. Abre `index.html` directamente en un navegador moderno o utiliza la extensión Live Server de Visual Studio Code y selecciona «Open with Live Server» sobre `index.html`.

No necesitas instalar paquetes ni compilar el proyecto. Todos los recursos son locales y puede funcionar sin conexión.

1. Ajusta el selector de longitud.
2. Selecciona los tipos de caracteres que deseas incluir.
3. Pulsa «Generar contraseña» para aplicar los cambios.
4. Pulsa «Copiar contraseña» para llevar el resultado al portapapeles.

El indicador siempre evalúa la contraseña que se muestra, aunque cambies la configuración antes de generar una nueva.

## Generación y seguridad

Se utiliza `crypto.getRandomValues()`, la fuente criptográfica del navegador. El muestreo por rechazo evita el sesgo de módulo. Se repite la generación hasta incluir todas las categorías seleccionadas, manteniendo una distribución uniforme entre las claves válidas. No se utiliza `Math.random()`.

El indicador considera la longitud y el tamaño de los grupos presentes: mayúsculas, minúsculas, números y símbolos. Estima `longitud × log2(variedad)`: menos de 40 bits es Débil, menos de 60 es Media, menos de 80 es Fuerte y a partir de 80 es Muy fuerte. Las claves menores de 8 caracteres se consideran Débiles y las menores de 12 tienen como máximo nivel Media. Es una orientación, no una garantía ni una estimación exacta de entropía bajo las restricciones de generación.

Las contraseñas no se almacenan ni se transmiten. Al copiar, la clave pasa al portapapeles del sistema. La Clipboard API puede requerir HTTPS, localhost y permiso del navegador. Al abrir el archivo directamente o si esa API falla, se intenta una copia mediante selección; si el navegador también la bloquea, se indica cómo copiar manualmente.

Usa contraseñas largas y diferentes para cada cuenta, guárdalas en un gestor de contraseñas y activa la verificación en dos pasos cuando esté disponible.

## Publicación

Para publicar con GitHub Pages:

1. Crea un repositorio en GitHub y sube estos cuatro archivos a su raíz, con `index.html` al nivel principal.
2. En la configuración del repositorio, entra en **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona la rama que contiene los archivos (normalmente `main`) y la carpeta **/ (root)**; guarda los cambios.
5. Espera a que termine la publicación y abre el enlace que muestra GitHub Pages.

También puedes publicar desde `/docs` si colocas allí los cuatro archivos y seleccionas esa carpeta como origen. GitHub Pages sirve la aplicación estática; no necesita un servidor propio ni una base de datos.
