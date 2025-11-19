# Product Backlog - Agile Task Board

**Producto:** Agile Task Board  
**Versión:** 1.0  
**Product Owner:** [Tu Nombre]  
**Última actualización:** 18/11/2025

---

## User Story #1: Tablero Kanban con Drag & Drop

**Como** miembro del equipo ágil  
**Quiero** visualizar las tareas en un tablero Kanban con columnas (To Do, In Progress, Done) y moverlas mediante drag & drop  
**Para** gestionar visualmente el flujo de trabajo y actualizar el estado de las tareas de forma intuitiva

### Descripción
Implementar un tablero Kanban visual con tres columnas predefinidas donde las tarjetas de tareas puedan ser arrastradas y soltadas entre columnas para cambiar su estado.

### Criterios de Aceptación
- Mostrar tres columnas: "To Do", "In Progress" y "Done"
- Permitir arrastrar tarjetas de tareas entre columnas
- Actualizar automáticamente el estado de la tarea al soltar en nueva columna
- Persistir los cambios en LocalStorage
- Mostrar feedback visual durante el arrastre (sombra, cursor)
- Prevenir que las tarjetas se pierdan si el drop falla
- Mostrar contador de tareas en cada columna

**Story Points:** 5  
**Prioridad:** Alta

---

## User Story #2: Crear Nuevas Tareas

**Como** miembro del equipo  
**Quiero** crear tareas nuevas con título, descripción y fecha de entrega  
**Para** registrar el trabajo pendiente en el tablero

### Descripción
Desarrollar un formulario modal que permita crear tareas con información básica y agregarlas automáticamente a la columna "To Do".

### Criterios de Aceptación
- Mostrar botón "Nueva Tarea" visible en la interfaz
- Abrir modal con formulario al hacer clic
- Incluir campos: título (obligatorio), descripción (opcional), fecha de entrega (opcional)
- Validar que el título no esté vacío
- Crear tarea con ID único y timestamp de creación
- Agregar tarea a columna "To Do" por defecto
- Guardar en LocalStorage
- Cerrar modal después de crear
- Limpiar formulario para próxima creación

**Story Points:** 3  
**Prioridad:** Alta

---

## User Story #3: Asignar Tareas y Etiquetas con Colores

**Como** Scrum Master o miembro del equipo  
**Quiero** asignar tareas a personas específicas y aplicar etiquetas con colores  
**Para** identificar responsables y categorizar tareas visualmente (frontend, backend, bug, feature, etc.)

### Descripción
Permitir editar tareas para asignar responsables de una lista predefinida y agregar múltiples etiquetas con colores personalizables.

### Criterios de Aceptación
- Añadir campo "Asignado a" en formulario de tarea
- Mostrar lista desplegable con miembros del equipo (mínimo 5 nombres predefinidos)
- Permitir seleccionar un responsable por tarea
- Mostrar avatar o iniciales del responsable en la tarjeta
- Crear sistema de etiquetas con nombre y color
- Permitir agregar múltiples etiquetas por tarea
- Incluir 6 etiquetas predefinidas: Frontend (azul), Backend (verde), Bug (rojo), Feature (morado), Urgente (naranja), Documentación (gris)
- Mostrar etiquetas como badges de colores en la tarjeta
- Guardar cambios en LocalStorage

**Story Points:** 5  
**Prioridad:** Alta

---

## User Story #4: Dashboard de Métricas

**Como** Scrum Master  
**Quiero** visualizar métricas del equipo (burndown, tareas por persona, distribución por estado)  
**Para** monitorear el progreso del sprint y tomar decisiones informadas

### Descripción
Crear una sección de dashboard con gráficos y estadísticas clave del proyecto usando Chart.js desde CDN.

### Criterios de Aceptación
- Crear página/sección "Dashboard" accesible desde menú
- Mostrar gráfico burndown (tareas completadas vs tiempo)
- Mostrar gráfico de barras con tareas por persona asignada
- Mostrar gráfico de pie con distribución de tareas por estado
- Incluir KPIs numéricos: total de tareas, tareas completadas hoy, porcentaje de completitud
- Mostrar tabla con tareas más antiguas sin completar
- Actualizar métricas en tiempo real al cambiar datos
- Diseño responsive para el dashboard

**Story Points:** 8  
**Prioridad:** Media

---

## User Story #5: Autenticación Básica con LocalStorage

**Como** usuario del sistema  
**Quiero** iniciar sesión con usuario y contraseña  
**Para** acceder al tablero de forma personalizada y segura

### Descripción
Implementar sistema de login/logout básico usando LocalStorage con usuarios predefinidos.

