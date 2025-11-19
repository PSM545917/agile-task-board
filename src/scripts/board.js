/**
 * ============================================
 * AGILE TASK BOARD - BOARD MANAGER
 * ============================================
 * Gestión completa del tablero Kanban con:
 * - Drag & Drop nativo HTML5
 * - Persistencia en LocalStorage
 * - CRUD de tareas
 * - Contadores dinámicos
 * ============================================
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================
const STORAGE_KEY = 'agile_tasks_board';
const COLUMNS = ['todo', 'inprogress', 'done'];
const PEOPLE = [
    { name: 'Ana Gómez', initials: 'AG', color: 'ana' },
    { name: 'Luis Martínez', initials: 'LM', color: 'luis' },
    { name: 'Marta Ruiz', initials: 'MR', color: 'marta' },
    { name: 'Pablo Schmidt', initials: 'PS', color: 'pablo' },
    { name: 'Sofía López', initials: 'SL', color: 'sofia' }
];

const TAGS = ['Bug', 'Feature', 'Documentation', 'Testing', 'Urgente'];

// Estado de filtros
let activeFilters = {
    person: '',
    tag: ''
};

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================
let tasks = [];
let draggedElement = null;

// ============================================
// INICIALIZACIÓN DE LA APP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Agile Task Board...');
    
    // Cargar tareas del LocalStorage
    loadTasksFromStorage();
    
    // Renderizar tablero inicial
    renderBoard();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('✅ Aplicación lista');
});

// ============================================
// GESTIÓN DE LOCALSTORAGE
// ============================================

/**
 * Carga las tareas desde LocalStorage
 */
function loadTasksFromStorage() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            console.log(`📦 Cargadas ${tasks.length} tareas del storage`);
        } else {
            // Si no hay tareas, crear algunas de ejemplo
            tasks = createSampleTasks();
            saveTasksToStorage();
        }
    } catch (error) {
        console.error('❌ Error al cargar tareas:', error);
        tasks = [];
    }
}

/**
 * Guarda las tareas en LocalStorage
 */
function saveTasksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        console.log('💾 Tareas guardadas en LocalStorage');
    } catch (error) {
        console.error('❌ Error al guardar tareas:', error);
    }
}

/**
 * Crea tareas de ejemplo para primera carga
 */
function createSampleTasks() {
    return [
        {
            id: generateId(),
            title: 'Configurar repositorio Git',
            description: 'Crear repositorio y estructura de carpetas inicial',
            status: 'done',
            assignee: 'Ana Gómez',
            tags: ['Documentation'],
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: 'Implementar tablero Kanban',
            description: 'Crear las tres columnas con drag & drop funcional',
            status: 'inprogress',
            assignee: 'Luis Martínez',
            tags: ['Feature', 'Urgente'],
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: 'Añadir autenticación',
            description: 'Sistema de login básico con LocalStorage',
            status: 'todo',
            assignee: 'Marta Ruiz',
            tags: ['Feature'],
            createdAt: new Date().toISOString()
        }
    ];
}

// ============================================
// RENDERIZADO DEL TABLERO
// ============================================

/**
 * Renderiza todo el tablero con las tareas actuales
 */
function renderBoard() {
    // Limpiar columnas
    COLUMNS.forEach(column => {
        const columnElement = document.getElementById(`column-${column}`);
        if (columnElement) {
            columnElement.innerHTML = '';
        }
    });
    
    // Renderizar cada tarea en su columna correspondiente
    tasks.forEach(task => {
        renderTask(task);
    });
    
    // Actualizar contadores
    updateCounters();
    
    // Configurar drag & drop en columnas
    setupDragAndDrop();
}

/**
 * Renderiza una tarea individual en su columna
 */
