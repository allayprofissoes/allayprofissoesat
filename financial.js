// Financial Module - Carregamento de Receitas do Firebase
// Este arquivo é responsável por carregar e exibir as receitas financeiras

// Importar dependências do Firebase (serão carregadas do script principal)
let firestore, getDocs, collection, doc, getDoc;

// Função para inicializar as dependências do Firebase
function initializeFinancialModule(firestoreInstance, getDocsFunction, collectionFunction, docFunction, getDocFunction, currentSection) {
    firestore = firestoreInstance;
    getDocs = getDocsFunction;
    collection = collectionFunction;
    doc = docFunction;
    getDoc = getDocFunction;
    
    console.log("DEBUG: initializeFinancialModule executada para seção: " + currentSection);

    // Se a seção atual for o dashboard financeiro, carrega o dashboard
    if (currentSection === "financial-dashboard") {
        loadFinancialDashboard();
    }
    
    console.log("DEBUG: Módulo Financeiro inicializado com sucesso!");
}

// Função principal para carregar receitas
async function loadRevenues() {
    try {
        console.log('💰 Carregando receitas do Firebase...');
        
        // Mostrar mensagem de carregamento
        showFinancialMessage("Carregando receitas...", "warning");
        
        // Buscar todas as receitas na coleção "revenue"
        const revenuesSnapshot = await getDocs(collection(firestore, "revenue"));
        
        if (revenuesSnapshot.empty) {
            displayNoRevenues();
            showFinancialMessage("Nenhuma receita encontrada.", "info");
            return;
        }
        
        // Processar dados das receitas
        const revenues = [];
        for (const docSnap of revenuesSnapshot.docs) {
            const revenueData = docSnap.data();
            revenueData.id = docSnap.id;
            
            // Buscar nome do aluno
            try {
                const studentDoc = await getDoc(doc(firestore, "students", revenueData.studentEmail));
                if (studentDoc.exists()) {
                    revenueData.studentName = studentDoc.data().name;
                } else {
                    revenueData.studentName = revenueData.studentEmail;
                }
            } catch (error) {
                console.warn('Erro ao buscar nome do aluno:', error);
                revenueData.studentName = revenueData.studentEmail;
            }
            
            revenues.push(revenueData);
        }
        
        // Ordenar por data (mais recente primeiro)
        revenues.sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate));
        
        // Exibir receitas
        displayRevenues(revenues);
        
        // Calcular e exibir estatísticas
        displayFinancialStats(revenues);
        
        showFinancialMessage(`${revenues.length} receita(s) carregada(s) com sucesso!`, "success");
        
    } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        showFinancialMessage("Erro ao carregar receitas. Tente novamente.", "error");
    }
}

