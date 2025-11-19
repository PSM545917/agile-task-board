/**
 * ============================================
 * AGILE TASK BOARD - METRICS DASHBOARD
 * ============================================
 * Dashboard de métricas con Chart.js
 * - Burndown Chart
 * - Tareas por persona
 * - Tareas por estado
 * - KPIs principales
 * ============================================
 */

// ============================================
// CONFIGURACIÓN Y CONSTANTES
// ============================================
const STORAGE_KEY = 'agile_tasks_board';

const PEOPLE = [
    { name: 'Ana Gómez', initials: 'AG', color: '#ec4899' },
    { name: 'Luis Martínez', initials: 'LM', color: '#3b82f6' },
    { name: 'Marta Ruiz', initials: 'MR', color: '#8b5cf6' },
    { name: 'Pablo Schmidt', initials: 'PS', color: '#10b981' },
    { name: 'Sofía López', initials: 'SL', color: '#f59e0b' }
];

// ============================================
// ESTADO DE LA APLICACIÓN
// ============================================
let tasks = [];
let charts = {};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Iniciando Dashboard de Métricas...');
    
    // Cargar tareas del LocalStorage
    loadTasksFromStorage();
    
    // Calcular y mostrar KPIs
    updateKPIs();
    
    // Generar gráficos
    initializeCharts();
    
    // Mostrar tabla de tareas antiguas
    renderOldTasksTable();
    
    console.log('✅ Dashboard listo');
});

// ============================================
// GESTIÓN DE DATOS
// ============================================

/**
 * Carga las tareas desde LocalStorage
 */
function loadTasksFromStorage() {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            console.log(`📦 Cargadas ${tasks.length} tareas`);
        } else {
            tasks = [];
            console.warn('⚠️ No hay tareas en el storage');
        }
    } catch (error) {
        console.error('❌ Error al cargar tareas:', error);
        tasks = [];
    }
}

// ============================================
// CÁLCULO DE KPIs
// ============================================

/**
 * Actualiza los KPIs principales
 */
function updateKPIs() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Velocity = tareas completadas en los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentCompleted = tasks.filter(t => {
        if (t.status !== 'done') return false;
        const taskDate = new Date(t.createdAt);
        return taskDate >= sevenDaysAgo;
    }).length;
    const velocity = (recentCompleted / 7).toFixed(1);
    
    // Actualizar DOM
    document.getElementById('kpiTotalTasks').textContent = totalTasks;
    document.getElementById('kpiCompletedTasks').textContent = completedTasks;
    document.getElementById('kpiCompletionRate').textContent = `${completionRate}%`;
    document.getElementById('kpiVelocity').textContent = velocity;
}

// ============================================
// GENERACIÓN DE GRÁFICOS
// ============================================

/**
 * Inicializa todos los gráficos
 */
function initializeCharts() {
    createBurndownChart();
    createTasksByPersonChart();
    createTasksByStatusChart();
}

/**
 * Gráfico de Burndown (línea)
 */
function createBurndownChart() {
    const ctx = document.getElementById('burndownChart');
    
    // Generar datos de los últimos 7 días
    const labels = [];
    const data = [];
    const totalTasks = tasks.length;
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
        
        // Simular burndown: disminución progresiva
        // En producción, esto vendría de datos históricos reales
        const remaining = totalTasks - Math.floor((6 - i) * (totalTasks * 0.15));
        data.push(Math.max(0, remaining));
    }
    
    charts.burndown = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tareas Restantes',
                data: data,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Gráfico de Tareas por Persona (barras)
 */
function createTasksByPersonChart() {
    const ctx = document.getElementById('tasksByPersonChart');
    
    // Contar tareas por persona
    const taskCounts = {};
    const colors = {};
    
    PEOPLE.forEach(person => {
        taskCounts[person.name] = 0;
        colors[person.name] = person.color;
    });
    
    tasks.forEach(task => {
        if (task.assignee && taskCounts.hasOwnProperty(task.assignee)) {
            taskCounts[task.assignee]++;
        }
    });
    
    const labels = Object.keys(taskCounts);
    const data = Object.values(taskCounts);
    const backgroundColors = labels.map(name => colors[name]);
    
    charts.tasksByPerson = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(name => name.split(' ')[0]), // Solo primer nombre
            datasets: [{
                label: 'Tareas Asignadas',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: backgroundColors.map(c => c + 'cc')
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        title: (items) => labels[items[0].dataIndex],
                        label: (item) => `${item.parsed.y} tareas`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Gráfico de Tareas por Estado (donut)
 */
function createTasksByStatusChart() {
    const ctx = document.getElementById('tasksByStatusChart');
    
    // Contar tareas por estado
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const inProgressCount = tasks.filter(t => t.status === 'inprogress').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    
    charts.tasksByStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{
                data: [todoCount, inProgressCount, doneCount],
                backgroundColor: [
                    '#3b82f6', // Azul
                    '#f59e0b', // Naranja
                    '#10b981'  // Verde
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 13
                        },
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: (item) => {
                            const total = todoCount + inProgressCount + doneCount;
                            const percentage = total > 0 ? Math.round((item.parsed / total) * 100) : 0;
                            return `${item.label}: ${item.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// TABLA DE TAREAS ANTIGUAS
// ============================================

/**
 * Renderiza la tabla de tareas más antiguas sin completar
 */
function renderOldTasksTable() {
    const tbody = document.getElementById('oldTasksBody');
    
    // Filtrar tareas no completadas
    const incompleteTasks = tasks.filter(t => t.status !== 'done');
    
    // Ordenar por fecha de creación (más antiguas primero)
    const sortedTasks = incompleteTasks.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });
    
    // Tomar solo las 5 más antiguas
    const oldestTasks = sortedTasks.slice(0, 5);
    
    if (oldestTasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #64748b;">🎉 ¡No hay tareas pendientes antiguas!</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    oldestTasks.forEach(task => {
        const tr = document.createElement('tr');
        
        // Calcular días activos
        const createdDate = new Date(task.createdAt);
        const today = new Date();
        const daysActive = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        
        // Estado con color
        const statusMap = {
            'todo': { text: 'To Do', color: '#3b82f6' },
            'inprogress': { text: 'In Progress', color: '#f59e0b' },
            'done': { text: 'Done', color: '#10b981' }
        };
        const status = statusMap[task.status];
        
        // Etiquetas
        let tagsHTML = '';
        if (task.tags && task.tags.length > 0) {
            tagsHTML = task.tags.map(tag => {
                const tagClass = tag.toLowerCase();
                return `<span class="table-tag tag-${tagClass}">${tag}</span>`;
            }).join(' ');
        } else {
            tagsHTML = '<span style="color: #94a3b8;">Sin etiquetas</span>';
        }
        
        tr.innerHTML = `
            <td><strong>${escapeHtml(task.title)}</strong></td>
            <td>${task.assignee ? escapeHtml(task.assignee) : '<span style="color: #94a3b8;">Sin asignar</span>'}</td>
            <td><span class="status-badge" style="background: ${status.color};">${status.text}</span></td>
            <td><span class="days-badge ${daysActive > 7 ? 'days-warning' : ''}">${daysActive} días</span></td>
            <td>${tagsHTML}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Escapa caracteres HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}