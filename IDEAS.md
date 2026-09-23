# Ideas de juego — puzzle 3D para móvil

Tablero visual con las 8 propuestas (7 conceptos + 2 prototipos jugables):
https://claude.ai/artifact/LomK5LgMGh9SkGfxAMXkNB

## Conceptos explorados

1. **Saca la ficha** (Triple Tile) — pila desordenada, fichas a una bandeja, 3 iguales desaparecen. **← EN CURSO**, prototipo jugable en el tablero.
2. **Ordena por color** — mover bolas entre tubos hasta que cada uno sea un solo color.
3. **Encaja el bloque** — deslizar piezas por un tablero hasta sacarlas por la salida de su color.
4. **Tira del pasador** — quitar pasadores para que las bolas caigan en el bote correcto.
5. **Combina en la cuadrícula** — Candy Crush con gemas 3D y combos en cascada.
6. **Encuentra el objeto** (estilo June's Journey) — buscar objetos ocultos en una escena + preguntas/decisiones entre escenas que avanzan una historia. Puede incluir un minijuego de puzle (idea 7) para conseguir pistas.
7. **JigsawCard** — puzle clásico pieza a pieza que al completarse se convierte en una carta coleccionable (álbum, series, cartas raras).

## Estado actual

**Construyendo la app real de la idea 1** ("Saca la ficha", temática taller) — ya no es solo el prototipo del tablero de ideas, es un proyecto de código en este repo.

- **Stack elegido**: app web (React + Vite + TypeScript), pensada para empaquetar luego con Capacitor como app nativa iOS/Android sin reescribir nada. Se descartó Unity para este puzle concreto porque no puedo abrir ni probar el Editor de Unity desde aquí; con web puedo escribir, ejecutar y verificar el juego yo mismo en cada paso.
- **Estructura**: `src/game/` (lógica pura: `types.ts`, `tools.ts`, `levelGenerator.ts`, `gameLogic.ts`) separada de `src/components/` (UI: `ToolIcon`, `TileButton`, `Tray`, `GameScreen`). Para arrancarlo: `npm install && npm run dev`.
- **Mecánica de fichas superpuestas implementada de verdad**: las fichas se generan en pilas (varias por el mismo hueco, una capa encima de otra) y solo la de arriba de cada pila es tocable; al quitarla se destapa la de abajo. Verificado con test automatizado (Playwright + capturas).
- **Arte final decidido: fotos reales, no vectores.** Se probaron dos caminos antes de esto: iconos SVG con degradados (parecía "3D" pero seguía siendo un dibujo) y el set gratuito Fluent Emoji 3D de Microsoft (queda en `src/assets/tools/`, sin usar). Se descartaron los dos: el usuario mandó 15 fotos de herramientas reales generadas con IA, las recorté de su collage y son las que usa el juego (`src/assets/tools-photo/`, ver `NOTICE.md` ahi para el detalle). El fondo gris claro de las fotos se funde con el bisel marfil de la ficha sin necesitar quitar el fondo.
- **Sistema herramienta + color de variante, con fotos**: 34 herramientas — las 15 originales (manuales) mas 19 nuevas, sobre todo electricas y de taller (amoladora, compresor, esmeriladora de banco, lijadora, nivel laser, multiherramienta oscilante, pistola de calor, herramienta rotativa, sierra circular, sierra sable, soplete, tornillo de banco, termometro infrarrojo, detector de metales, mordazas en C, grapadora de clavos, aspiradora de mano, aspiradora de taller, soldador), recortadas de 4 collages nuevos que el usuario mando con bastante repeticion entre ellos y con lo que ya teniamos — se descartaron a mano las duplicadas (ver `NOTICE.md` para el detalle de que se descarto y por que). Cada foto se recolorea con un filtro CSS `hue-rotate` (6 variantes) — funciona bien porque el metal de las fotos esta poco saturado y el mango/mordaza es el color dominante, asi que solo se recolorea la parte que "deberia" cambiar. Da hasta 204 tipos de ficha combinando foto × color. Añadir una herramienta mas es una foto nueva recortada a cuadrado + una entrada en `tools.ts`.
- **Muchos niveles resuelto**: `generateLevel(levelIndex)` genera niveles infinitos de forma procedural (no hay niveles hechos a mano). La dificultad sube con dos mandos independientes: nº de tipos de herramienta en juego y nº de capas apiladas por hueco. Se prueba en consola que genera correctamente hasta nivel 150+ sin romperse.
- **Acabado 3D real de la ficha**: bisel marfil con degradado, sombra dura de "grosor" y brillo superior (CSS) — se nota especialmente en como asoma la ficha tapada por detras de la de arriba. Hay una vista de repaso en `/?gallery` que pinta las 34 herramientas x los 6 colores para revisarlas de un vistazo cuando se añadan mas.
- **Recorte de fotos pulido**: las 4 fotos que quedaban finas/pequeñas dentro de la ficha (cutter, alicate de punta, llaves Allen, tijera de podar — objetos largos y finos fotografiados en diagonal) se rotaron para ponerlas mas horizontales y se recortaron ajustadas al objeto, evitando el canto de la tarjeta original de fondo (que si no, se colaba como un borde negro al rotar). Las demas (lijadora, sierra circular, esmeriladora, herramienta rotativa, nivel laser) se revisaron ampliadas y ya estaban bien encuadradas — son solo herramientas de tono oscuro, no un problema de recorte.
- **Capacitor añadido (empaquetado nativo)**: `@capacitor/core`, `@capacitor/cli` y `@capacitor/android` instalados; `capacitor.config.ts` creado (`appId: com.eltaller.sacalaficha`); `npx cap add android` ya genero la carpeta `android/` (proyecto Android Studio completo, con su propio `.gitignore` para no subir build ni `local.properties`). Scripts nuevos: `npm run cap:sync` (build web + sincroniza con las plataformas nativas) y `npm run cap:android` (sync + abre Android Studio).
  - **Lo que NO se puede hacer desde aqui**: compilar el APK de verdad. Lo probe (`./gradlew tasks`) y falla porque este contenedor no tiene el Android SDK instalado, y ademas la politica de red del entorno bloquea `dl.google.com` (403), que es de donde Gradle descarga el plugin de Android — sin acceso a ese dominio no hay forma de resolverlo aunque instalara el SDK a mano. Esto se cambia en Network access de la configuracion del entorno (menu del entorno en la barra de titulo de la sesion → Edit) si se quisiera intentar compilar desde aqui, pero aun asi haria falta el SDK completo y no hay manera de ver la app corriendo (ni emulador ni movil) desde un contenedor en la nube.
  - **Siguiente paso real, en el ordenador del usuario**: instalar Android Studio, abrir la carpeta `android/` de este repo (o `npm run cap:android` si ya tiene el proyecto clonado y `npx` disponible), dejar que Android Studio descargue el SDK la primera vez, y darle a Run con un emulador o el movil por USB. iOS seria el mismo flujo pero con Xcode en un Mac (`npx cap add ios` cuando toque, aun no añadido).

## Pendiente — retomar cuando se pida

**Idea 6 (Encuentra el objeto / estilo June's Journey) + minijuego de la idea 7 dentro.**

Decisiones ya tomadas para cuando se retome:
- **Origen de las imágenes/escenas**: Unity + Asset Store (opción elegida). El usuario ya tiene cuenta de Unity. Se compran/descargan packs de props y muebles, se montan las escenas en el Editor de Unity (esto es trabajo manual de UI que el usuario debe hacer en el Editor), y se reutilizan 3–4 salas base para muchos niveles cambiando cámara, iluminación y disposición de props. Se descartó generar imágenes con IA o de forma aleatoria (no da la calidad/coherencia necesaria para este género).
- Yo puedo escribir la lógica de juego en C# (detección de toques, sistema de pistas, estructura de niveles) para que el usuario solo tenga que ir metiendo los assets en el Editor.
- **Temática**: sigue sin decidirse. Candidatas: mansión/detective (la del prototipo de muestra), desván familiar/herencia, hotel abandonado, tienda de antigüedades (esta última encaja muy bien con lo de coleccionar cartas del JigsawCard).
- **Referencia del modelo de juego (no de la tematica)**: `docs/references/idea6-hidden-objects-reference.jpg` — captura de "Search It: Hidden Objects". Es el modelo de interfaz/búsqueda a seguir cuando se construya esta idea:
  - Escena ilustrada, muy detallada y recargada (aqui una oficina; la nuestra sera otra tematica), vista isometrica/elevada con muchos personajes y objetos de fondo para que los objetivos se camuflen entre el ruido visual.
  - Los objetos a encontrar se listan arriba en 2-3 filas de iconos pequeños en cuadros redondeados (no como texto), a modo de checklist visual permanente mientras juegas, no un panel aparte.
  - Cronometro visible arriba a la izquierda (presion de tiempo, no es libre).
  - Boton "Jugar" fijo abajo para entrar a la partida.
  - Es tal cual la mecanica de la idea 6 que ya teniamos pensada; esta imagen es solo la referencia visual/UX concreta a imitar en la disposicion (checklist arriba en iconos, escena abajo, temporizador) cuando toque construirlo.