// Função para exibir receitas na tabela
function displayRevenues(revenues) {
    const revenuesContainer = document.getElementById('revenues-list');
    
    if (!revenuesContainer) {
        console.error('Container de receitas não encontrado!');
        return;
    }
    
    // Limpar container
    revenuesContainer.innerHTML = '';
    
    // Criar tabela
    const table = document.createElement('table');
    table.className = 'data-table';
    table.style.width = '100%';
    
    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Data</th>
            <th>Aluno</th>
            <th>Curso</th>
            <th>Valor Original</th>
            <th>Valor Final</th>
            <th>Método Pagamento</th>
            <th>Mídia Origem</th>
        </tr>
    `;
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    
    revenues.forEach(revenue => {
        const row = document.createElement('tr');
        
        // Formatar data
        const enrollmentDate = new Date(revenue.enrollmentDate);
        const formattedDate = enrollmentDate.toLocaleDateString('pt-BR');
        
        // Formatar valores
        const originalValue = (revenue.originalValue || 0).toFixed(2);
        const finalValue = (revenue.finalValue || 0).toFixed(2);
        
        // Calcular desconto se houver
        const discount = revenue.originalValue - revenue.finalValue;
        const discountDisplay = discount > 0 ? ` (-R$ ${discount.toFixed(2)})` : '';
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>
                <div style="font-weight: 500;">${revenue.studentName}</div>
                <div style="font-size: 0.8em; color: var(--text-muted);">${revenue.studentEmail}</div>
            </td>
            <td>${revenue.courseName}</td>
            <td>R$ ${originalValue}</td>
            <td>
                <span style="font-weight: 500; color: var(--success-color);">R$ ${finalValue}</span>
                ${discountDisplay ? `<div style="font-size: 0.8em; color: var(--warning-color);">${discountDisplay}</div>` : ''}
            </td>
            <td>
                <span class="payment-method-badge ${getPaymentMethodClass(revenue.paymentMethod)}">
                    ${revenue.paymentMethod || 'N/A'}
                </span>
            </td>
            <td>
                <span class="media-source-badge ${getMediaSourceClass(revenue.mediaSource)}">
                    ${revenue.mediaSource || 'N/A'}
                </span>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    revenuesContainer.appendChild(table);
}

// Função para exibir quando não há receitas
function displayNoRevenues() {
    const revenuesContainer = document.getElementById('revenues-list');
    
    if (!revenuesContainer) {
        return;
    }
    
    revenuesContainer.innerHTML = `
        <div style="text-align: center; padding: var(--spacing-xl); color: var(--text-muted);">
            <i class="fas fa-chart-line" style="font-size: 3em; margin-bottom: var(--spacing-md); opacity: 0.5;"></i>
            <h3 style="margin-bottom: var(--spacing-sm);">Nenhuma Receita Encontrada</h3>
            <p>As receitas aparecerão aqui quando os alunos forem matriculados em cursos.</p>
        </div>
    `;
}

// Função para calcular e exibir estatísticas financeiras
function displayFinancialStats(revenues) {
    // Calcular totais
    const totalRevenue = revenues.reduce((sum, revenue) => sum + (revenue.finalValue || 0), 0);
    const totalOriginalValue = revenues.reduce((sum, revenue) => sum + (revenue.originalValue || 0), 0);
    const totalDiscount = totalOriginalValue - totalRevenue;
    
    // Calcular receitas por mês atual
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentMonthRevenues = revenues.filter(revenue => {
        const revenueDate = new Date(revenue.enrollmentDate);
        return revenueDate.getMonth() + 1 === currentMonth && revenueDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = currentMonthRevenues.reduce((sum, revenue) => sum + (revenue.finalValue || 0), 0);
    
    // Contar matrículas por método de pagamento
    const paymentMethods = {};
    revenues.forEach(revenue => {
        const method = revenue.paymentMethod || 'N/A';
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
    
    // Atualizar elementos de estatísticas se existirem
    updateStatElement('total-revenue', `R$ ${totalRevenue.toFixed(2)}`);
    updateStatElement('monthly-revenue', `R$ ${monthlyRevenue.toFixed(2)}`);
    updateStatElement('total-enrollments', revenues.length);
    updateStatElement('total-discount', `R$ ${totalDiscount.toFixed(2)}`);
    
    // Exibir estatísticas detalhadas
    displayDetailedStats(revenues, paymentMethods);
}

// Função para atualizar elemento de estatística
function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// Função para exibir estatísticas detalhadas
function displayDetailedStats(revenues, paymentMethods) {
    const statsContainer = document.getElementById('financial-stats-details');
    
    if (!statsContainer) {
        return;
    }
    
    // Agrupar receitas por mídia de origem
    const mediaSources = {};
    revenues.forEach(revenue => {
        const source = revenue.mediaSource || 'N/A';
        mediaSources[source] = (mediaSources[source] || 0) + (revenue.finalValue || 0);
    });
    
    // Criar gráfico simples de métodos de pagamento
    const paymentMethodsHtml = Object.entries(paymentMethods)
        .map(([method, count]) => `
            <div class="stat-item">
                <span class="stat-label">${method}:</span>
                <span class="stat-value">${count} matrículas</span>
            </div>
        `).join('');
    
    // Criar gráfico simples de mídias de origem
    const mediaSourcesHtml = Object.entries(mediaSources)
        .map(([source, total]) => `
            <div class="stat-item">
                <span class="stat-label">${source}:</span>
                <span class="stat-value">R$ ${total.toFixed(2)}</span>
            </div>
        `).join('');
    
    statsContainer.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h4><i class="fas fa-credit-card"></i> Métodos de Pagamento</h4>
                ${paymentMethodsHtml}
            </div>
            <div class="stat-card">
                <h4><i class="fas fa-bullhorn"></i> Receitas por Mídia</h4>
                ${mediaSourcesHtml}
            </div>
        </div>
    `;
}

