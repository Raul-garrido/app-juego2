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
- **Sistema herramienta + color de variante**: 14 formas base (martillo, destornillador, llave inglesa, sierra, tornillo, nivel, alicates, taladro eléctrico, amoladora, llave Allen, cinta métrica, brocha, sierra de arco, pistola de pegamento) como iconos SVG reales, cada una con una parte "mango" recoloreable (6 colores). Cuando se agotan las 14 formas, el generador empieza a reutilizar la misma forma con otro color de mango — es un tipo de ficha distinto a efectos de juego. Da hasta 84 tipos de ficha combinando formas × colores. Añadir una herramienta más es solo una función de forma nueva en `ToolIcon.tsx`, no toca el resto del juego.
- **Muchos niveles resuelto**: `generateLevel(levelIndex)` genera niveles infinitos de forma procedural (no hay niveles hechos a mano). La dificultad sube con dos mandos independientes: nº de tipos de herramienta en juego y nº de capas apiladas por hueco. Se prueba en consola que genera correctamente hasta nivel 150+ sin romperse.
- **Acabado 3D real**: las fichas ya no son un chip plano — bisel marfil con degradado, sombra dura de "grosor" y brillo superior (CSS), y cada icono usa degradados propios (metal y color de mango) en vez de relleno plano, para que se vea como una pieza física, no un dibujo plano. Hay una vista de repaso en `/?gallery` que pinta todas las herramientas x todos los colores para revisarlas de un vistazo antes de tocar nada.
- **Pendiente de pulir**: el acabado ya es 3D pero sigue siendo vectorial (no texturas/fotos); si se quiere ir más lejos (madera, metal con reflejos reales), sería sustituir los `fill` por imágenes/texturas dentro de `ToolIcon.tsx` sin tocar la lógica del juego, que sigue desacoplada de la vista.

## Pendiente — retomar cuando se pida

**Idea 6 (Encuentra el objeto / estilo June's Journey) + minijuego de la idea 7 dentro.**

Decisiones ya tomadas para cuando se retome:
- **Origen de las imágenes/escenas**: Unity + Asset Store (opción elegida). El usuario ya tiene cuenta de Unity. Se compran/descargan packs de props y muebles, se montan las escenas en el Editor de Unity (esto es trabajo manual de UI que el usuario debe hacer en el Editor), y se reutilizan 3–4 salas base para muchos niveles cambiando cámara, iluminación y disposición de props. Se descartó generar imágenes con IA o de forma aleatoria (no da la calidad/coherencia necesaria para este género).
- Yo puedo escribir la lógica de juego en C# (detección de toques, sistema de pistas, estructura de niveles) para que el usuario solo tenga que ir metiendo los assets en el Editor.
- **Temática**: sigue sin decidirse. Candidatas: mansión/detective (la del prototipo de muestra), desván familiar/herencia, hotel abandonado, tienda de antigüedades (esta última encaja muy bien con lo de coleccionar cartas del JigsawCard).
