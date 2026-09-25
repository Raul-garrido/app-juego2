# Sala de Juegos

Hub de juegos con login por nombre y clasificación compartida (tiempo + estrellas), sin necesidad de cuenta de claude.ai. Web estática (sin build) + Supabase como base de datos.

## Puesta en marcha

1. **Supabase**: crea un proyecto en [supabase.com](https://supabase.com), abre el SQL Editor y ejecuta `supabase-schema.sql`.
2. En **Project Settings → API**, copia la "Project URL" y la clave "anon public".
3. Edita `index.html` y sustituye:
   ```js
   const SUPABASE_URL = 'REPLACE_WITH_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'REPLACE_WITH_SUPABASE_ANON_KEY';
   ```
4. **Vercel**: importa este repositorio, y en la configuración del proyecto pon **Root Directory** = `sala-de-juegos`. Framework Preset: "Other" (ya lo fija `vercel.json`). Sin build command, sin variables de entorno necesarias.
5. Deploy. Listo — cualquiera con el enlace puede jugar y aparecer en la clasificación, sin cuenta de ningún tipo.

## Añadir un juego nuevo

1. Copia el HTML del juego (build de una sola página) a `games/<id>.html`.
2. En `index.html`, añade una entrada a `GAMES` (id, título, subtítulo, icono, color, `file`).
3. Añade un adaptador en `ADAPTERS[id]` con:
   - `read(win)`: lee el estado del juego desde su API global de depuración (`win.__loQueSea`) y devuelve `{ status: 'playing'|'won'|'lost', level, raw, api }`.
   - `computeStars(ctx)`: devuelve 1-3 a partir de `ctx.raw` (o de lo que el propio juego calcule).
4. Si el juego no expone una API global tipo `window.__nombre`, dímelo — hay que revisar ese caso aparte.

## Notas

- El acceso a la tabla `scores` es público (lectura y escritura) mediante políticas de Row Level Security abiertas — suficiente para un marcador entre amigos/familia, no pensado para resistir manipulación maliciosa.
- Cada fila de `scores` guarda el MEJOR resultado (más estrellas, luego menos tiempo) por jugador+juego+nivel — jugar peor una segunda vez no empeora tu marca.