// Função para obter classe CSS do método de pagamento
function getPaymentMethodClass(method) {
    switch (method?.toLowerCase()) {
        case 'pix':
            return 'payment-pix';
        case 'dinheiro':
            return 'payment-cash';
        case 'cartao':
            return 'payment-card';
        default:
            return 'payment-default';
    }
}

// Função para obter classe CSS da mídia de origem
function getMediaSourceClass(source) {
    switch (source?.toLowerCase()) {
        case 'facebook':
            return 'media-facebook';
        case 'instagram':
            return 'media-instagram';
        case 'google':
            return 'media-google';
        case 'indicacao':
            return 'media-referral';
        default:
            return 'media-default';
    }
}

// Função para exibir mensagens
function showFinancialMessage(message, type) {
    const messageElement = document.getElementById('financial-message');
    
    if (!messageElement) {
        console.log(`📊 ${message}`);
        return;
    }
    
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = "flex";
    
    // Auto-hide success and info messages
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            messageElement.style.display = "none";
        }, 5000);
    }
}

// Função para filtrar receitas por período
function filterRevenuesByPeriod(period) {
    console.log(`🔍 Filtrando receitas por período: ${period}`);
    // Esta função pode ser expandida para filtrar por diferentes períodos
    loadRevenues(); // Por enquanto, recarrega todas as receitas
}

// Função para exportar dados (placeholder)
function exportRevenueData() {
    console.log('📤 Exportando dados financeiros...');
    showFinancialMessage("Funcionalidade de exportação em desenvolvimento.", "info");
}

// Tornar funções disponíveis globalmente
window.loadRevenues = loadRevenues;
window.initializeFinancialModule = initializeFinancialModule;
window.filterRevenuesByPeriod = filterRevenuesByPeriod;
window.exportRevenueData = exportRevenueData;

console.log('💰 Módulo Financeiro carregado com sucesso!');



// ===== DASHBOARD FINANCEIRO =====

// Variáveis globais para os gráficos
let revenueExpenseChart = null;
let expenseDistributionChart = null;

// Função principal para carregar o dashboard financeiro
async function loadFinancialDashboard() {
    console.log("DEBUG: loadFinancialDashboard executada.");
    try {
        console.log('📊 Carregando dashboard financeiro...');
        
        // Mostrar mensagem de carregamento
        showDashboardMessage("Carregando dashboard financeiro...", "info");
        
        // Definir mês e ano atual como padrão
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        // Definir valores padrão nos seletores
        document.getElementById('dashboard-month-select').value = currentMonth;
        document.getElementById('dashboard-year-select').value = currentYear;
        
        // Carregar dados do dashboard
        await updateDashboardByMonth();
        
        showDashboardMessage("Dashboard carregado com sucesso!", "success");
        
    } catch (error) {
        console.error('Erro ao carregar dashboard financeiro:', error);
        showDashboardMessage("Erro ao carregar dashboard financeiro: " + error.message, "error");
    }
}

// Função para atualizar dashboard por mês selecionado
async function updateDashboardByMonth() {
    try {
        const monthSelect = document.getElementById('dashboard-month-select');
        const yearSelect = document.getElementById('dashboard-year-select');
        
        if (!monthSelect || !yearSelect) {
            console.error("Seletores de mês/ano não encontrados!");
            showDashboardMessage("Erro: Seletores de mês/ano não encontrados.", "error");
            return;
        }
        
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);
        
        console.log(`📅 Atualizando dashboard para ${selectedMonth}/${selectedYear}`);
        
        // Carregar receitas e custos
        const [revenues, costs] = await Promise.all([
            loadRevenuesData(),
            loadCostsData()
        ]);
        
        // Filtrar dados por mês/ano
        const monthlyRevenues = filterDataByMonth(revenues, selectedMonth, selectedYear);
        const monthlyCosts = filterDataByMonth(costs, selectedMonth, selectedYear);
        
        // Calcular estatísticas
        const stats = calculateMonthlyStats(monthlyRevenues, monthlyCosts, selectedMonth, selectedYear);
        
        // Atualizar cards de resumo
        updateSummaryCards(stats);
        
        // Atualizar gráficos
        await updateCharts(revenues, costs, selectedYear);
        
        // Atualizar tabela resumo mensal
        updateMonthlySummaryTable(revenues, costs, selectedYear);
        
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
        showDashboardMessage("Erro ao atualizar dashboard: " + error.message, "error");
    }
}

