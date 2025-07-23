let costsFirestore, costsGetDocs, costsCollectionRef, costsDoc, costsGetDoc, costsAddDoc, costsDeleteDoc;
let allCosts = [];
let filteredCosts = [];

// Initialize the costs module with Firebase dependencies
function initializeCostsModule(firestore, getDocs, collection, doc, getDoc, addDoc, deleteDoc) {
    costsFirestore = firestore;
    costsGetDocs = getDocs;
    costsCollectionRef = collection; // Atribui a função collection do Firebase
    costsDoc = doc;
    costsGetDoc = getDoc;
    costsAddDoc = addDoc;
    costsDeleteDoc = deleteDoc;
    
    console.log("Costs module initialized successfully");
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cost-date').value = today;
}

// Load all costs from Firebase
async function loadCosts() {
    try {
        showMessage('costs-message', 'Carregando custos...', 'info');
        
        const costsRef = costsCollectionRef(costsFirestore, 'costs');
        const snapshot = await costsGetDocs(costsRef);
        
        allCosts = [];
        snapshot.forEach((doc) => {
            const costData = doc.data();
            allCosts.push({
                id: doc.id,
                ...costData
            });
        });
        
        // Sort costs by date (newest first)
        allCosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredCosts = [...allCosts];
        displayCosts();
        updateCostStatistics();
        
        showMessage('costs-message', `${allCosts.length} custos carregados com sucesso!`, 'success');
        
    } catch (error) {
        console.error('Error loading costs:', error);
        showMessage('costs-message', 'Erro ao carregar custos: ' + error.message, 'error');
    }
}