### Criterios de Aceptación
- Crear pantalla de login con campos usuario y contraseña
- Validar credenciales contra lista de 3 usuarios predefinidos
- Mostrar mensaje de error si credenciales incorrectas
- Guardar sesión en LocalStorage al autenticar
- Redirigir al tablero después de login exitoso
- Mostrar nombre del usuario logueado en header
- Incluir botón "Cerrar Sesión"
- Limpiar sesión de LocalStorage al cerrar sesión
- Redirigir a login si no hay sesión activa
- Prevenir acceso directo al tablero sin autenticación

**Story Points:** 3  
**Prioridad:** Media

---

## User Story #6: Comentarios en Tareas

**Como** miembro del equipo  
**Quiero** agregar comentarios con timestamp en las tareas  
**Para** comunicar actualizaciones, dudas o información relevante al resto del equipo

### Descripción
Añadir sección de comentarios dentro del detalle de cada tarea con historial temporal.

### Criterios de Aceptación
- Mostrar sección de comentarios al abrir detalle de tarea
- Incluir campo de texto para nuevo comentario
- Guardar comentario con autor, texto y timestamp
- Mostrar lista de comentarios ordenados cronológicamente (más reciente primero)
- Formatear fecha/hora de forma legible
- Permitir comentarios vacíos (no guardar)
- Mostrar indicador visual si tarea tiene comentarios (badge con número)
- Persistir comentarios en LocalStorage
- Mostrar avatar/iniciales del autor del comentario

**Story Points:** 5  
**Prioridad:** Baja

---

## User Story #7: Filtrado y Búsqueda Avanzada

**Como** miembro del equipo  
**Quiero** filtrar tareas por etiqueta, persona asignada o buscar por texto  
**Para** encontrar rápidamente tareas específicas en tableros con muchas tarjetas

### Descripción
Implementar barra de búsqueda y filtros múltiples que se puedan combinar para refinar resultados.

### Criterios de Aceptación
- Agregar barra de búsqueda en header del tablero
- Filtrar tareas en tiempo real al escribir (título y descripción)
- Incluir filtros dropdown: por etiqueta, por persona asignada
- Permitir aplicar múltiples filtros simultáneamente
- Mostrar solo tareas que cumplan todos los criterios activos
- Incluir botón "Limpiar filtros"
- Mantener filtros visibles cuando están activos
- Mostrar mensaje "No se encontraron tareas" si resultado vacío
- Resaltar texto de búsqueda en resultados

**Story Points:** 5  
**Prioridad:** Baja

---

## User Story #8: Modo Oscuro

**Como** usuario de la aplicación  
**Quiero** alternar entre modo claro y oscuro  
**Para** trabajar cómodamente en diferentes condiciones de iluminación y reducir fatiga visual

### Descripción
Implementar theme switcher que permita cambiar entre modo claro y oscuro persistiendo la preferencia.

### Criterios de Aceptación
- Agregar toggle switch en header para cambiar tema
- Definir paleta de colores para modo oscuro (backgrounds, textos, borders)
- Aplicar transición suave al cambiar de tema
- Guardar preferencia en LocalStorage
- Cargar tema guardado al iniciar aplicación
- Detectar preferencia del sistema operativo como tema inicial
- Aplicar tema a todos los componentes (tablero, modales, dashboard)
- Mantener contraste adecuado en modo oscuro para accesibilidad
- Actualizar icono del toggle según tema activo

**Story Points:** 3  
**Prioridad:** Baja

---

## Resumen del Backlog

| ID | Historia | Story Points | Prioridad |
|----|----------|--------------|-----------|
| 1 | Tablero Kanban con Drag & Drop | 5 | Alta |
| 2 | Crear Nuevas Tareas | 3 | Alta |
| 3 | Asignar Tareas y Etiquetas | 5 | Alta |
| 4 | Dashboard de Métricas | 8 | Media |
| 5 | Autenticación Básica | 3 | Media |
| 6 | Comentarios en Tareas | 5 | Baja |
| 7 | Filtrado y Búsqueda | 5 | Baja |
| 8 | Modo Oscuro | 3 | Baja |

**Total Story Points:** 37

---

## Notas Técnicas

### Stack Tecnológico
- HTML5 semántico
- CSS3 (Flexbox/Grid)
- JavaScript Vanilla (ES6+)
- LocalStorage para persistencia
- Chart.js (CDN) para gráficos
- Sin frameworks ni librerías adicionales

### Convenciones
- Usar kebab-case para IDs de tareas
- Formato de fecha: ISO 8601
- Estructura de datos en LocalStorage: JSON serializado
- Validación en frontend antes de guardar

### Definición de Done (DoD)
- Código funcional cumpliendo todos los criterios de aceptación
- Diseño responsive (mobile, tablet, desktop)
- Datos persistiendo correctamente en LocalStorage
- Sin errores en consola del navegador
- Código comentado en secciones complejas