// Função para carregar dados de receitas
async function loadRevenuesData() {
    try {
        const revenuesSnapshot = await getDocs(collection(firestore, "revenue"));
        const revenues = [];
        
        revenuesSnapshot.forEach((doc) => {
            const data = doc.data();
            revenues.push({
                ...data,
                id: doc.id,
                date: new Date(data.enrollmentDate),
                value: parseFloat(data.finalValue) || 0
            });
        });
        
        console.log("DEBUG: Receitas carregadas:", revenues);
        return revenues;
    } catch (error) {
        console.error("Erro ao carregar receitas:", error);
        return [];
    }
}

// Função para carregar dados de custos
async function loadCostsData() {
    try {
        const costsSnapshot = await getDocs(collection(firestore, "costs"));
        const costs = [];
        
        costsSnapshot.forEach((doc) => {
            const data = doc.data();
            costs.push({
                ...data,
                id: doc.id,
                date: new Date(data.date),
                value: parseFloat(data.value) || 0
            });
        });
        console.log("DEBUG: Custos carregados:", costs);
        return costs;
    } catch (error) {
        console.error('Erro ao carregar custos:', error);
        return [];
    }
}

// Função para filtrar dados por mês e ano
function filterDataByMonth(data, month, year) {
    return data.filter(item => {
        const itemDate = item.date;
        return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
    });
}

// Função para calcular estatísticas mensais
function calculateMonthlyStats(revenues, costs, month, year) {
    const totalRevenue = revenues.reduce((sum, item) => sum + item.value, 0);
    const totalCosts = costs.reduce((sum, item) => sum + item.value, 0);
    const netProfit = totalRevenue - totalCosts;
    
    // Calcular comparativo com mês anterior
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;
    
    // Para o comparativo, precisaríamos dos dados do mês anterior
    // Por simplicidade, vamos calcular uma variação baseada nos dados atuais
    const comparison = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
    
    return {
        totalRevenue,
        totalCosts,
        netProfit,
        comparison: `${comparison}%`
    };
}

// Função para atualizar os cards de resumo
function updateSummaryCards(stats) {
    console.log("DEBUG: Atualizando cards de resumo com stats:", stats);
    
    const monthlyRevenueEl = document.getElementById('dashboard-monthly-revenue');
    const monthlyExpensesEl = document.getElementById('dashboard-monthly-expenses');
    const netProfitEl = document.getElementById('dashboard-net-profit');
    const comparisonEl = document.getElementById('dashboard-comparison');
    
    if (monthlyRevenueEl) {
        monthlyRevenueEl.textContent = formatCurrency(stats.totalRevenue);
    } else {
        console.error("Elemento 'dashboard-monthly-revenue' não encontrado!");
    }
    
    if (monthlyExpensesEl) {
        monthlyExpensesEl.textContent = formatCurrency(stats.totalCosts);
    } else {
        console.error("Elemento 'dashboard-monthly-expenses' não encontrado!");
    }
    
    if (netProfitEl) {
        netProfitEl.textContent = formatCurrency(stats.netProfit);
        // Colorir o lucro líquido baseado no valor
        if (stats.netProfit > 0) {
            netProfitEl.style.color = '#10b981'; // Verde
        } else if (stats.netProfit < 0) {
            netProfitEl.style.color = '#ef4444'; // Vermelho
        } else {
            netProfitEl.style.color = '#6b7280'; // Cinza
        }
    } else {
        console.error("Elemento 'dashboard-net-profit' não encontrado!");
    }
    
    if (comparisonEl) {
        comparisonEl.textContent = stats.comparison;
    } else {
        console.error("Elemento 'dashboard-comparison' não encontrado!");
    }
}

