// Financial Module - Carregamento de Receitas do Firebase
// Este arquivo é responsável por carregar e exibir as receitas financeiras

// Importar dependências do Firebase (serão carregadas do script principal)
let firestore, getDocs, collection, doc, getDoc;

// Função para inicializar as dependências do Firebase
function initializeFinancialModule(firestoreInstance, getDocsFunction, collectionFunction, docFunction, getDocFunction) {
    firestore = firestoreInstance;
    getDocs = getDocsFunction;
    collection = collectionFunction;
    doc = docFunction;
    getDoc = getDocFunction;
    
    console.log('📊 Módulo Financeiro inicializado com sucesso!');
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

