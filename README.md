# my-first-website

Pequeña app Next.js para practicar registro/login con JWT. Incluye frontend de auth y endpoints API simples para guardar usuarios en disco, emitir tokens y mostrar estado en una terminal de depuración.

## Ejecutar en local

```bash
npm install
npm run dev -- --hostname 0.0.0.0 --port 3002
```

Abre `http://localhost:3002`. Si tu backend/API vive en otro host o puerto, exporta `NEXT_PUBLIC_API_BASE_URL` antes de `npm run dev`.

## Rutas útiles

- `/` landing con botones Sign in / Sign up y terminal que muestra usuarios y último token (`/api/debug`).
- `/register` registro; al éxito vuelve a `/`.
- `/login` login; al éxito guarda token en `localStorage` y redirige a `/interno`.
- `/interno` imagen del gato, protegido por token en `localStorage`, con botón de sign out.
- `/api/debug/wipe` limpia usuarios/token guardados en `data/`.

## Licencia

MIT (ver `LICENSE`).