function renderTask(task) {
    const columnElement = document.getElementById(`column-${task.status}`);
    if (!columnElement) return;


    if (!passesFilters(task)) {
        return; // No renderizar si no pasa los filtros
    }
    
    // Crear elemento de tarjeta
    const taskCard = document.createElement('div');
    taskCard.className = 'task-card';
    taskCard.draggable = true;
    taskCard.dataset.taskId = task.id;
    
    // Formatear fecha
    const date = new Date(task.createdAt);
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });



    // Generar HTML de asignado
    let assigneeHTML = '';
    if (task.assignee) {
        const person = PEOPLE.find(p => p.name === task.assignee);
        if (person) {
            assigneeHTML = `
                <div class="task-assignee">
                    <div class="assignee-avatar assignee-${person.color}">
                        ${person.initials}
                    </div>
                    <span>${escapeHtml(person.name)}</span>
                </div>
            `;
        }
    }
    
    // Generar HTML de etiquetas
    let tagsHTML = '';
    if (task.tags && task.tags.length > 0) {
        tagsHTML = '<div class="task-tags">';
        task.tags.forEach(tag => {
            const tagClass = tag.toLowerCase();
            tagsHTML += `<span class="task-tag tag-${tagClass}">${escapeHtml(tag)}</span>`;
        });
        tagsHTML += '</div>';
    }
    
    // Construir HTML de la tarjeta
    taskCard.innerHTML = `
        <div class="task-card-header">
            <h3 class="task-title">${escapeHtml(task.title)}</h3>
            <span class="task-id">#${task.id.slice(0, 6)}</span>
        </div>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
        ${assigneeHTML}
        ${tagsHTML}
        <div class="task-footer">
            <span class="task-date">📅 ${formattedDate}</span>
            <button class="delete-task" data-task-id="${task.id}" title="Eliminar tarea">🗑️</button>
        </div>
    `;
    
    // Event listeners para drag & drop
    taskCard.addEventListener('dragstart', handleDragStart);
    taskCard.addEventListener('dragend', handleDragEnd);
    
    // Event listener para eliminar
    const deleteBtn = taskCard.querySelector('.delete-task');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(task.id);
    });
    
    // Añadir a la columna
    columnElement.appendChild(taskCard);
    
    
}

// ============================================
// DRAG & DROP - EVENTOS HTML5
// ============================================

/**
 * Configura los event listeners de drag & drop en las columnas
 */
function setupDragAndDrop() {
    COLUMNS.forEach(column => {
        const columnElement = document.getElementById(`column-${column}`);
        if (columnElement) {
            columnElement.addEventListener('dragover', handleDragOver);
            columnElement.addEventListener('drop', handleDrop);
            columnElement.addEventListener('dragleave', handleDragLeave);
            columnElement.addEventListener('dragenter', handleDragEnter);
        }
    });
}

/**
 * Evento al comenzar a arrastrar una tarea
 */
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    console.log('🎯 Arrastrando tarea:', e.target.dataset.taskId);
}

/**
 * Evento al terminar de arrastrar
 */
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    
    // Remover estilos de todas las columnas
    COLUMNS.forEach(column => {
        const columnElement = document.getElementById(`column-${column}`);
        if (columnElement) {
            columnElement.classList.remove('drag-over');
        }
    });
    
    draggedElement = null;
}

/**
 * Evento al arrastrar sobre una columna
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necesario para permitir el drop
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

/**
 * Evento al entrar en una columna
 */
function handleDragEnter(e) {
    if (e.target.classList.contains('column-content')) {
        e.target.classList.add('drag-over');
    }
}

/**
 * Evento al salir de una columna
 */
function handleDragLeave(e) {
    if (e.target.classList.contains('column-content')) {
        e.target.classList.remove('drag-over');
    }
}

/**
 * Evento al soltar la tarea en una columna
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Evita redirecciones
    }
    
    e.preventDefault();
    
    // Obtener la columna destino
    const dropColumn = e.target.closest('.column-content');
    if (!dropColumn || !draggedElement) return;
    
    const newStatus = dropColumn.dataset.column;
    const taskId = draggedElement.dataset.taskId;
    
    // Actualizar estado de la tarea
    updateTaskStatus(taskId, newStatus);
    
    // Remover clase visual
    dropColumn.classList.remove('drag-over');
    
    console.log(`✅ Tarea movida a: ${newStatus}`);
    
    return false;
}

// ============================================
// GESTIÓN DE TAREAS (CRUD)
// ============================================

/**
 * Crea una nueva tarea
 */
function createTask(title, description, assignee, tags) {
    const newTask = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        assignee: assignee || '',
        tags: tags || [],
        status: 'todo',
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasksToStorage();
    renderBoard();
    
    console.log('✨ Nueva tarea creada:', newTask.id);
}

