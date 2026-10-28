# CuantoEs Califica — Panel Administrativo v1

**Ruta final:** `https://www.cuantoes.com.py/admin/califica`

Versión inicial para alta y edición de comercios, configuración de los siete horarios, vinculación manual de Storage / Google Sheets, planes y vencimientos, y entrega de enlaces y mensajes de WhatsApp.

## 1. Archivos a copiar

Copiá el contenido de este ZIP en la **raíz del proyecto** `cuanto-es`, respetando rutas y sobrescribiendo únicamente este archivo que ya existe:

- `components/ConditionalNavbar.tsx` — cambio mínimo para ocultar navbar en el panel.

Todos los demás son archivos **nuevos**:

- `lib/califica-admin-server.ts`
- `app/admin/califica/layout.tsx`
- `app/admin/califica/page.tsx`
- `app/api/admin/califica/session/route.ts`
- `app/api/admin/califica/businesses/route.ts`
- `app/api/admin/califica/businesses/[id]/route.ts`

**No reemplazar** `lib/supabase.ts`, `app/layout.tsx`, el formulario público, RPC existente ni las otras aplicaciones del sitio.

**No hace falta instalar dependencias nuevas ni ejecutar SQL.** El código se basa en `@supabase/supabase-js`, Next.js y `lucide-react` que ya existen en `package.json` de la rama `main` consultada el 23/10/2026.

## 2. Crear el usuario administrativo en Supabase

1. Entrá al proyecto Supabase de CuantoEs (el mismo que usa Califica).
2. En **Authentication → Users** agregá un usuario mediante la consola, con correo y contraseña segura. Confirmá el correo si el panel lo solicita; el usuario necesita estar confirmado.
3. Copiá el **User UID** (UUID completo). No uses un nombre de usuario ni el correo en la variable de autorización.
4. No habilites registro público ni compartas esta cuenta para que otros administren. El panel solo admite los UID autorizados.

Si ya tenés un usuario en Supabase Auth, podés reutilizarlo obteniendo su UID, siempre que sea una cuenta que administrás y tenga el correo confirmado.

## 3. Variables en Vercel

En **Vercel → tu proyecto → Settings → Environment Variables** (ambiente `Production`), asegurate de contar con:

| Variable | Contenido |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | La URL Supabase que usa el sitio, ya existente. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La clave pública/anon que usa el sitio, ya existente. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave **privilegiada** de Supabase para operaciones administrativas, solo en variables privadas de Vercel. |
| `CALIFICA_ADMIN_UID` | UID UUID del usuario creado en Supabase Auth. |

IMPORTANTE: `SUPABASE_SERVICE_ROLE_KEY` **no** debe comenzar por `NEXT_PUBLIC_`, aparecer en GitHub ni copiarse en el navegador. El código no la expone. Usá únicamente un valor válido y rotado, especialmente si alguna clave anterior fue compartida en conversaciones o documentación.

Podés autorizar varios administradores más adelante, separando UUID por comas en `CALIFICA_ADMIN_UID`; para el piloto te recomiendo uno solo.

En Vercel, el usuario Auth, la service-role key y la anon key deben corresponder al **mismo proyecto Supabase**.

## 4. Subir al repositorio y probar en producción

Tu procedimiento habitual:

```bash
git add app/admin/califica app/api/admin/califica lib/califica-admin-server.ts components/ConditionalNavbar.tsx
git commit -m "Califica: panel administrativo privado v1"
git push origin main
```

Si agregaste las variables de entorno **después** de que Vercel ya compiló el commit, necesitás un **redeploy** para que estén disponibles en ese despliegue.

Visitá:

`https://www.cuantoes.com.py/admin/califica`

Ingresá con el correo y contraseña de Supabase Auth.

## 5. Pruebas recomendadas

1. Sin estar autenticado, abrir la URL del panel. Debe mostrar el login.
2. Probar una cuenta válida **no** incluida en `CALIFICA_ADMIN_UID`: debe denegarse el acceso.
3. Ingresar con el UID permitido: deben aparecer Al Paso y Pizzería Roma si siguen presentes en la misma base.
4. Crear un comercio de prueba **inactivo**, por ejemplo `prueba-califica-v1`.
5. Editarlo y cambiar descripción, horarios, tolerancia, plan y vencimiento. Confirmá que se reflejan.
6. Vincular el ID/URL de un Google Sheet independiente y la URL del logo subido previamente a Supabase Storage.
7. Activar el perfil. Verificar la página pública y su miniatura OG. Comprobar el horario vigente.
8. Probar la calificación y comprobar su llegada **solo** a la planilla de ese comercio tras la ejecución automática del Apps Script.
9. Probar botones de copiar enlace y mensaje de WhatsApp.
10. Cerrar sesión y comprobar que las APIs admin ya no permiten consultas.

**Precaución:** el panel administra datos reales. Primero trabajá con el comercio de prueba; no cambies horarios de Roma/Al Paso hasta concluir la validación.

## 6. Límites actuales de esta versión

- No automatiza la creación del logo ni Google Sheets.
- No crea ni modifica tablas/roles de base de datos.
- No incluye pasarela de pagos ni recordatorios automáticos de vencimiento.
- No permite borrar perfiles ni modificar el slug de un comercio ya creado, para no romper enlaces compartidos.
- La creación y la actualización ejecutan operaciones separadas sobre tablas de comercios y horarios. Si una actualización falla después de guardar los horarios, los cambios de horario pueden quedar aplicados; verificá la ficha y reintentá. Una versión posterior puede ofrecer transacciones mediante una RPC controlada.
- El panel **no** corrige por sí mismo los temas de seguridad de la API pública de opiniones, RPC ni el control anti-spam previamente documentados; deben revisarse antes de cobrar a comercios.
- No configura Supabase Auth de forma automática; se debe crear el usuario administrador una vez desde la consola.

## 7. Solución de problemas

- **Credenciales inválidas**: revisá la contraseña, correo confirmado y que `CALIFICA_ADMIN_UID` sea el UID exacto del mismo Supabase.
- **Error al listar comercios**: verificá `SUPABASE_SERVICE_ROLE_KEY` en Vercel y que pertenezca al mismo proyecto.
- **No se activa el comercio**: primero agregá un ID de Sheets válido. El panel no verifica acceso de Apps Script a la planilla; esa prueba sigue siendo manual.
- **El formulario muestra un horario inválido**: usá formato HH:MM y, si el día está abierto, horarios distintos. `18:00` a `02:00` representa cruce de medianoche.
- **No aparece la variable tras guardarla**: verificar ambiente Production y redeploy.

No compartas claves, contraseñas ni tokens al solicitar ayuda. Podés compartir únicamente mensajes de error sin credenciales.
