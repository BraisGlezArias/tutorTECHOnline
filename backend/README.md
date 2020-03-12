Express: Cómo crear un nuevo endpoint

1. Crear función controladora tonta.

2. Crear el router conectando la función controladora y si es un endpoint para un usuario logueado, conectar el middleware de autenticación.

3. Actualizar el index.js de los routers para exportar el nuevo router (si no lo está ya).

4. Conectar el nuevo router (la primera vez) a express.

Express: Qué tiene que hacer la función controladora. Caso típico.

1. Validar datos

2. Lógica negocio: Queries BBDD / Subir archivo / Enviar email

3. Mapper de datos (transformar algo de A a B si procede)

4. Devolver datos al usuario