// Função para atualizar gráficos
async function updateCharts(revenues, costs, year) {
    // Preparar dados mensais para o ano
    const monthlyData = [];
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    for (let month = 1; month <= 12; month++) {
        const monthRevenues = filterDataByMonth(revenues, month, year);
        const monthCosts = filterDataByMonth(costs, month, year);
        
        const totalRevenue = monthRevenues.reduce((sum, item) => sum + item.value, 0);
        const totalCosts = monthCosts.reduce((sum, item) => sum + item.value, 0);
        
        monthlyData.push({
            month: monthNames[month - 1],
            revenue: totalRevenue,
            costs: totalCosts
        });
    }
    
    // Atualizar gráfico de barras (Receita vs Despesa)
    updateRevenueExpenseChart(monthlyData);
    
    // Preparar dados para gráfico de pizza (distribuição de despesas por categoria)
    const expensesByCategory = {};
    costs.forEach(cost => {
        const category = cost.category || 'Outros';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + cost.value;
    });
    
    updateExpenseDistributionChart(expensesByCategory);
}

// Função para atualizar gráfico de barras
function updateRevenueExpenseChart(data) {
    const chartCanvas = document.getElementById('revenue-expense-chart');
    if (!chartCanvas) {
        console.error("Canvas 'revenue-expense-chart' não encontrado!");
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (revenueExpenseChart) {
        revenueExpenseChart.destroy();
    }
    
    revenueExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.month),
            datasets: [
                {
                    label: 'Receitas',
                    data: data.map(item => item.revenue),
                    backgroundColor: '#10b981',
                    borderColor: '#059669',
                    borderWidth: 1
                },
                {
                    label: 'Despesas',
                    data: data.map(item => item.costs),
                    backgroundColor: '#ef4444',
                    borderColor: '#dc2626',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + context.parsed.y.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar gráfico de pizza
function updateExpenseDistributionChart(expensesByCategory) {
    const chartCanvas = document.getElementById('expense-distribution-chart');
    if (!chartCanvas) {
        console.error("Canvas 'expense-distribution-chart' não encontrado!");
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Destruir gráfico anterior se existir
    if (expenseDistributionChart) {
        expenseDistributionChart.destroy();
    }
    
    const categories = Object.keys(expensesByCategory);
    const values = Object.values(expensesByCategory);
    
    // Cores para as categorias
    const colors = [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'
    ];
    
    expenseDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, categories.length),
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': R$ ' + context.parsed.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar tabela resumo mensal
function updateMonthlySummaryTable(revenues, costs, year) {
    const tbody = document.getElementById('monthly-summary-table');
    if (!tbody) {
        console.error("Tabela 'monthly-summary-table' não encontrada!");
        return;
    }
    
    tbody.innerHTML = '';
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    for (let month = 1; month <= 12; month++) {
        const monthRevenues = filterDataByMonth(revenues, month, year);
        const monthCosts = filterDataByMonth(costs, month, year);
        
        const totalRevenue = monthRevenues.reduce((sum, item) => sum + item.value, 0);
        const totalCosts = monthCosts.reduce((sum, item) => sum + item.value, 0);
        const netProfit = totalRevenue - totalCosts;
        const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${monthNames[month - 1]}</td>
            <td style="color: #10b981; font-weight: bold;">${formatCurrency(totalRevenue)}</td>
            <td style="color: #ef4444; font-weight: bold;">${formatCurrency(totalCosts)}</td>
            <td style="color: ${netProfit >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">${formatCurrency(netProfit)}</td>
            <td style="color: ${margin >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">${margin}%</td>
        `;
        
        tbody.appendChild(row);
    }
}

// Função para mostrar mensagens do dashboard
function showDashboardMessage(message, type) {
    const messageElement = document.getElementById('financial-dashboard-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Ocultar mensagem após 3 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
}

// Função para formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