// Display costs in the table
function displayCosts() {
    const costsList = document.getElementById('costs-list');
    
    if (filteredCosts.length === 0) {
        costsList.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-xl); color: var(--text-muted);">
                <i class="fas fa-chart-pie" style="font-size: 3em; margin-bottom: var(--spacing-md); opacity: 0.5;"></i>
                <h3 style="margin-bottom: var(--spacing-sm);">Nenhum custo encontrado</h3>
                <p>Adicione custos usando o formulário abaixo.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Observações</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredCosts.forEach(cost => {
        const formattedDate = formatDate(cost.date);
        const formattedValue = formatCurrency(cost.value);
        const categoryBadge = getCategoryBadge(cost.category);
        
        html += `
            <tr>
                <td>${formattedDate}</td>
                <td>${cost.description}</td>
                <td>${categoryBadge}</td>
                <td style="font-weight: 600; color: var(--error-color);">${formattedValue}</td>
                <td>${cost.notes || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCost('${cost.id}')" title="Excluir custo">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    costsList.innerHTML = html;
}

// Update cost statistics
function updateCostStatistics() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);
    
    let totalCost = 0;
    let dailyCost = 0;
    let monthlyCost = 0;
    let annualCost = 0;
    
    allCosts.forEach(cost => {
        const costDate = new Date(cost.date);
        const costValue = parseFloat(cost.value) || 0;
        
        totalCost += costValue;
        
        // Daily cost (today)
        if (costDate >= today) {
            dailyCost += costValue;
        }
        
        // Monthly cost (this month)
        if (costDate >= thisMonth) {
            monthlyCost += costValue;
        }
        
        // Annual cost (this year)
        if (costDate >= thisYear) {
            annualCost += costValue;
        }
    });
    
    // Update UI
    document.getElementById('total-cost').textContent = formatCurrency(totalCost);
    document.getElementById('daily-cost').textContent = formatCurrency(dailyCost);
    document.getElementById('monthly-cost').textContent = formatCurrency(monthlyCost);
    document.getElementById('annual-cost').textContent = formatCurrency(annualCost);
    
    // Update detailed stats
    updateDetailedCostStats();
}

// Update detailed cost statistics
function updateDetailedCostStats() {
    const statsContainer = document.getElementById('cost-stats-details');
    
    // Calculate costs by category
    const categoryStats = {};
    allCosts.forEach(cost => {
        const category = cost.category || 'outros';
        const value = parseFloat(cost.value) || 0;
        
        if (!categoryStats[category]) {
            categoryStats[category] = 0;
        }
        categoryStats[category] += value;
    });
    
    let html = `
        <div style="background: var(--tertiary-bg); border-radius: var(--radius-md); padding: var(--spacing-lg);">
            <h4 style="color: var(--text-primary); margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-sm);">
                <i class="fas fa-chart-bar" style="color: var(--accent-blue);"></i>
                Estatísticas Detalhadas
            </h4>
            <div class="form-grid">
                <div>
                    <h5 style="color: var(--text-primary); margin-bottom: var(--spacing-sm);">Custos por Categoria</h5>
    `;
    
    const categoryNames = {
        'salarios': 'Salários',
        'aluguel': 'Aluguel',
        'marketing': 'Marketing',
        'infraestrutura': 'Infraestrutura',
        'outros': 'Outros'
    };
    
    Object.entries(categoryStats).forEach(([category, total]) => {
        const categoryName = categoryNames[category] || category;
        html += `
            <div class="stat-item">
                <span class="stat-label">${categoryName}</span>
                <span class="stat-value">${formatCurrency(total)}</span>
            </div>
        `;
    });
    
    html += `
                </div>
                <div>
                    <h5 style="color: var(--text-primary); margin-bottom: var(--spacing-sm);">Resumo Geral</h5>
                    <div class="stat-item">
                        <span class="stat-label">Total de Registros</span>
                        <span class="stat-value">${allCosts.length}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Média por Registro</span>
                        <span class="stat-value">${formatCurrency(allCosts.length > 0 ? allCosts.reduce((sum, cost) => sum + (parseFloat(cost.value) || 0), 0) / allCosts.length : 0)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Maior Custo</span>
                        <span class="stat-value">${formatCurrency(Math.max(...allCosts.map(cost => parseFloat(cost.value) || 0), 0))}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Menor Custo</span>
                        <span class="stat-value">${formatCurrency(allCosts.length > 0 ? Math.min(...allCosts.map(cost => parseFloat(cost.value) || 0)) : 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = html;
}

// Add new cost
async function addCost() {
    try {
        const description = document.getElementById('cost-description').value.trim();
        const value = parseFloat(document.getElementById('cost-value').value);
        const category = document.getElementById('cost-category').value;
        const date = document.getElementById('cost-date').value;
        const notes = document.getElementById('cost-notes').value.trim();
        
        // Validation
        if (!description) {
            showMessage('costs-message', 'Por favor, insira uma descrição para o custo.', 'error');
            return;
        }
        
        if (!value || value <= 0) {
            showMessage('costs-message', 'Por favor, insira um valor válido para o custo.', 'error');
            return;
        }
        
        if (!category) {
            showMessage('costs-message', 'Por favor, selecione uma categoria.', 'error');
            return;
        }
        
        if (!date) {
            showMessage('costs-message', 'Por favor, selecione uma data.', 'error');
            return;
        }
        
        showMessage('costs-message', 'Adicionando custo...', 'info');
        
        // Create cost object
        const costData = {
            description: description,
            value: value,
            category: category,
            date: date,
            notes: notes,
            createdAt: new Date().toISOString()
        };
        
        // Add to Firebase
        const costsRef = costsCollectionRef(costsFirestore, 'costs');
        await costsAddDoc(costsRef, costData);
        
        showMessage('costs-message', 'Custo adicionado com sucesso!', 'success');
        
        // Clear form and reload costs
        clearCostForm();
        await loadCosts();
        
    } catch (error) {
        console.error('Error adding cost:', error);
        showMessage('costs-message', 'Erro ao adicionar custo: ' + error.message, 'error');
    }
}

// Delete cost
async function deleteCost(costId) {
    if (!confirm('Tem certeza que deseja excluir este custo? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        showMessage('costs-message', 'Excluindo custo...', 'info');
        
        const costRef = costsDoc(costsFirestore, 'costs', costId);
        await costsDeleteDoc(costRef);
        
        showMessage('costs-message', 'Custo excluído com sucesso!', 'success');
        
        // Reload costs
        await loadCosts();
        
    } catch (error) {
        console.error('Error deleting cost:', error);
        showMessage('costs-message', 'Erro ao excluir custo: ' + error.message, 'error');
    }
}

// Clear cost form
function clearCostForm() {
    document.getElementById('cost-description').value = '';
    document.getElementById('cost-value').value = '';
    document.getElementById('cost-category').value = '';
    document.getElementById('cost-notes').value = '';
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('cost-date').value = today;
}

// Filter costs by period
function filterCostsByPeriod(period) {
    const now = new Date();
    let startDate;
    
    switch (period) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            filteredCosts = [...allCosts];
            displayCosts();
            return;
    }
    
    filteredCosts = allCosts.filter(cost => {
        const costDate = new Date(cost.date);
        return costDate >= startDate;
    });
    
    displayCosts();
}

// Export cost data
function exportCostData() {
    if (allCosts.length === 0) {
        showMessage('costs-message', 'Não há dados para exportar.', 'warning');
        return;
    }
    
    try {
        // Create CSV content
        const headers = ['Data', 'Descrição', 'Categoria', 'Valor', 'Observações'];
        const csvContent = [
            headers.join(','),
            ...allCosts.map(cost => [
                cost.date,
                `"${cost.description}"`,
                cost.category,
                cost.value,
                `"${cost.notes || ''}"`
            ].join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `custos_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage('costs-message', 'Dados exportados com sucesso!', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showMessage('costs-message', 'Erro ao exportar dados: ' + error.message, 'error');
    }
}

// Get category badge HTML
function getCategoryBadge(category) {
    const categoryNames = {
        'salarios': 'Salários',
        'aluguel': 'Aluguel',
        'marketing': 'Marketing',
        'infraestrutura': 'Infraestrutura',
        'outros': 'Outros'
    };
    
    const categoryColors = {
        'salarios': 'category-salarios',
        'aluguel': 'category-aluguel',
        'marketing': 'category-marketing',
        'infraestrutura': 'category-infraestrutura',
        'outros': 'category-outros'
    };
    
    const categoryName = categoryNames[category] || category;
    const categoryClass = categoryColors[category] || 'category-default';
    
    return `<span class="category-badge ${categoryClass}">${categoryName}</span>`;
}

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Show message
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

// Make functions globally available
window.loadCosts = loadCosts;
window.addCost = addCost;
window.deleteCost = deleteCost;
window.clearCostForm = clearCostForm;
window.filterCostsByPeriod = filterCostsByPeriod;
window.exportCostData = exportCostData;
window.initializeCostsModule = initializeCostsModule;

