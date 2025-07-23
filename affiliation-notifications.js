// Arquivo JavaScript para Notificação de Afiliação
// Conecta com a coleção allayCoinsUsage do Firebase Firestore

import { getFirestore, collection, onSnapshot, doc, updateDoc, query, where, orderBy, addDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Variáveis globais para o sistema de notificação de afiliação
let db;
let unsubscribeAffiliationNotifications;
let affiliationNotifications = [];
let currentFilter = 'all';

// Inicializar o sistema de notificação de afiliação
export function initializeAffiliationNotifications() {
    try {
        // Usar a mesma instância do Firestore se já estiver inicializada
        // A instância 'db' deve ser globalmente acessível a partir do script.js principal
        if (window.db) {
            db = window.db;
        } else {
            // Se por algum motivo window.db não estiver disponível, logar um erro
            console.error('Erro: Instância do Firebase Firestore (window.db) não encontrada. Certifique-se de que o script.js principal inicialize o Firebase primeiro.');
            showAffiliationMessage('Erro ao conectar com o Firebase: Instância não encontrada.', 'error');
            return;
        }
        
        loadAffiliationNotifications();
        console.log('Sistema de notificação de afiliação inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar notificações de afiliação:', error);
        showAffiliationMessage('Erro ao conectar com o Firebase', 'error');
    }
}

// Carregar notificações de afiliação em tempo real
function loadAffiliationNotifications() {
    try {
        if (!db) {
            console.error('Firestore DB não está inicializado.');
            showAffiliationMessage('Erro: Firestore DB não está inicializado.', 'error');
            return;
        }
        const affiliationRef = collection(db, 'allayCoinsUsage');
        const q = query(affiliationRef, orderBy('requestedAt', 'desc'));
        
        // Listener em tempo real
        unsubscribeAffiliationNotifications = onSnapshot(q, (snapshot) => {
            affiliationNotifications = [];
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                affiliationNotifications.push({
                    id: doc.id,
                    ...data
                });
            });
            
            updateAffiliationNotificationCounter();
            displayAffiliationNotifications();
        }, (error) => {
            console.error('Erro ao carregar notificações de afiliação:', error);
            showAffiliationMessage('Erro ao carregar notificações', 'error');
        });
        
    } catch (error) {
        console.error('Erro ao configurar listener de notificações:', error);
        showAffiliationMessage('Erro ao configurar notificações em tempo real', 'error');
    }
}

// Atualizar contador de notificações pendentes
function updateAffiliationNotificationCounter() {
    const pendingCount = affiliationNotifications.filter(notification => 
        notification.status === 'pending'
    ).length;
    
    // Atualizar contador na aba de navegação
    const navLink = document.querySelector('[data-section="affiliation-notifications"]');
    if (navLink) {
        let counter = navLink.querySelector('.notification-counter');
        if (pendingCount > 0) {
            if (!counter) {
                counter = document.createElement('span');
                counter.className = 'notification-counter';
                navLink.appendChild(counter);
            }
            counter.textContent = pendingCount;
        } else if (counter) {
            counter.remove();
        }
    }
}

