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

Trabajando en el **prototipo de la idea 1** ("Saca la ficha") para probarla primero por ser la más sencilla (no depende de assets externos, solo lógica de juego).

## Pendiente — retomar cuando se pida

**Idea 6 (Encuentra el objeto / estilo June's Journey) + minijuego de la idea 7 dentro.**

Decisiones ya tomadas para cuando se retome:
- **Origen de las imágenes/escenas**: Unity + Asset Store (opción elegida). El usuario ya tiene cuenta de Unity. Se compran/descargan packs de props y muebles, se montan las escenas en el Editor de Unity (esto es trabajo manual de UI que el usuario debe hacer en el Editor), y se reutilizan 3–4 salas base para muchos niveles cambiando cámara, iluminación y disposición de props. Se descartó generar imágenes con IA o de forma aleatoria (no da la calidad/coherencia necesaria para este género).
- Yo puedo escribir la lógica de juego en C# (detección de toques, sistema de pistas, estructura de niveles) para que el usuario solo tenga que ir metiendo los assets en el Editor.
- **Temática**: sigue sin decidirse. Candidatas: mansión/detective (la del prototipo de muestra), desván familiar/herencia, hotel abandonado, tienda de antigüedades (esta última encaja muy bien con lo de coleccionar cartas del JigsawCard).