/**
 * Actualiza el estado de una tarea
 */
function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        saveTasksToStorage();
        renderBoard();
    }
}

/**
 * Elimina una tarea
 */
function deleteTask(taskId) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToStorage();
        renderBoard();
        console.log('🗑️ Tarea eliminada:', taskId);
    }
}

// ============================================
// MODAL Y FORMULARIO
// ============================================

/**
 * Configura todos los event listeners de la aplicación
 */
function setupEventListeners() {
    // Botón nueva tarea
    const addTaskBtn = document.getElementById('addTaskBtn');
    addTaskBtn.addEventListener('click', openModal);
    
    // Cerrar modal
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const modal = document.getElementById('taskModal');
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Envío del formulario
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', handleFormSubmit);
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

/**
 * Abre el modal de nueva tarea
 */
function openModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.add('active');
    document.getElementById('taskTitle').focus();
}

/**
 * Cierra el modal y limpia el formulario
 */
function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('active');
    document.getElementById('taskForm').reset();
}

/**
 * Maneja el envío del formulario de nueva tarea
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const assignee = document.getElementById('taskAssignee').value;
    
    // Obtener etiquetas seleccionadas
    const tagCheckboxes = document.querySelectorAll('input[name="tags"]:checked');
    const tags = Array.from(tagCheckboxes).map(cb => cb.value);
    
    if (title.trim()) {
        createTask(title, description, assignee, tags);
        closeModal();
    }
}

// ============================================
// CONTADORES Y ESTADÍSTICAS
// ============================================

/**
 * Actualiza los contadores de tareas en cada columna
 */
function updateCounters() {
    COLUMNS.forEach(column => {
        const count = tasks.filter(t => t.status === column).length;
        const counterElement = document.getElementById(`count-${column}`);
        if (counterElement) {
            counterElement.textContent = count;
        }
    });
    
    // Actualizar contador total
    const totalElement = document.getElementById('totalTasks');
    if (totalElement) {
        totalElement.textContent = tasks.length;
    }
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un ID único para las tareas
 */
function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Limpia completamente el LocalStorage (útil para testing)
 */
function clearAllData() {
    if (confirm('⚠️ ¿Estás seguro? Esto eliminará TODAS las tareas.')) {
        localStorage.removeItem(STORAGE_KEY);
        tasks = [];
        renderBoard();
        console.log('🧹 Datos limpiados');
    }
}


// ============================================
// SISTEMA DE FILTROS
// ============================================

/**
 * Verifica si una tarea pasa los filtros activos
 */
function passesFilters(task) {
    // Filtro por persona
    if (activeFilters.person && task.assignee !== activeFilters.person) {
        return false;
    }
    
    // Filtro por etiqueta
    if (activeFilters.tag && (!task.tags || !task.tags.includes(activeFilters.tag))) {
        return false;
    }
    
    return true;
}

/**
 * Aplica filtros y re-renderiza el tablero
 */
function applyFilters() {
    const personFilter = document.getElementById('filterPerson').value;
    const tagFilter = document.getElementById('filterTag').value;
    
    activeFilters.person = personFilter;
    activeFilters.tag = tagFilter;
    
    renderBoard();
    
    console.log('🔍 Filtros aplicados:', activeFilters);
}

/**
 * Limpia todos los filtros
 */
function clearFilters() {
    activeFilters.person = '';
    activeFilters.tag = '';
    
    document.getElementById('filterPerson').value = '';
    document.getElementById('filterTag').value = '';
    
    renderBoard();
    
    console.log('🧹 Filtros limpiados');
}

/**
 * Configura los event listeners de filtros
 */
function setupFilterListeners() {
    const personFilter = document.getElementById('filterPerson');
    const tagFilter = document.getElementById('filterTag');
    const clearBtn = document.getElementById('clearFilters');
    
    personFilter.addEventListener('change', applyFilters);
    tagFilter.addEventListener('change', applyFilters);
    clearBtn.addEventListener('click', clearFilters);
}

// Exponer función de limpieza en consola para desarrollo
window.clearAllData = clearAllData;

console.log('💡 Tip: Ejecuta clearAllData() en la consola para limpiar todos los datos');