// Exibir notificações de afiliação
function displayAffiliationNotifications() {
    const container = document.getElementById('affiliation-notifications-list');
    if (!container) return;
    
    // Filtrar notificações baseado no filtro atual
    let filteredNotifications = affiliationNotifications;
    if (currentFilter !== 'all') {
        filteredNotifications = affiliationNotifications.filter(notification => 
            notification.status === currentFilter
        );
    }
    
    if (filteredNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>Nenhuma notificação encontrada</h3>
                <p>Não há solicitações de afiliação ${currentFilter === 'all' ? '' : 'com status "' + currentFilter + '"'} no momento.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredNotifications.map(notification => `
        <div class="notification-item" data-id="${notification.id}">
            <div class="notification-header">
                <div class="notification-title">
                    Solicitação de Afiliação - ${notification.userEmail || 'Email não informado'}
                </div>
                <span class="notification-status status-${notification.status}">
                    ${getStatusText(notification.status)}
                </span>
            </div>
            <div class="notification-details">
                <p><strong>Valor:</strong> R$ ${notification.amount || '0,00'}</p>
                <p><strong>Valor em Reais:</strong> R$ ${notification.amountInReais || '0,00'}</p>
                <p><strong>Tipo de Uso:</strong> ${notification.usageType || 'Não especificado'}</p>
                <p><strong>Data da Solicitação:</strong> ${formatDate(notification.requestedAt)}</p>
                <p><strong>Processado:</strong> ${notification.processed ? 'Sim' : 'Não'}</p>
            </div>
            ${notification.status === 'pending' ? `
                <div class="notification-actions">
                    <button class="btn btn-success btn-sm" onclick="approveAffiliationRequest('${notification.id}')">
                        <i class="fas fa-check"></i>
                        Aprovar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectAffiliationRequest('${notification.id}')">
                        <i class="fas fa-times"></i>
                        Rejeitar
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Obter texto do status
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'approved': 'Aprovado',
        'rejected': 'Rejeitado'
    };
    return statusMap[status] || status;
}

// Formatar data
function formatDate(timestamp) {
    if (!timestamp) return 'Data não disponível';
    
    let date;
    if (timestamp.toDate) {
        // Firestore Timestamp
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }
    
    return date.toLocaleString('pt-BR');
}

// Aprovar solicitação de afiliação
window.approveAffiliationRequest = async function(notificationId) {
    try {
        const docRef = doc(db, 'allayCoinsUsage', notificationId);
        
        // Obter os dados da notificação antes de atualizar o status
        const notificationDoc = await getDoc(doc(db, 'allayCoinsUsage', notificationId));
        const notificationData = notificationDoc.data();

        await updateDoc(docRef, {
            status: 'approved',
            processed: true,
            processedAt: new Date()
        });
        
        // Registrar custo na coleção 'costs'
        if (notificationData) {
            const costData = {
                category: 'outros',
                description: `Allay Coin - ${notificationData.userEmail || 'Usuário Desconhecido'}`, // Usar o email do usuário como parte da descrição
                value: parseFloat(notificationData.amountInReais) || 0, // Usar o valor em reais da solicitação
                createdAt: new Date().toISOString(),
                date: new Date().toISOString().split('T')[0] // Data no formato YYYY-MM-DD
            };
            await addDoc(collection(db, 'costs'), costData);
            console.log('Custo registrado com sucesso:', costData);
        }

        showAffiliationMessage('Solicitação aprovada com sucesso e custo registrado!', 'success');
    } catch (error) {
        console.error('Erro ao aprovar solicitação ou registrar custo:', error);
        showAffiliationMessage('Erro ao aprovar solicitação ou registrar custo', 'error');
    }
};

// Rejeitar solicitação de afiliação
window.rejectAffiliationRequest = async function(notificationId) {
    try {
        const docRef = doc(db, 'allayCoinsUsage', notificationId);
        await updateDoc(docRef, {
            status: 'rejected',
            processed: true,
            processedAt: new Date()
        });
        
        showAffiliationMessage('Solicitação rejeitada!', 'warning');
    } catch (error) {
        console.error('Erro ao rejeitar solicitação:', error);
        showAffiliationMessage('Erro ao rejeitar solicitação', 'error');
    }
};

// Filtrar notificações
window.filterAffiliationNotifications = function(filter) {
    currentFilter = filter;
    
    // Atualizar botões de filtro
    document.querySelectorAll('#affiliation-notifications .filter-buttons .btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    const activeBtn = document.querySelector(`#affiliation-notifications .filter-buttons .btn[onclick="filterAffiliationNotifications('${filter}')"]`);
    if (activeBtn) {
        activeBtn.classList.remove('btn-secondary');
        activeBtn.classList.add('btn-primary');
    }
    
    displayAffiliationNotifications();
};

// Exibir mensagem
function showAffiliationMessage(text, type = 'info') {
    const messageContainer = document.getElementById('affiliation-notifications-message');
    if (!messageContainer) return;
    
    messageContainer.className = `message ${type}`;
    messageContainer.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${text}
    `;
    messageContainer.style.display = 'flex';
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

// Atualizar lista de notificações
window.refreshAffiliationNotifications = function() {
    if (unsubscribeAffiliationNotifications) {
        unsubscribeAffiliationNotifications();
    }
    loadAffiliationNotifications();
    showAffiliationMessage('Lista de notificações atualizada!', 'success');
};

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    if (unsubscribeAffiliationNotifications) {
        unsubscribeAffiliationNotifications();
    }
});

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que o Firebase principal foi inicializado
    // e que window.db esteja disponível
    setTimeout(() => {
        initializeAffiliationNotifications();
    }, 1000);
});




