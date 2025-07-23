        // Firebase Configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBIwBp15jP3iXCxftfwZuFFO6y2qoFYrNA",
            authDomain: "allayproject-a9ccc.firebaseapp.com",
            projectId: "allayproject-a9ccc",
            storageBucket: "allayproject-a9ccc.firebasestorage.app",
            messagingSenderId: "712124423347",
            appId: "1:712124423347:web:557a5d70f9f2a60edde4c6",
            measurementId: "G-R1E8NRN4R6"
            
        };

        // Initialize Firebase
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
        import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, listAll, deleteObject, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        window.db = firestore;
        const storage = getStorage(app);

        // Global variables
        let courses = {};
        let currentCourse = null;
        let currentStudentForAssignment = null;
        let currentStudentForProfile = null; // New variable for student profile
        let availableCourses = []; // Store available courses

    document.addEventListener("DOMContentLoaded", function() {
        const navLinks = document.querySelectorAll(".nav-link");
        const sections = document.querySelectorAll(".section");
        const pageTitle = document.getElementById("page-title");
        const breadcrumbCurrent = document.getElementById("breadcrumb-current");
    
        // Course elements
        const courseNameInput = document.getElementById("course-name-input");
        const courseValueInput = document.getElementById("course-value-input");
        const courseWorkloadInput = document.getElementById("course-workload-input");
        const courseDescriptionInput = document.getElementById("course-description-input");
        const addCourseButton = document.getElementById("add-course-button");
        const courseSelect = document.getElementById("course-select");
        const selectCourseButton = document.getElementById("select-course-button");
        const deleteCourseButton = document.getElementById("delete-course-button");
        const currentCourseNameSpan = document.getElementById("current-course-name");
        const modulesContainer = document.getElementById("modules-container");
        const addModuleButton = document.getElementById("add-module-button");
        const saveCourseDataButton = document.getElementById("save-course-data");
        const coursesMessageDiv = document.getElementById("courses-message");

        // Teacher elements
        const teacherNameInput = document.getElementById("teacher-name-input");
        const teacherPhoneInput = document.getElementById("teacher-phone-input");
        const teacherEmailInput = document.getElementById("teacher-email-input");
        const teacherPasswordInput = document.getElementById("teacher-password-input");
        const addTeacherButton = document.getElementById("add-teacher-button");
        const teacherMessageDiv = document.getElementById("teacher-message");
        const teachersList = document.getElementById("teachers-list");
        const teachersMessageDiv = document.getElementById("teachers-message");

        // Course teacher selection elements
        const hasTeacherNo = document.getElementById("has-teacher-no");
        const hasTeacherYes = document.getElementById("has-teacher-yes");
        const teacherSelectionContainer = document.getElementById("teacher-selection-container");
        const courseTeacherSelect = document.getElementById("course-teacher-select");

        // Student elements
        const studentNameInput = document.getElementById("student-name-input");
        const studentCpfInput = document.getElementById("student-cpf-input");
        const studentPhoneInput = document.getElementById("student-phone-input");
        const studentEmailInput = document.getElementById("student-email-input");
        const studentPasswordInput = document.getElementById("student-password-input");
        const addStudentButton = document.getElementById("add-student-button");
        const enrollmentMessageDiv = document.getElementById("enrollment-message");
        const studentsList = document.getElementById("students-list");
        const studentsMessageDiv = document.getElementById("students-message");

        // Modal elements
        const assignCourseModal = document.getElementById("assign-course-modal");
        const modalStudentName = document.getElementById("modal-student-name");
        const modalCourseSelect = document.getElementById("modal-course-select");
        const modalMediaSource = document.getElementById("modal-media-source");
        const modalPaymentMethod = document.getElementById("modal-payment-method");
        const modalDiscountValue = document.getElementById("modal-discount-value");
        const modalFinalValue = document.getElementById("modal-final-value");
        const assignCourseConfirm = document.getElementById("assign-course-confirm");
        const assignCourseCancel = document.getElementById("assign-course-cancel");

        // Indication elements
        const indicationNo = document.getElementById("indication-no");
        const indicationYes = document.getElementById("indication-yes");
        const indicationSearchContainer = document.getElementById("indication-search-container");
        const indicationSearchInput = document.getElementById("indication-search-input");
        const indicationSearchResults = document.getElementById("indication-search-results");
        const selectedIndicatorEmail = document.getElementById("selected-indicator-email");
        const indicationBonusContainer = document.getElementById("indication-bonus-container");
        const indicationBonusValue = document.getElementById("indication-bonus-value");

        // Student profile modal elements
        const studentProfileModal = document.getElementById("student-profile-modal");
        const profileModalStudentEmail = document.getElementById("profile-modal-student-email");
        const profileStudentName = document.getElementById("profile-student-name");
        const profileStudentPhone = document.getElementById("profile-student-phone");
        const profileStudentCpf = document.getElementById("profile-student-cpf");
        const profileStudentEmailDisplay = document.getElementById("profile-student-email-display");
        const profileAssignedCourses = document.getElementById("profile-assigned-courses");
        const profileSaveChanges = document.getElementById("profile-save-changes");
        const profileAssignCourse = document.getElementById("profile-assign-course");
        const profileRemoveCourse = document.getElementById("profile-remove-course");
        const profileRemoveStudent = document.getElementById("profile-remove-student");
        const profileClose = document.getElementById("profile-close");
        const profileViewIndications = document.getElementById("profile-view-indications");

        // Student Indications Modal elements
        const studentIndicationsModal = document.getElementById("student-indications-modal");
        const indicationsModalStudentName = document.getElementById("indications-modal-student-name");
        const studentIndicationsTbody = document.getElementById("student-indications-tbody");
        const studentIndicationsMessage = document.getElementById("student-indications-message");
        const closeIndicationsModalButton = document.getElementById("close-indications-modal");

        // Remove course modal elements
        // Remove course modal elements
        const removeCourseModal = document.getElementById("remove-course-modal");
        const removeModalStudentName = document.getElementById("remove-modal-student-name");
        const removeCoursesList = document.getElementById("remove-courses-list");
        const removeCourseConfirm = document.getElementById("remove-course-confirm");
        const removeCourseCancel = document.getElementById("remove-course-cancel");
        let currentStudentForRemoval = null;

        // Indications elements
        const addIndicationButton = document.getElementById("add-indication-button");
        const addIndicationModal = document.getElementById("add-indication-modal");
        const indicatorStudentSearch = document.getElementById("indicator-student-search");
        const indicatorStudentResults = document.getElementById("indicator-student-results");
        const selectedIndicatorEmailModal = document.getElementById("selected-indicator-email");
        const indicatedStudentSearch = document.getElementById("indicated-student-search");
        const indicatedStudentResults = document.getElementById("indicated-student-results");
        const selectedIndicatedEmailModal = document.getElementById("selected-indicated-email");
        const indicationCourseSelect = document.getElementById("indication-course-select");
        const indicationDate = document.getElementById("indication-date");
        const indicationStatusSelect = document.getElementById("indication-status-select");
        const indicationPoints = document.getElementById("indication-points");
        const saveIndicationButton = document.getElementById("save-indication-button");
        const cancelAddIndicationButton = document.getElementById("cancel-add-indication-button");
        const indicationsTbody = document.getElementById("indications-tbody");
        const indicationsMessageDiv = document.getElementById("indications-message");

        // Support Settings elements
        const addWhatsappNumberButton = document.getElementById("add-whatsapp-number");
        const whatsappNumbersContainer = document.getElementById("whatsapp-numbers-container");
        const supportEmailInput = document.getElementById("support-email-input");
        const saveSupportSettingsButton = document.getElementById("save-support-settings");
        const supportSettingsMessageDiv = document.getElementById("support-settings-message");

        // Notifications elements
        const notificationTitleInput = document.getElementById("notification-title-input");
        const notificationContentInput = document.getElementById("notification-content-input");
        const notificationPrioritySelect = document.getElementById("notification-priority-select");
        const publishNotificationButton = document.getElementById("publish-notification-button");
        const notificationsMessageDiv = document.getElementById("notifications-message");
        const notificationsList = document.getElementById("notifications-list");

        // Privacy Policy elements
        const privacyPolicyContent = document.getElementById("privacy-policy-content");
        const publishPrivacyPolicyButton = document.getElementById("publish-privacy-policy-button");
        const privacyPolicyMessageDiv = document.getElementById("privacy-policy-message");

        // Materials elements
        const uploadArea = document.getElementById("upload-area");
        const fileInput = document.getElementById("file-input");
        const folderNameInput = document.getElementById("folder-name-input");
        const createFolderBtn = document.getElementById("create-folder-btn");
        const folderSelect = document.getElementById("folder-select");
        const uploadProgressContainer = document.getElementById("upload-progress-container");
        const uploadProgressBar = document.getElementById("upload-progress-bar");
        const uploadStatus = document.getElementById("upload-status");
        const filesList = document.getElementById("files-list");
        const materialsMessageDiv = document.getElementById("materials-message");

        // Global variables for materials
        let currentFolder = "";
        let folders = [];
        let files = [];
    
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute("data-section");
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
                
                // Update page title and breadcrumb
                const sectionTitles = {
                    dashboard: "Dashboard",
                    courses: "Gerenciar Cursos",
                    notifications: "Gerenciar Notificações",
                    enrollment: "Matrícula de Aluno",
                    students: "Gerenciar Alunos",
                    teachers: "Gerenciar Professores",
                    "indications-history": "Histórico de Matrículas",
                    materials: "Gestão de Materiais",
                    "support-settings": "Configuração Suporte",
                    settings: "Configurações",
                    analytics: "Relatórios",
                    "privacy-policy": "Política de Privacidade",
                    financial: "Receitas Financeiras",
                    "financial-dashboard": "Dashboard Financeiro",
                    costs: "Gestão de Custos"
                };
                
                pageTitle.textContent = sectionTitles[targetSection];
                breadcrumbCurrent.textContent = sectionTitles[targetSection];
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove("active");
                });
                document.getElementById(targetSection).classList.add("active");
                
                // Load data for specific sections
                if (targetSection === "students") {
                    loadStudents();
                } else if (targetSection === "teachers") {
                    loadTeachers();
                } else if (targetSection === "dashboard") {
                    updateDashboardStats();
                } else if (targetSection === "support-settings") {
                    loadSupportSettings();
                } else if (targetSection === "notifications") {
                    loadNotifications();
                } else if (targetSection === "materials") {
                    loadMaterials();
                } else if (targetSection === "privacy-policy") {
                    loadPrivacyPolicy();
                } else if (targetSection === "indications-history") {
                    loadIndications();
                } else if (targetSection === "financial") {
                    // Initialize financial module
                    if (typeof initializeFinancialModule === 'function') {
                        initializeFinancialModule(firestore, getDocs, collection, doc, getDoc, targetSection);
                        loadRevenues();
                    }
                } else if (targetSection === "financial-dashboard") {
                    // Initialize financial dashboard
                    if (typeof initializeFinancialModule === 'function') {
                        initializeFinancialModule(firestore, getDocs, collection, doc, getDoc, targetSection);
                    }
                } else if (targetSection === "costs") {
                    // Initialize costs module
                    if (typeof initializeCostsModule === 'function') {
                        initializeCostsModule(firestore, getDocs, collection, doc, getDoc, addDoc, deleteDoc);
                        loadCosts();
                    }
                }
            });
        });

         // Course management functions
        async function loadCourses() {
            try {
                const coursesSnapshot = await getDocs(collection(firestore, "courses"));
                courseSelect.innerHTML = '<option value="">Escolha um curso...</option>';
                modalCourseSelect.innerHTML = '<option value="">Escolha um curso...</option>';
                
                // Clear and populate available courses array
                availableCourses = [];
                
                coursesSnapshot.forEach((doc) => {
                    const courseName = doc.id;
                    availableCourses.push(courseName);
                    
                    const option = document.createElement("option");
                    option.value = courseName;
                    option.textContent = courseName;
                    courseSelect.appendChild(option);
                    
                    const modalOption = option.cloneNode(true);
                    modalCourseSelect.appendChild(modalOption);
                });
            } catch (error) {
                console.error("Erro ao carregar cursos:", error);
            }
        }
        async function addCourse() {
            const courseName = courseNameInput.value.trim();
            const courseValue = parseFloat(courseValueInput.value);
            const courseWorkload = parseInt(courseWorkloadInput.value);
            const courseDescription = courseDescriptionInput.value.trim();
            const hasTeacher = hasTeacherYes.checked;
            const selectedTeacher = hasTeacher ? courseTeacherSelect.value : null;

            if (!courseName || isNaN(courseValue) || isNaN(courseWorkload) || !courseDescription) {
                showMessage(coursesMessageDiv, "Por favor, preencha todos os campos corretamente (Nome, Valor, Carga Horária, Descrição).", "error");
                return;
            }

            if (hasTeacher && !selectedTeacher) {
                showMessage(coursesMessageDiv, "Por favor, selecione um professor para o curso.", "error");
                return;
            }

            try {
                const courseData = {
                    modules: [],
                    value: courseValue,
                    workload: courseWorkload,
                    description: courseDescription,
                    hasTeacher: hasTeacher,
                    teacherEmail: selectedTeacher
                };

                await setDoc(doc(firestore, "courses", courseName), courseData);
                
                courseNameInput.value = "";
                courseValueInput.value = "";
                courseWorkloadInput.value = "";
                courseDescriptionInput.value = "";
                hasTeacherNo.checked = true;
                hasTeacherYes.checked = false;
                courseTeacherSelect.value = "";
                teacherSelectionContainer.style.display = "none";
                
                showMessage(coursesMessageDiv, "Curso criado com sucesso!", "success");
                loadCourses();
            } catch (error) {
                console.error("Erro ao criar curso:", error);
                showMessage(coursesMessageDiv, "Erro ao criar curso. Tente novamente.", "error");
            }
        }

        // Teacher selection functions
        function toggleTeacherSelection() {
            if (hasTeacherYes.checked) {
                teacherSelectionContainer.style.display = "block";
                loadTeachersForCourseSelection();
            } else {
                teacherSelectionContainer.style.display = "none";
                courseTeacherSelect.value = "";
            }
        }

        async function loadTeachersForCourseSelection() {
            try {
                const teachersSnapshot = await getDocs(collection(firestore, "teachers"));
                courseTeacherSelect.innerHTML = '<option value="">Escolha um professor...</option>';
                
                teachersSnapshot.forEach((doc) => {
                    const teacher = doc.data();
                    // Only show active teachers
                    if (teacher.status !== "desativado") {
                        const option = document.createElement("option");
                        option.value = teacher.email;
                        option.textContent = teacher.name;
                        courseTeacherSelect.appendChild(option);
                    }
                });
            } catch (error) {
                console.error("Erro ao carregar professores:", error);
                showMessage(coursesMessageDiv, "Erro ao carregar lista de professores.", "error");
            }
        }

        async function selectCourse() {
            const selectedCourse = courseSelect.value;
            if (!selectedCourse) {
                showMessage(coursesMessageDiv, "Por favor, selecione um curso.", "error");
                return;
            }

            try {
                const courseDoc = await getDoc(doc(firestore, "courses", selectedCourse));
                if (courseDoc.exists()) {
                    currentCourse = selectedCourse;
                    currentCourseNameSpan.textContent = selectedCourse;
                    
                    const courseData = courseDoc.data();
                    courses[selectedCourse] = courseData.modules || [];
                    
                    renderModules();
                    showMessage(coursesMessageDiv, "Curso carregado com sucesso!", "success");
                } else {
                    showMessage(coursesMessageDiv, "Curso não encontrado.", "error");
                }
            } catch (error) {
                console.error("Erro ao carregar curso:", error);
                showMessage(coursesMessageDiv, "Erro ao carregar curso. Tente novamente.", "error");
            }
        }

        async function deleteCourse() {
            const selectedCourse = courseSelect.value;
            if (!selectedCourse) {
                showMessage(coursesMessageDiv, "Por favor, selecione um curso.", "error");
                return;
            }

            if (confirm(`Tem certeza que deseja excluir o curso "${selectedCourse}"? Esta ação não pode ser desfeita.`)) {
                try {
                    await deleteDoc(doc(firestore, "courses", selectedCourse));
                    
                    courseSelect.value = "";
                    currentCourse = null;
                    currentCourseNameSpan.textContent = "Nenhum Curso Selecionado";
                    modulesContainer.innerHTML = "";
                    
                    showMessage(coursesMessageDiv, "Curso excluído com sucesso!", "success");
                    loadCourses();
                } catch (error) {
                    console.error("Erro ao excluir curso:", error);
                    showMessage(coursesMessageDiv, "Erro ao excluir curso. Tente novamente.", "error");
                }
            }
        }

        function addModule() {
            if (!currentCourse) {
                showMessage(coursesMessageDiv, "Por favor, selecione um curso primeiro.", "error");
                return;
            }

            if (!courses[currentCourse]) {
                courses[currentCourse] = [];
            }

            const moduleIndex = courses[currentCourse].length;
            const newModule = {
                name: `Módulo ${moduleIndex + 1}`,
                videos: [],
                quiz: {
                    questions: []
                }
            };

            courses[currentCourse].push(newModule);
            renderModules();
        }

        function renderModules() {
            if (!currentCourse || !courses[currentCourse]) {
                modulesContainer.innerHTML = "";
                return;
            }

            modulesContainer.innerHTML = "";
            
            courses[currentCourse].forEach((module, moduleIndex) => {
                const moduleDiv = document.createElement("div");
                moduleDiv.className = "module-container";
                moduleDiv.innerHTML = `\n                    <div class="module-header">\n                        <div class="module-title">\n                            <i class="fas fa-folder"></i>\n                            <input type="text" value="${module.name}" class="form-input" style="max-width: 300px; margin: 0;" onchange="updateModuleName(${moduleIndex}, this.value)">\n                        </div>\n                        <div class="module-actions">\n                            <button class="btn btn-sm btn-primary" onclick="addVideo(${moduleIndex})">\n                                <i class="fas fa-plus"></i>\n                                Adicionar Vídeo\n                            </button>\n                            <button class="btn btn-sm btn-warning" onclick="addQuizQuestion(${moduleIndex})">\n                                <i class="fas fa-question-circle"></i>\n                                Adicionar Pergunta\n                            </button>\n                            <button class="btn btn-sm btn-danger" onclick="removeModule(${moduleIndex})">\n                                <i class="fas fa-trash"></i>\n                                Remover\n                            </button>\n                        </div>\n                    </div>\n                    <div class="module-content">\n                        <div id="videos-${moduleIndex}">\n                            ${renderVideos(module.videos, moduleIndex)}\n                        </div>\n                        <div id="quiz-${moduleIndex}">\n                            ${renderQuiz(module.quiz, moduleIndex)}\n                        </div>\n                    </div>\n                `;
                modulesContainer.appendChild(moduleDiv);
            });
        }

        function renderVideos(videos, moduleIndex) {
            return videos.map((video, videoIndex) => `\n                <div class="video-item">\n                    <input type="text" value="${video.title}" class="form-input video-title-input" placeholder="Título do vídeo" onchange="updateVideoTitle(${moduleIndex}, ${videoIndex}, this.value)">\n                    <input type="url" value="${video.url}" class="form-input video-url-input" placeholder="URL do vídeo" onchange="updateVideoUrl(${moduleIndex}, ${videoIndex}, this.value)">\n                    <button class="btn btn-sm btn-danger" onclick="removeVideo(${moduleIndex}, ${videoIndex})">\n                        <i class="fas fa-trash"></i>\n                    </button>\n                </div>\n            `).join("");
        }

        function renderQuiz(quiz, moduleIndex) {
            if (!quiz || !quiz.questions) {
                return `\n                    <div class="quiz-container">\n                        <div class="quiz-header">\n                            <div class="quiz-title">\n                                <i class="fas fa-question-circle"></i>\n                                Prova do Módulo\n                            </div>\n                        </div>\n                        <div class="quiz-content">\n                            <p style="color: var(--text-muted); text-align: center; padding: var(--spacing-lg);">\n                                Nenhuma pergunta adicionada ainda. Clique em "Adicionar Pergunta" para começar.\n                            </p>\n                        </div>\n                    </div>\n                `;
            }

            const questionsHtml = quiz.questions.map((question, questionIndex) => `\n                <div class="question-item">\n                    <div class="question-header">\n                        <span class="question-number">Pergunta ${questionIndex + 1}</span>\n                        <button class="btn btn-sm btn-danger" onclick="removeQuizQuestion(${moduleIndex}, ${questionIndex})">\n                            <i class="fas fa-trash"></i>\n                            Remover\n                        </button>\n                    </div>\n                    <div class="form-group">\n                        <label class="form-label">Pergunta:</label>\n                        <input type="text" value="${question.question || ''}" class="form-input" placeholder="Digite a pergunta..." onchange="updateQuizQuestion(${moduleIndex}, ${questionIndex}, this.value)">\n                    </div>\n                    <div class="form-group">\n                        <label class="form-label">Opções de Resposta:</label>\n                        ${(question.options || ['', '', '', '']).map((option, optionIndex) => `\n                            <div class="option-item">\n                                <input type="text" value="${option}" class="form-input" placeholder="Opção ${optionIndex + 1}" onchange="updateQuizOption(${moduleIndex}, ${questionIndex}, ${optionIndex}, this.value)">\n                                <input type="radio" name="correct-${moduleIndex}-${questionIndex}" value="${optionIndex}" ${question.correctAnswer === optionIndex ? 'checked' : ''} onchange="updateCorrectAnswer(${moduleIndex}, ${questionIndex}, ${optionIndex})">\n                                <span class="correct-answer-label">Correta</span>\n                            </div>\n                        `).join('')}\n                    </div>\n                </div>\n            `).join('');

            return `\n                <div class="quiz-container">\n                    <div class="quiz-header">\n                        <div class="quiz-title">\n                            <i class="fas fa-question-circle"></i>\n                            Prova do Módulo (${quiz.questions.length} pergunta${quiz.questions.length !== 1 ? 's' : ''})\n                        </div>\n                    </div>\n                    <div class="quiz-content">\n                        ${questionsHtml}\n                    </div>\n                </div>\n            `;
        }

        function addVideo(moduleIndex) {
            if (!courses[currentCourse][moduleIndex].videos) {
                courses[currentCourse][moduleIndex].videos = [];
            }
            
            courses[currentCourse][moduleIndex].videos.push({
                title: "",
                url: ""
            });
            
            renderModules();
        }

        function addQuizQuestion(moduleIndex) {
            if (!courses[currentCourse][moduleIndex].quiz) {
                courses[currentCourse][moduleIndex].quiz = { questions: [] };
            }
            
            if (!courses[currentCourse][moduleIndex].quiz.questions) {
                courses[currentCourse][moduleIndex].quiz.questions = [];
            }
            
            courses[currentCourse][moduleIndex].quiz.questions.push({
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0
            });
            
            renderModules();
        }

        function removeModule(moduleIndex) {
            if (confirm("Tem certeza que deseja remover este módulo?")) {
                courses[currentCourse].splice(moduleIndex, 1);
                renderModules();
            }
        }

        function removeVideo(moduleIndex, videoIndex) {
            courses[currentCourse][moduleIndex].videos.splice(videoIndex, 1);
            renderModules();
        }

        function removeQuizQuestion(moduleIndex, questionIndex) {
            if (confirm("Tem certeza que deseja remover esta pergunta?")) {
                courses[currentCourse][moduleIndex].quiz.questions.splice(questionIndex, 1);
                renderModules();
            }
        }

        function updateModuleName(moduleIndex, newName) {
            courses[currentCourse][moduleIndex].name = newName;
        }

        function updateVideoTitle(moduleIndex, videoIndex, newTitle) {
            courses[currentCourse][moduleIndex].videos[videoIndex].title = newTitle;
        }

        function updateVideoUrl(moduleIndex, videoIndex, newUrl) {
            courses[currentCourse][moduleIndex].videos[videoIndex].url = newUrl;
        }

        function updateQuizQuestion(moduleIndex, questionIndex, newQuestion) {
            courses[currentCourse][moduleIndex].quiz.questions[questionIndex].question = newQuestion;
        }

        function updateQuizOption(moduleIndex, questionIndex, optionIndex, newOption) {
            courses[currentCourse][moduleIndex].quiz.questions[questionIndex].options[optionIndex] = newOption;
        }

        function updateCorrectAnswer(moduleIndex, questionIndex, correctIndex) {
            courses[currentCourse][moduleIndex].quiz.questions[questionIndex].correctAnswer = correctIndex;
        }

        // Utility function to format file size
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        async function saveCourseData() {
            if (!currentCourse) {
                showMessage(coursesMessageDiv, "Nenhum curso selecionado.", "error");
                return;
            }

            try {
                // Get current course data to preserve existing fields
                const courseDoc = await getDoc(doc(firestore, "courses", currentCourse));
                let courseData = {};
                
                if (courseDoc.exists()) {
                    courseData = courseDoc.data();
                }
                
                // Update only the modules while preserving other fields
                await setDoc(doc(firestore, "courses", currentCourse), {
                    ...courseData,
                    modules: courses[currentCourse]
                });
                
                showMessage(coursesMessageDiv, "Curso salvo com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao salvar curso:", error);
                showMessage(coursesMessageDiv, "Erro ao salvar curso. Tente novamente.", "error");
            }
        }

        // Teacher management functions
        async function addTeacher() {
            const name = teacherNameInput.value.trim();
            const phone = teacherPhoneInput.value.trim();
            const email = teacherEmailInput.value.trim();
            const password = teacherPasswordInput.value.trim();

            if (!name || !phone || !email || !password) {
                showMessage(teacherMessageDiv, "Por favor, preencha todos os campos obrigatórios.", "error");
                return;
            }

            if (password.length < 6) {
                showMessage(teacherMessageDiv, "A senha deve ter pelo menos 6 caracteres.", "error");
                return;
            }

            // Validate phone
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                showMessage(teacherMessageDiv, "Número de telefone inválido. Deve conter 10 ou 11 dígitos.", "error");
                return;
            }

            try {
                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save teacher data to Firestore
                await setDoc(doc(firestore, "teachers", user.email), {
                    name: name,
                    phone: phone,
                    email: email,
                    role: "teacher",
                    registrationDate: new Date().toISOString(),
                    status: "ativo"
                });

                // Clear form
                clearTeacherForm();
                
                showMessage(teacherMessageDiv, "Professor cadastrado com sucesso!", "success");
                loadTeachers();
            } catch (error) {
                console.error("Erro ao cadastrar professor:", error);
                let errorMessage = "Erro ao cadastrar professor. Tente novamente.";
                
                if (error.code === "auth/email-already-in-use") {
                    errorMessage = "Este email já está em uso.";
                } else if (error.code === "auth/invalid-email") {
                    errorMessage = "Email inválido.";
                } else if (error.code === "auth/weak-password") {
                    errorMessage = "Senha muito fraca.";
                }
                
                showMessage(teacherMessageDiv, errorMessage, "error");
            }
        }

        async function loadTeachers() {
            try {
                const teachersSnapshot = await getDocs(collection(firestore, "teachers"));
                teachersList.innerHTML = "";
                
                if (teachersSnapshot.empty) {
                    teachersList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">Nenhum professor cadastrado.</p>';
                    return;
                }
                
                teachersSnapshot.forEach((doc) => {
                    const teacher = doc.data();
                    
                    // Check if teacher is disabled
                    const isDisabled = teacher.status === "desativado";
                    const statusDisplay = isDisabled ? " (DESATIVADO)" : "";
                    const teacherNameClass = isDisabled ? "student-name disabled" : "student-name";
                    
                    const teacherDiv = document.createElement("div");
                    teacherDiv.className = isDisabled ? "student-item disabled" : "student-item";
                    
                    // Add phone to the display
                    const phoneDisplay = teacher.phone ? ` | Tel: ${teacher.phone}` : '';
                    
                    teacherDiv.innerHTML = `
                        <div class="student-info">
                            <div class="${teacherNameClass}">${teacher.name}${statusDisplay}</div>
                            <div class="student-email">${teacher.email}${phoneDisplay}</div>
                            <div class="student-course">
                                Professor | Cadastrado em: ${new Date(teacher.registrationDate).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                        <div class="student-actions">
                            <button class="btn btn-sm btn-primary" onclick="editTeacher('${teacher.email}')" ${isDisabled ? 'disabled' : ''}>
                                <i class="fas fa-edit"></i>
                                Editar
                            </button>
                            <button class="btn btn-sm ${isDisabled ? 'btn-success' : 'btn-danger'}" onclick="${isDisabled ? 'reactivateTeacher' : 'removeTeacher'}('${teacher.email}')">
                                <i class="fas fa-${isDisabled ? 'check' : 'trash'}"></i>
                                ${isDisabled ? 'Reativar' : 'Remover'}
                            </button>
                        </div>
                    `;
                    teachersList.appendChild(teacherDiv);
                });
            } catch (error) {
                console.error("Erro ao carregar professores:", error);
                showMessage(teachersMessageDiv, "Erro ao carregar lista de professores.", "error");
            }
        }

        async function removeTeacher(teacherEmail) {
            if (confirm(`Tem certeza que deseja desativar o professor ${teacherEmail}? O professor não conseguirá mais fazer login.`)) {
                try {
                    // Update teacher status in Firestore
                    await setDoc(doc(firestore, "teachers", teacherEmail), {
                        status: "desativado",
                        disabledAt: new Date().toISOString()
                    }, { merge: true });

                    loadTeachers();
                    showMessage(teachersMessageDiv, "Professor desativado com sucesso!", "success");
                } catch (error) {
                    console.error("Erro ao desativar professor:", error);
                    showMessage(teachersMessageDiv, "Erro ao desativar professor. Tente novamente.", "error");
                }
            }
        }

        async function reactivateTeacher(teacherEmail) {
            if (confirm(`Tem certeza que deseja reativar o professor ${teacherEmail}? O professor poderá fazer login novamente.`)) {
                try {
                    // Update teacher status in Firestore
                    await setDoc(doc(firestore, "teachers", teacherEmail), {
                        status: "ativo",
                        reactivatedAt: new Date().toISOString()
                    }, { merge: true });

                    loadTeachers();
                    showMessage(teachersMessageDiv, "Professor reativado com sucesso!", "success");
                } catch (error) {
                    console.error("Erro ao reativar professor:", error);
                    showMessage(teachersMessageDiv, "Erro ao reativar professor. Tente novamente.", "error");
                }
            }
        }

        async function editTeacher(teacherEmail) {
            try {
                const teacherDoc = await getDoc(doc(firestore, "teachers", teacherEmail));
                if (!teacherDoc.exists()) {
                    showMessage(teachersMessageDiv, "Professor não encontrado.", "error");
                    return;
                }

                const teacherData = teacherDoc.data();
                
                // Fill form with current data
                teacherNameInput.value = teacherData.name || "";
                teacherPhoneInput.value = teacherData.phone || "";
                teacherEmailInput.value = teacherData.email || "";
                teacherPasswordInput.value = ""; // Don't show password
                
                // Change button text to indicate editing
                addTeacherButton.innerHTML = '<i class="fas fa-save"></i> Atualizar Professor';
                addTeacherButton.onclick = () => updateTeacher(teacherEmail);
                
                showMessage(teacherMessageDiv, "Dados carregados para edição. Modifique os campos necessários e clique em 'Atualizar Professor'.", "warning");
            } catch (error) {
                console.error("Erro ao carregar dados do professor:", error);
                showMessage(teacherMessageDiv, "Erro ao carregar dados do professor.", "error");
            }
        }

        async function updateTeacher(originalEmail) {
            const name = teacherNameInput.value.trim();
            const phone = teacherPhoneInput.value.trim();
            const email = teacherEmailInput.value.trim();
            const password = teacherPasswordInput.value.trim();

            if (!name || !phone || !email) {
                showMessage(teacherMessageDiv, "Por favor, preencha todos os campos obrigatórios (exceto senha se não quiser alterar).", "error");
                return;
            }

            // Validate phone
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                showMessage(teacherMessageDiv, "Número de telefone inválido. Deve conter 10 ou 11 dígitos.", "error");
                return;
            }

            try {
                // Get current teacher data
                const teacherDoc = await getDoc(doc(firestore, "teachers", originalEmail));
                if (!teacherDoc.exists()) {
                    showMessage(teacherMessageDiv, "Professor não encontrado.", "error");
                    return;
                }

                const teacherData = teacherDoc.data();
                
                // Update teacher data in Firestore
                await setDoc(doc(firestore, "teachers", originalEmail), {
                    ...teacherData,
                    name: name,
                    phone: phone,
                    email: email,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
                
                // Reset form and button
                clearTeacherForm();
                addTeacherButton.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar Professor';
                addTeacherButton.onclick = addTeacher;
                
                loadTeachers();
                showMessage(teacherMessageDiv, "Professor atualizado com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao atualizar professor:", error);
                showMessage(teacherMessageDiv, "Erro ao atualizar professor. Tente novamente.", "error");
            }
        }

        function clearTeacherForm() {
            teacherNameInput.value = "";
            teacherPhoneInput.value = "";
            teacherEmailInput.value = "";
            teacherPasswordInput.value = "";
            
            // Reset button if it was in edit mode
            addTeacherButton.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar Professor';
            addTeacherButton.onclick = addTeacher;
        }

        function filterTeachers() {
            const searchTerm = document.getElementById("teacher-search-input").value.toLowerCase();
            const teacherItems = document.querySelectorAll("#teachers-list .student-item");
            
            teacherItems.forEach(item => {
                const teacherInfo = item.querySelector(".student-info").textContent.toLowerCase();
                if (teacherInfo.includes(searchTerm)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        }

        // Student management functions
        async function addStudent() {
            const name = studentNameInput.value.trim();
            const cpf = studentCpfInput.value.trim();
            const phone = studentPhoneInput.value.trim();
            const email = studentEmailInput.value.trim();
            const password = studentPasswordInput.value.trim();

            if (!name || !cpf || !phone || !email || !password) {
                showMessage(enrollmentMessageDiv, "Por favor, preencha todos os campos obrigatórios.", "error");
                return;
            }

            if (password.length < 6) {
                showMessage(enrollmentMessageDiv, "A senha deve ter pelo menos 6 caracteres.", "error");
                return;
            }

            // Validate CPF
            if (!isValidCPF(cpf.replace(/\D/g, ''))) {
                showMessage(enrollmentMessageDiv, "CPF inválido. Verifique os números digitados.", "error");
                return;
            }

            // Validate phone
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                showMessage(enrollmentMessageDiv, "Número de telefone inválido. Deve conter 10 ou 11 dígitos.", "error");
                return;
            }

            try {
                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Save student data to Firestore with new fields
                await setDoc(doc(firestore, "students", user.email), {
                    name: name,
                    cpf: cpf,
                    phone: phone,
                    email: email,
                    assignedCourses: [], // Initialize with an empty array
                    registrationDate: new Date().toISOString()
                });

                // Clear form
                clearEnrollmentForm();
                
                showMessage(enrollmentMessageDiv, "Aluno cadastrado com sucesso!", "success");
                loadStudents();
            } catch (error) {
                console.error("Erro ao cadastrar aluno:", error);
                let errorMessage = "Erro ao cadastrar aluno. Tente novamente.";
                
                if (error.code === "auth/email-already-in-use") {
                    errorMessage = "Este email já está em uso.";
                } else if (error.code === "auth/invalid-email") {
                    errorMessage = "Email inválido.";
                } else if (error.code === "auth/weak-password") {
                    errorMessage = "Senha muito fraca.";
                }
                
                showMessage(enrollmentMessageDiv, errorMessage, "error");
            }
        }

        async function loadStudents() {
            try {
                const studentsSnapshot = await getDocs(collection(firestore, "students"));
                studentsList.innerHTML = "";
                
                if (studentsSnapshot.empty) {
                    studentsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">Nenhum aluno cadastrado.</p>';
                    return;
                }
                
                studentsSnapshot.forEach((doc) => {
                    const student = doc.data();
                    
                    // Handle both old (assignedCourse) and new (assignedCourses) data structures
                    let assignedCourses = [];
                    if (student.assignedCourses && Array.isArray(student.assignedCourses)) {
                        assignedCourses = student.assignedCourses;
                    } else if (student.assignedCourse && student.assignedCourse !== "") {
                        assignedCourses = [student.assignedCourse];
                    }
                    
                    const coursesDisplay = assignedCourses.length > 0 
                        ? `Cursos: ${assignedCourses.join(', ')}` 
                        : 'Nenhum curso atribuído';
                    
                    // Check if student is disabled
                    const isDisabled = student.status === "desativado";
                    const statusDisplay = isDisabled ? " (DESATIVADO)" : "";
                    const studentNameClass = isDisabled ? "student-name disabled" : "student-name";
                    
                    const studentDiv = document.createElement("div");
                    studentDiv.className = isDisabled ? "student-item disabled" : "student-item";
                    
                    // Add CPF and phone to the display for better search functionality
                    const cpfDisplay = student.cpf ? ` | CPF: ${student.cpf}` : '';
                    const phoneDisplay = student.phone ? ` | Tel: ${student.phone}` : '';
                    
                    studentDiv.innerHTML = `\n                        <div class="student-info">\n                            <div class="${studentNameClass}">${student.name}${statusDisplay}</div>\n                            <div class="student-email">${student.email}${cpfDisplay}${phoneDisplay}</div>\n                            <div class="student-course">\n                                ${coursesDisplay}\n                            </div>\n                        </div>\n                        <div class="student-actions">\n                            <button class="btn btn-sm btn-primary" onclick="openStudentProfileModal('${student.email}', '${student.name}')" ${isDisabled ? 'disabled' : ''}>\n                                <i class="fas fa-user"></i>\n                                Ver Perfil\n                            </button>\n                            <button class="btn btn-sm btn-primary" onclick="openAssignCourseModal('${student.email}', '${student.name}')" ${isDisabled ? 'disabled' : ''}>\n                                <i class="fas fa-book"></i>\n                                Atribuir Curso\n                            </button>\n                            <button class="btn btn-sm ${isDisabled ? 'btn-success' : 'btn-danger'}" onclick="${isDisabled ? 'reactivateStudent' : 'removeStudent'}('${student.email}')">\n                                <i class="fas fa-${isDisabled ? 'check' : 'trash'}"></i>\n                                ${isDisabled ? 'Reativar' : 'Remover'}\n                            </button>\n                        </div>\n                    `;
                    studentsList.appendChild(studentDiv);
                });
            } catch (error) {
                console.error("Erro ao carregar alunos:", error);
                showMessage(studentsMessageDiv, "Erro ao carregar lista de alunos.", "error");
            }
        }

        function openAssignCourseModal(studentEmail, studentName) {
            currentStudentForAssignment = studentEmail;
            modalStudentName.textContent = studentName;
            assignCourseModal.style.display = "flex";
        }

        function closeAssignCourseModal() {
            assignCourseModal.style.display = "none";
            currentStudentForAssignment = null;
            modalCourseSelect.value = "";
            modalMediaSource.value = "";
            modalPaymentMethod.value = "";
            modalDiscountValue.value = "";
            modalFinalValue.value = "";
            
            // Reset indication fields
            indicationNo.checked = true;
            indicationYes.checked = false;
            indicationSearchContainer.style.display = "none";
            indicationSearchInput.value = "";
            indicationSearchResults.style.display = "none";
            indicationSearchResults.innerHTML = "";
            selectedIndicatorEmail.value = "";
            indicationBonusContainer.style.display = "none";
            indicationBonusValue.value = "";
        }

        // Indication functions
        function toggleIndicationSearch() {
            if (indicationYes.checked) {
                indicationSearchContainer.style.display = "block";
                indicationBonusContainer.style.display = "block";
                calculateIndicationBonus();
            } else {
                indicationSearchContainer.style.display = "none";
                indicationBonusContainer.style.display = "none";
                indicationSearchInput.value = "";
                indicationSearchResults.style.display = "none";
                indicationSearchResults.innerHTML = "";
                selectedIndicatorEmail.value = "";
                indicationBonusValue.value = "";
            }
        }

        async function searchIndicatingStudent() {
            const searchTerm = indicationSearchInput.value.trim().toLowerCase();
            
            if (searchTerm.length < 2) {
                indicationSearchResults.style.display = "none";
                indicationSearchResults.innerHTML = "";
                return;
            }

            try {
                const studentsSnapshot = await getDocs(collection(firestore, "students"));
                const matchingStudents = [];
                
                studentsSnapshot.forEach((doc) => {
                    const student = doc.data();
                    
                    // Skip disabled students and the current student being assigned
                    if (student.status === "desativado" || student.email === currentStudentForAssignment) {
                        return;
                    }
                    
                    const name = (student.name || "").toLowerCase();
                    const cpf = (student.cpf || "").replace(/\D/g, '');
                    const searchCpf = searchTerm.replace(/\D/g, '');
                    
                    if (name.includes(searchTerm) || cpf.includes(searchCpf)) {
                        matchingStudents.push(student);
                    }
                });

                displaySearchResults(matchingStudents);
            } catch (error) {
                console.error("Erro ao buscar alunos:", error);
                indicationSearchResults.innerHTML = '<p style="color: var(--error-red); padding: var(--spacing-sm);">Erro ao buscar alunos.</p>';
                indicationSearchResults.style.display = "block";
            }
        }

        function displaySearchResults(students) {
            if (students.length === 0) {
                indicationSearchResults.innerHTML = '<p style="color: var(--text-muted); padding: var(--spacing-sm);">Nenhum aluno encontrado.</p>';
                indicationSearchResults.style.display = "block";
                return;
            }

            const resultsHtml = students.map(student => {
                const cpfDisplay = student.cpf ? ` | CPF: ${student.cpf}` : '';
                return `
                    <div class="search-result-item" onclick="selectIndicator('${student.email}', '${student.name}', '${student.cpf || ''}')" style="padding: var(--spacing-sm); border-bottom: 1px solid var(--border-color); cursor: pointer; transition: background-color 0.2s;">
                        <div style="font-weight: 500; color: var(--text-primary);">${student.name}</div>
                        <div style="font-size: var(--font-size-sm); color: var(--text-secondary);">${student.email}${cpfDisplay}</div>
                    </div>
                `;
            }).join('');

            indicationSearchResults.innerHTML = resultsHtml;
            indicationSearchResults.style.display = "block";

            // Add hover effects
            const resultItems = indicationSearchResults.querySelectorAll('.search-result-item');
            resultItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'var(--accent-blue-hover)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'transparent';
                });
            });
        }

        function selectIndicator(email, name, cpf) {
            selectedIndicatorEmail.value = email;
            const cpfDisplay = cpf ? ` | CPF: ${cpf}` : '';
            indicationSearchInput.value = `${name}${cpfDisplay}`;
            indicationSearchResults.style.display = "none";
            calculateIndicationBonus();
        }

        function calculateIndicationBonus() {
            const finalValue = parseFloat(modalFinalValue.value) || 0;
            if (finalValue > 0 && indicationYes.checked && selectedIndicatorEmail.value) {
                const bonusValue = finalValue * 0.1; // 10% do valor final
                indicationBonusValue.value = bonusValue.toFixed(2);
            } else {
                indicationBonusValue.value = "";
            }
        }

        async function assignCourse() {
            const selectedCourse = modalCourseSelect.value;
            const mediaSource = modalMediaSource.value;
            const paymentMethod = modalPaymentMethod.value;
            const discountValue = parseFloat(modalDiscountValue.value) || 0;
            const finalValue = parseFloat(modalFinalValue.value) || 0;
            
            // Get indication data
            const hasIndication = indicationYes.checked;
            const indicatorEmail = selectedIndicatorEmail.value;
            const indicationBonus = parseFloat(indicationBonusValue.value) || 0;
            
            if (!selectedCourse || !currentStudentForAssignment) {
                return;
            }

            if (!mediaSource || !paymentMethod) {
                showMessage(studentsMessageDiv, "Por favor, preencha todos os campos obrigatórios (Mídia de Origem e Método de Pagamento).", "error");
                return;
            }

            // Validate indication data if indication is selected
            if (hasIndication && !indicatorEmail) {
                showMessage(studentsMessageDiv, "Por favor, selecione um aluno indicador.", "error");
                return;
            }

            try {
                // Get current student data
                const studentDoc = await getDoc(doc(firestore, "students", currentStudentForAssignment));
                if (!studentDoc.exists()) {
                    showMessage(studentsMessageDiv, "Aluno não encontrado.", "error");
                    return;
                }

                const studentData = studentDoc.data();
                let assignedCourses = [];
                
                // Handle both old and new data structures
                if (studentData.assignedCourses && Array.isArray(studentData.assignedCourses)) {
                    assignedCourses = [...studentData.assignedCourses];
                } else if (studentData.assignedCourse && studentData.assignedCourse !== "") {
                    assignedCourses = [studentData.assignedCourse];
                }
                
                // Add new course if not already assigned
                if (!assignedCourses.includes(selectedCourse)) {
                    assignedCourses.push(selectedCourse);
                }

                // Create enrollment data with additional fields
                const enrollmentData = {
                    courseName: selectedCourse,
                    enrollmentDate: new Date().toISOString(),
                    mediaSource: mediaSource,
                    paymentMethod: paymentMethod,
                    discountValue: discountValue,
                    finalValue: finalValue,
                    hasIndication: hasIndication,
                    indicatorEmail: hasIndication ? indicatorEmail : null,
                    indicationBonus: hasIndication ? indicationBonus : 0
                };

                // Initialize enrollments array if it doesn't exist
                let enrollments = studentData.enrollments || [];
                enrollments.push(enrollmentData);
                
                // Save student enrollment data
                await setDoc(doc(firestore, "students", currentStudentForAssignment), {
                    ...studentData,
                    assignedCourses: assignedCourses,
                    enrollments: enrollments
                }, { merge: true });

                // Save revenue data
                const revenueData = {
                    courseName: selectedCourse,
                    originalValue: (await getDoc(doc(firestore, "courses", selectedCourse))).data().value,
                    finalValue: finalValue,
                    enrollmentDate: new Date().toISOString(),
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    studentEmail: currentStudentForAssignment,
                    paymentMethod: paymentMethod,
                    mediaSource: mediaSource
                };
                await setDoc(doc(collection(firestore, "revenue")), revenueData);

                // If there's an indication, save the bonus to the indicator's account
                if (hasIndication && indicatorEmail && indicationBonus > 0) {
                    try {
                        const indicatorDoc = await getDoc(doc(firestore, "students", indicatorEmail));
                        if (indicatorDoc.exists()) {
                            const indicatorData = indicatorDoc.data();
                            let indicationBonuses = indicatorData.indicationBonuses || [];
                            
                            const bonusData = {
                                studentEmail: currentStudentForAssignment,
                                courseName: selectedCourse,
                                bonusAmount: indicationBonus,
                                bonusDate: new Date().toISOString(),
                                status: "pending" // Can be "pending", "paid", "cancelled"
                            };
                            
                            indicationBonuses.push(bonusData);
                            
                            await setDoc(doc(firestore, "students", indicatorEmail), {
                                ...indicatorData,
                                indicationBonuses: indicationBonuses
                            }, { merge: true });
                        }
                    } catch (indicatorError) {
                        console.error("Erro ao salvar bônus do indicador:", indicatorError);
                        // Don't fail the entire operation if indicator bonus fails
                    }
                }
                
                closeAssignCourseModal();
                loadStudents();
                showMessage(studentsMessageDiv, "Curso atribuído com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao atribuir curso:", error);
                showMessage(studentsMessageDiv, "Erro ao atribuir curso. Tente novamente.", "error");
            }
        }

        async function removeStudent(studentEmail) {
            if (confirm(`Tem certeza que deseja desativar o aluno ${studentEmail}? O aluno não conseguirá mais fazer login.`)) {
                try {
                    // Obter o token de autenticação do usuário atual
                    const user = auth.currentUser;
                    if (!user) {
                        showMessage(studentsMessageDiv, "Você precisa estar logado para realizar esta operação.", "error");
                        return;
                    }

                    const idToken = await user.getIdToken();

                    // Mostrar mensagem de carregamento
                    showMessage(studentsMessageDiv, "Desativando aluno...", "warning");

                    // Fazer requisição HTTP para a Cloud Function para desativar o usuário
                    const response = await fetch('https://us-central1-allayproject-a9ccc.cloudfunctions.net/disableUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            userEmail: studentEmail,
                            idToken: idToken
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Atualizar o status do aluno no Firestore
                        await setDoc(doc(firestore, "students", studentEmail), {
                            status: "desativado",
                            disabledAt: new Date().toISOString()
                        }, { merge: true });

                        loadStudents();
                        showMessage(studentsMessageDiv, "Aluno desativado com sucesso!", "success");
                    } else {
                        // Tratar erros retornados pela Cloud Function
                        let errorMessage = result.error || "Erro ao desativar aluno.";
                        
                        // Mapear códigos de erro para mensagens mais amigáveis
                        switch (result.code) {
                            case 'unauthenticated':
                                errorMessage = "Você precisa estar autenticado para realizar esta operação.";
                                break;
                            case 'permission-denied':
                                errorMessage = "Você não tem permissão para realizar esta operação.";
                                break;
                            case 'not-found':
                                errorMessage = "Usuário não encontrado no sistema de autenticação.";
                                break;
                            case 'internal':
                                errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
                                break;
                        }
                        
                        showMessage(studentsMessageDiv, errorMessage, "error");
                    }

                } catch (error) {
                    console.error("Erro ao desativar aluno:", error);
                    
                    let errorMessage = "Erro ao desativar aluno. Tente novamente.";
                    
                    // Tratar erros de rede
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
                    } else if (error.name === 'SyntaxError') {
                        errorMessage = "Erro na resposta do servidor. Tente novamente.";
                    }
                    
                    showMessage(studentsMessageDiv, errorMessage, "error");
                }
            }
        }

        async function reactivateStudent(studentEmail) {
            if (confirm(`Tem certeza que deseja reativar o aluno ${studentEmail}? O aluno poderá fazer login novamente.`)) {
                try {
                    // Obter o token de autenticação do usuário atual
                    const user = auth.currentUser;
                    if (!user) {
                        showMessage(studentsMessageDiv, "Você precisa estar logado para realizar esta operação.", "error");
                        return;
                    }

                    const idToken = await user.getIdToken();

                    // Mostrar mensagem de carregamento
                    showMessage(studentsMessageDiv, "Reativando aluno...", "warning");

                    // Fazer requisição HTTP para a Cloud Function para reativar o usuário
                    const response = await fetch('https://us-central1-allayproject-a9ccc.cloudfunctions.net/enableUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            userEmail: studentEmail,
                            idToken: idToken
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Atualizar o status do aluno no Firestore
                        await setDoc(doc(firestore, "students", studentEmail), {
                            status: "ativo",
                            reactivatedAt: new Date().toISOString()
                        }, { merge: true });

                        loadStudents();
                        showMessage(studentsMessageDiv, "Aluno reativado com sucesso!", "success");
                    } else {
                        // Tratar erros retornados pela Cloud Function
                        let errorMessage = result.error || "Erro ao reativar aluno.";
                        
                        // Mapear códigos de erro para mensagens mais amigáveis
                        switch (result.code) {
                            case 'unauthenticated':
                                errorMessage = "Você precisa estar autenticado para realizar esta operação.";
                                break;
                            case 'permission-denied':
                                errorMessage = "Você não tem permissão para realizar esta operação.";
                                break;
                            case 'not-found':
                                errorMessage = "Usuário não encontrado no sistema de autenticação.";
                                break;
                            case 'internal':
                                errorMessage = "Erro interno do servidor. Tente novamente mais tarde.";
                                break;
                        }
                        
                        showMessage(studentsMessageDiv, errorMessage, "error");
                    }

                } catch (error) {
                    console.error("Erro ao reativar aluno:", error);
                    
                    let errorMessage = "Erro ao reativar aluno. Tente novamente.";
                    
                    // Tratar erros de rede
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
                    } else if (error.name === 'SyntaxError') {
                        errorMessage = "Erro na resposta do servidor. Tente novamente.";
                    }
                    
                    showMessage(studentsMessageDiv, errorMessage, "error");
                }
            }
        }

        // Student profile functions
        async function openStudentProfileModal(studentEmail, studentName) {
            try {
                // Get current student data
                const studentDoc = await getDoc(doc(firestore, "students", studentEmail));
                if (!studentDoc.exists()) {
                    showMessage(studentsMessageDiv, "Aluno não encontrado.", "error");
                    return;
                }

                const studentData = studentDoc.data();
                currentStudentForProfile = studentEmail;
                
                // Populate modal fields
                profileModalStudentEmail.textContent = studentEmail;
                profileStudentName.value = studentData.name || "";
                profileStudentPhone.value = studentData.phone || "";
                profileStudentCpf.value = studentData.cpf || "";
                profileStudentEmailDisplay.value = studentData.email || "";
                
                // Display assigned courses
                let assignedCourses = [];
                if (studentData.assignedCourses && Array.isArray(studentData.assignedCourses)) {
                    assignedCourses = studentData.assignedCourses;
                } else if (studentData.assignedCourse && studentData.assignedCourse !== "") {
                    assignedCourses = [studentData.assignedCourse];
                }
                
                if (assignedCourses.length > 0) {
                    profileAssignedCourses.innerHTML = assignedCourses.map(course => 
                        `<span style="display: inline-block; background: var(--accent-blue); color: white; padding: var(--spacing-xs) var(--spacing-sm); border-radius: var(--radius-sm); margin: var(--spacing-xs); font-size: var(--font-size-sm);">${course}</span>`
                    ).join('');
                } else {
                    profileAssignedCourses.innerHTML = '<p style="color: var(--text-muted); margin: 0;">Nenhum curso atribuído</p>';
                }
                
                studentProfileModal.style.display = "flex";
            } catch (error) {
                console.error("Erro ao carregar dados do aluno:", error);
                showMessage(studentsMessageDiv, "Erro ao carregar dados do aluno.", "error");
            }
        }

        function closeStudentProfileModal() {
            studentProfileModal.style.display = "none";
            currentStudentForProfile = null;
            
            // Clear form fields
            profileStudentName.value = "";
            profileStudentPhone.value = "";
            profileStudentCpf.value = "";
            profileStudentEmailDisplay.value = "";
            profileAssignedCourses.innerHTML = "";
        }

        async function saveProfileChanges() {
            if (!currentStudentForProfile) {
                return;
            }

            const newName = profileStudentName.value.trim();
            const newPhone = profileStudentPhone.value.trim();
            const newCpf = profileStudentCpf.value.trim();

            if (!newName) {
                showMessage(studentsMessageDiv, "Nome é obrigatório.", "error");
                return;
            }

            // Validate CPF if provided
            if (newCpf && !isValidCPF(newCpf.replace(/\D/g, ''))) {
                showMessage(studentsMessageDiv, "CPF inválido. Verifique os números digitados.", "error");
                return;
            }

            // Validate phone if provided
            if (newPhone) {
                const cleanPhone = newPhone.replace(/\D/g, '');
                if (cleanPhone.length < 10 || cleanPhone.length > 11) {
                    showMessage(studentsMessageDiv, "Número de telefone inválido. Deve conter 10 ou 11 dígitos.", "error");
                    return;
                }
            }

            try {
                // Get current student data
                const studentDoc = await getDoc(doc(firestore, "students", currentStudentForProfile));
                if (!studentDoc.exists()) {
                    showMessage(studentsMessageDiv, "Aluno não encontrado.", "error");
                    return;
                }

                const studentData = studentDoc.data();
                
                // Update student data in Firestore
                await setDoc(doc(firestore, "students", currentStudentForProfile), {
                    ...studentData,
                    name: newName,
                    phone: newPhone,
                    cpf: newCpf
                }, { merge: true });
                
                closeStudentProfileModal();
                loadStudents();
                showMessage(studentsMessageDiv, "Dados do aluno atualizados com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao atualizar dados do aluno:", error);
                showMessage(studentsMessageDiv, "Erro ao atualizar dados do aluno. Tente novamente.", "error");
            }
        }

        // Remove course functions
        async function openRemoveCourseModal(studentEmail, studentName) {
            try {
                // Get current student data
                const studentDoc = await getDoc(doc(firestore, "students", studentEmail));
                if (!studentDoc.exists()) {
                    showMessage(studentsMessageDiv, "Aluno não encontrado.", "error");
                    return;
                }

                const studentData = studentDoc.data();
                let assignedCourses = [];
                
                // Handle both old and new data structures
                if (studentData.assignedCourses && Array.isArray(studentData.assignedCourses)) {
                    assignedCourses = studentData.assignedCourses;
                } else if (studentData.assignedCourse && studentData.assignedCourse !== "") {
                    assignedCourses = [studentData.assignedCourse];
                }

                if (assignedCourses.length === 0) {
                    showMessage(studentsMessageDiv, "Este aluno não possui cursos atribuídos.", "error");
                    return;
                }

                currentStudentForRemoval = studentEmail;
                removeModalStudentName.textContent = studentName;
                
                // Populate courses list
                updateRemoveCoursesModal(assignedCourses);
                
                removeCourseModal.style.display = "flex";
            } catch (error) {
                console.error("Erro ao carregar dados do aluno:", error);
                showMessage(studentsMessageDiv, "Erro ao carregar dados do aluno.", "error");
            }
        }

        function updateRemoveCoursesModal(assignedCourses) {
            removeCoursesList.innerHTML = "";
            
            if (assignedCourses.length === 0) {
                removeCoursesList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-lg);">Nenhum curso atribuído.</p>';
                return


            }
            
            assignedCourses.forEach(course => {
                const courseDiv = document.createElement("div");
                courseDiv.className = "course-checkbox-item";
                courseDiv.innerHTML = `\n                    <input type="checkbox" id="remove-course-${course}" value="${course}">\n                    <label for="remove-course-${course}" class="course-checkbox-label">${course}</label>\n                `;
                removeCoursesList.appendChild(courseDiv);
                
                // Add click handler for the entire item
                courseDiv.addEventListener('click', function(e) {
                    if (e.target.type !== 'checkbox') {
                        const checkbox = courseDiv.querySelector('input[type="checkbox"]');
                        checkbox.checked = !checkbox.checked;
                    }
                    
                    if (courseDiv.querySelector('input[type="checkbox"]').checked) {
                        courseDiv.classList.add('checked');
                    } else {
                        courseDiv.classList.remove('checked');
                    }
                });
            });
        }

        function closeRemoveCourseModal() {
            removeCourseModal.style.display = "none";
            currentStudentForRemoval = null;
            removeCoursesList.innerHTML = "";
        }

        async function removeSelectedCourses() {
            if (!currentStudentForRemoval) {
                return;
            }

            const checkboxes = removeCoursesList.querySelectorAll('input[type="checkbox"]:checked');
            const coursesToRemove = Array.from(checkboxes).map(cb => cb.value);

            if (coursesToRemove.length === 0) {
                showMessage(studentsMessageDiv, "Selecione pelo menos um curso para remover.", "error");
                return;
            }

            if (!confirm(`Tem certeza que deseja remover ${coursesToRemove.length} curso(s) do aluno? Esta ação não pode ser desfeita.`)) {
                return;
            }

            try {
                // Get current student data
                const studentDoc = await getDoc(doc(firestore, "students", currentStudentForRemoval));
                if (!studentDoc.exists()) {
                    showMessage(studentsMessageDiv, "Aluno não encontrado.", "error");
                    return;
                }

                const studentData = studentDoc.data();
                let assignedCourses = [];
                
                // Handle both old and new data structures
                if (studentData.assignedCourses && Array.isArray(studentData.assignedCourses)) {
                    assignedCourses = [...studentData.assignedCourses];
                } else if (studentData.assignedCourse && studentData.assignedCourse !== "") {
                    assignedCourses = [studentData.assignedCourse];
                }
                
                // Remove selected courses
                const updatedCourses = assignedCourses.filter(course => !coursesToRemove.includes(course));
                
                // Update student data in Firestore
                await setDoc(doc(firestore, "students", currentStudentForRemoval), {
                    ...studentData,
                    assignedCourses: updatedCourses
                }, { merge: true });
                
                closeRemoveCourseModal();
                loadStudents();
                showMessage(studentsMessageDiv, `${coursesToRemove.length} curso(s) removido(s) com sucesso!`, "success");
            } catch (error) {
                console.error("Erro ao remover cursos:", error);
                showMessage(studentsMessageDiv, "Erro ao remover cursos. Tente novamente.", "error");
            }
        }

        // Support Settings functions
        async function loadSupportSettings() {
            try {
                const settingsDoc = await getDoc(doc(firestore, "settings", "support"));
                if (settingsDoc.exists()) {
                    const settings = settingsDoc.data();
                    
                    // Load WhatsApp numbers
                    const whatsappNumbers = settings.whatsappNumbers || [];
                    renderWhatsappNumbers(whatsappNumbers);
                    
                    // Load support email
                    supportEmailInput.value = settings.supportEmail || "";
                } else {
                    // Initialize with empty settings
                    renderWhatsappNumbers([]);
                    supportEmailInput.value = "";
                }
            } catch (error) {
                console.error("Erro ao carregar configurações de suporte:", error);
                showMessage(supportSettingsMessageDiv, "Erro ao carregar configurações.", "error");
            }
        }

        function renderWhatsappNumbers(numbers) {
            whatsappNumbersContainer.innerHTML = "";
            
            if (numbers.length === 0) {
                whatsappNumbersContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-lg);">Nenhum número cadastrado.</p>';
                return;
            }
            
            numbers.forEach((number, index) => {
                const numberDiv = document.createElement("div");
                numberDiv.className = "support-contact-item";
                numberDiv.innerHTML = `\n                    <input type="tel" value="${number}" class="form-input" placeholder="(11) 99999-9999" onchange="updateWhatsappNumber(${index}, this.value)">\n                    <button class="btn btn-danger btn-sm" onclick="removeWhatsappNumber(${index})">\n                        <i class="fas fa-trash"></i>\n                        Remover\n                    </button>\n                `;
                whatsappNumbersContainer.appendChild(numberDiv);
            });
        }

        function addWhatsappNumber() {
            const currentNumbers = getCurrentWhatsappNumbers();
            currentNumbers.push("");
            renderWhatsappNumbers(currentNumbers);
        }

        function removeWhatsappNumber(index) {
            const currentNumbers = getCurrentWhatsappNumbers();
            currentNumbers.splice(index, 1);
            renderWhatsappNumbers(currentNumbers);
        }

        function updateWhatsappNumber(index, newValue) {
            // This function is called when input changes, no need to re-render
        }

        function getCurrentWhatsappNumbers() {
            const inputs = whatsappNumbersContainer.querySelectorAll('input[type="tel"]');
            return Array.from(inputs).map(input => input.value.trim()).filter(value => value !== "");
        }

        async function saveSupportSettings() {
            const whatsappNumbers = getCurrentWhatsappNumbers();
            const supportEmail = supportEmailInput.value.trim();

            // Validate email if provided
            if (supportEmail && !isValidEmail(supportEmail)) {
                showMessage(supportSettingsMessageDiv, "Email inválido.", "error");
                return;
            }

            // Validate phone numbers
            for (let number of whatsappNumbers) {
                const cleanNumber = number.replace(/\D/g, '');
                if (cleanNumber.length < 10 || cleanNumber.length > 11) {
                    showMessage(supportSettingsMessageDiv, `Número inválido: ${number}. Deve conter 10 ou 11 dígitos.`, "error");
                    return;
                }
            }

            try {
                await setDoc(doc(firestore, "settings", "support"), {
                    whatsappNumbers: whatsappNumbers,
                    supportEmail: supportEmail,
                    lastUpdated: new Date().toISOString()
                });
                
                showMessage(supportSettingsMessageDiv, "Configurações salvas com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao salvar configurações:", error);
                showMessage(supportSettingsMessageDiv, "Erro ao salvar configurações. Tente novamente.", "error");
            }
        }

        // Notifications functions
        async function publishNotification() {
            const title = notificationTitleInput.value.trim();
            const content = notificationContentInput.value.trim();
            const priority = notificationPrioritySelect.value;

            if (!title || !content) {
                showMessage(notificationsMessageDiv, "Por favor, preencha o título e o conteúdo da notificação.", "error");
                return;
            }

            try {
                const notificationId = Date.now().toString();
                await setDoc(doc(firestore, "notifications", notificationId), {
                    title: title,
                    content: content,
                    priority: priority,
                    publishedAt: new Date().toISOString(),
                    publishedBy: "admin"
                });
                
                // Clear form
                notificationTitleInput.value = "";
                notificationContentInput.value = "";
                notificationPrioritySelect.value = "normal";
                
                showMessage(notificationsMessageDiv, "Notificação publicada com sucesso!", "success");
                loadNotifications();
            } catch (error) {
                console.error("Erro ao publicar notificação:", error);
                showMessage(notificationsMessageDiv, "Erro ao publicar notificação. Tente novamente.", "error");
            }
        }

        async function loadNotifications() {
            try {
                const notificationsSnapshot = await getDocs(collection(firestore, "notifications"));
                notificationsList.innerHTML = "";
                
                if (notificationsSnapshot.empty) {
                    notificationsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">Nenhuma notificação publicada.</p>';
                    return;
                }
                
                // Convert to array and sort by date (newest first)
                const notifications = [];
                notificationsSnapshot.forEach((doc) => {
                    notifications.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                notifications.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                
                notifications.forEach((notification) => {
                    const priorityColors = {
                        normal: "var(--text-secondary)",
                        importante: "var(--warning-yellow)",
                        urgente: "var(--error-red)"
                    };
                    
                    const priorityIcons = {
                        normal: "fas fa-info-circle",
                        importante: "fas fa-exclamation-triangle",
                        urgente: "fas fa-exclamation-circle"
                    };
                    
                    const publishedDate = new Date(notification.publishedAt).toLocaleString('pt-BR');
                    
                    const notificationDiv = document.createElement("div");
                    notificationDiv.className = "student-item";
                    notificationDiv.innerHTML = `\n                        <div class="student-info">\n                            <div class="student-name" style="display: flex; align-items: center; gap: var(--spacing-sm);">\n                                <i class="${priorityIcons[notification.priority]}" style="color: ${priorityColors[notification.priority]};"></i>\n                                ${notification.title}\n                            </div>\n                            <div class="student-email">${notification.content}</div>\n                            <div class="student-course">\n                                Publicado em: ${publishedDate} | Prioridade: ${notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}\n                            </div>\n                        </div>\n                        <div class="student-actions">\n                            <button class="btn btn-sm btn-danger" onclick="deleteNotification('${notification.id}')">\n                                <i class="fas fa-trash"></i>\n                                Excluir\n                            </button>\n                        </div>\n                    `;
                    notificationsList.appendChild(notificationDiv);
                });
            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
                showMessage(notificationsMessageDiv, "Erro ao carregar notificações.", "error");
            }
        }

        async function deleteNotification(notificationId) {
            if (confirm("Tem certeza que deseja excluir esta notificação?")) {
                try {
                    await deleteDoc(doc(firestore, "notifications", notificationId));
                    loadNotifications();
                    showMessage(notificationsMessageDiv, "Notificação excluída com sucesso!", "success");
                } catch (error) {
                    console.error("Erro ao excluir notificação:", error);
                    showMessage(notificationsMessageDiv, "Erro ao excluir notificação. Tente novamente.", "error");
                }
            }
        }

        // Utility functions
        function showMessage(element, message, type) {
            element.textContent = message;
            element.className = `message ${type}`;
            element.style.display = "flex";
            
            setTimeout(() => {
                element.style.display = "none";
            }, 5000);
        }

        function clearEnrollmentForm() {
            studentNameInput.value = "";
            studentCpfInput.value = "";
            studentPhoneInput.value = "";
            studentEmailInput.value = "";
            studentPasswordInput.value = "";
        }

        function isValidCPF(cpf) {
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false;
            }
            
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(9))) return false;
            
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(10))) return false;
            
            return true;
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function filterStudents() {
            const searchTerm = document.getElementById("student-search-input").value.toLowerCase();
            const studentItems = document.querySelectorAll("#students-list .student-item");
            
            studentItems.forEach(item => {
                const studentInfo = item.querySelector(".student-info").textContent.toLowerCase();
                if (studentInfo.includes(searchTerm)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        }

        async function updateDashboardStats() {
            try {
                // Count courses
                const coursesSnapshot = await getDocs(collection(firestore, "courses"));
                document.getElementById("total-courses").textContent = coursesSnapshot.size;
                
                // Count students
                const studentsSnapshot = await getDocs(collection(firestore, "students"));
                let activeStudents = 0;
                let totalVideos = 0;
                
                studentsSnapshot.forEach((doc) => {
                    const student = doc.data();
                    if (student.status !== "desativado") {
                        activeStudents++;
                    }
                });
                
                document.getElementById("total-students").textContent = activeStudents;
                
                // Count videos across all courses
                coursesSnapshot.forEach((doc) => {
                    const course = doc.data();
                    if (course.modules && Array.isArray(course.modules)) {
                        course.modules.forEach(module => {
                            if (module.videos && Array.isArray(module.videos)) {
                                totalVideos += module.videos.length;
                            }
                        });
                    }
                });
                
                document.getElementById("total-videos").textContent = totalVideos;
                
            } catch (error) {
                console.error("Erro ao atualizar estatísticas:", error);
            }
        }

        // Auto-format inputs
        function formatCPF(input) {
            let value = input.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            input.value = value;
        }

        function formatPhone(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            input.value = value;
        }

        // Calculate final value when discount changes
        async function calculateFinalValue() {
            const selectedCourse = modalCourseSelect.value;
            if (!selectedCourse) {
                modalFinalValue.value = "";
                calculateIndicationBonus();
                return;
            }
            
            try {
                // Get course value from Firebase
                const courseDoc = await getDoc(doc(firestore, "courses", selectedCourse));
                if (courseDoc.exists()) {
                    const courseData = courseDoc.data();
                    const courseValue = courseData.value || 0;
                    const discountValue = parseFloat(modalDiscountValue.value) || 0;
                    const finalValue = Math.max(0, courseValue - discountValue);
                    modalFinalValue.value = finalValue.toFixed(2);
                    
                    // Calculate indication bonus
                    calculateIndicationBonus();
                } else {
                    modalFinalValue.value = "";
                    calculateIndicationBonus();
                }
            } catch (error) {
                console.error("Erro ao calcular valor final:", error);
                modalFinalValue.value = "";
                calculateIndicationBonus();
            }
        }

        // Event listeners
        addCourseButton.addEventListener("click", addCourse);
        selectCourseButton.addEventListener("click", selectCourse);
        deleteCourseButton.addEventListener("click", deleteCourse);
        addModuleButton.addEventListener("click", addModule);
        saveCourseDataButton.addEventListener("click", saveCourseData);
        
        addTeacherButton.addEventListener("click", addTeacher);

        // Course teacher selection event listeners
        hasTeacherNo.addEventListener("change", toggleTeacherSelection);
        hasTeacherYes.addEventListener("change", toggleTeacherSelection);
        
        addStudentButton.addEventListener("click", addStudent);
        
        assignCourseConfirm.addEventListener("click", assignCourse);
        assignCourseCancel.addEventListener("click", closeAssignCourseModal);
        
        profileSaveChanges.addEventListener("click", saveProfileChanges);
        profileAssignCourse.addEventListener("click", () => {
            closeStudentProfileModal();
            openAssignCourseModal(currentStudentForProfile, profileStudentName.value);
        });
        profileRemoveCourse.addEventListener("click", () => {
            closeStudentProfileModal();
            openRemoveCourseModal(currentStudentForProfile, profileStudentName.value);
        });
        profileRemoveStudent.addEventListener("click", () => {
            closeStudentProfileModal();
            removeStudent(currentStudentForProfile);
        });
        profileClose.addEventListener("click", closeStudentProfileModal);
        profileViewIndications.addEventListener("click", () => openIndicationsModal(currentStudentForProfile));
        
        removeCourseConfirm.addEventListener("click", removeSelectedCourses);
        removeCourseCancel.addEventListener("click", closeRemoveCourseModal);
        
        addWhatsappNumberButton.addEventListener("click", addWhatsappNumber);
        saveSupportSettingsButton.addEventListener("click", saveSupportSettings);
        
        publishNotificationButton.addEventListener("click", publishNotification);

        publishPrivacyPolicyButton.addEventListener("click", savePrivacyPolicy);
        
        modalDiscountValue.addEventListener("input", calculateFinalValue);
        modalCourseSelect.addEventListener("change", calculateFinalValue);
        
        // Indication event listeners
        indicationNo.addEventListener("change", toggleIndicationSearch);
        indicationYes.addEventListener("change", toggleIndicationSearch);
        
        // Auto-format inputs
        studentCpfInput.addEventListener("input", () => formatCPF(studentCpfInput));
        studentPhoneInput.addEventListener("input", () => formatPhone(studentPhoneInput));
        teacherPhoneInput.addEventListener("input", () => formatPhone(teacherPhoneInput));
        profileStudentCpf.addEventListener("input", () => formatCPF(profileStudentCpf));
        profileStudentPhone.addEventListener("input", () => formatPhone(profileStudentPhone));

        // Make functions global so they can be called from HTML onclick attributes
        window.updateModuleName = updateModuleName;
        window.addVideo = addVideo;
        window.addQuizQuestion = addQuizQuestion;
        window.removeModule = removeModule;
        window.removeVideo = removeVideo;
        window.removeQuizQuestion = removeQuizQuestion;
        window.updateVideoTitle = updateVideoTitle;
        window.updateVideoUrl = updateVideoUrl;
        window.updateQuizQuestion = updateQuizQuestion;
        window.updateQuizOption = updateQuizOption;
        window.updateCorrectAnswer = updateCorrectAnswer;
        window.openAssignCourseModal = openAssignCourseModal;
        window.openStudentProfileModal = openStudentProfileModal;
        window.openRemoveCourseModal = openRemoveCourseModal;
        window.removeStudent = removeStudent;
        window.reactivateStudent = reactivateStudent;
        window.loadStudents = loadStudents;
        window.loadTeachers = loadTeachers;
        window.editTeacher = editTeacher;
        window.removeTeacher = removeTeacher;
        window.reactivateTeacher = reactivateTeacher;
        window.clearTeacherForm = clearTeacherForm;
        window.filterTeachers = filterTeachers;
        window.loadNotifications = loadNotifications;
        window.deleteNotification = deleteNotification;
        window.clearEnrollmentForm = clearEnrollmentForm;
        window.filterStudents = filterStudents;
        window.searchIndicatingStudent = searchIndicatingStudent;
        window.selectIndicator = selectIndicator;
        window.loadIndications = loadIndications;
        window.updateIndicationStatus = updateIndicationStatus;
        window.deleteIndication = deleteIndication;
        window.searchStudentsForIndication = searchStudentsForIndication;

        // Privacy Policy functions
        async function savePrivacyPolicy() {
            const content = privacyPolicyContent.value.trim();

            if (!content) {
                showMessage(privacyPolicyMessageDiv, "Por favor, digite o conteúdo da política de privacidade.", "error");
                return;
            }

            try {
                await setDoc(doc(firestore, "settings", "privacyPolicy"), {
                    content: content,
                    lastUpdated: new Date().toISOString()
                });
                
                // Update the display with the new content
                document.getElementById("privacy-policy-display").innerHTML = marked.parse(content);
                
                showMessage(privacyPolicyMessageDiv, "Política de Privacidade publicada com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao publicar política de privacidade:", error);
                showMessage(privacyPolicyMessageDiv, "Erro ao publicar política de privacidade. Tente novamente.", "error");
            }
        }

        async function loadPrivacyPolicy() {
            try {
                const docRef = doc(firestore, "settings", "privacyPolicy");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    privacyPolicyContent.value = docSnap.data().content;
                    // Render the Markdown content to HTML
                    document.getElementById("privacy-policy-display").innerHTML = marked.parse(docSnap.data().content);
                } else {
                    privacyPolicyContent.value = "Nenhuma política de privacidade encontrada. Digite o conteúdo e publique.";
                    document.getElementById("privacy-policy-display").innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">Nenhuma política de privacidade publicada ainda.</p>';
                }
            } catch (error) {
                console.error("Erro ao carregar política de privacidade:", error);
                showMessage(privacyPolicyMessageDiv, "Erro ao carregar política de privacidade. Tente novamente.", "error");
            }
        }

        // Materials management functions
        async function loadMaterials() {
            try {
                showMessage(materialsMessageDiv, "Carregando ficheiros...", "warning");
                
                // Load folders and files from Firebase Storage
                await loadFilesAndFoldersFromFirebase(currentFolder);
                
                renderFolderSelect();
                renderFilesList();
                
                showMessage(materialsMessageDiv, "Ficheiros carregados com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao carregar materiais:", error);
                showMessage(materialsMessageDiv, "Erro ao carregar ficheiros. Tente novamente.", "error");
            }

        }

        // Indications management functions
        async function loadIndications() {
            try {
                showMessage(indicationsMessageDiv, "Carregando indicações...", "warning");
                
                const indicationsSnapshot = await getDocs(collection(firestore, "indications"));
                indicationsTbody.innerHTML = "";
                
                if (indicationsSnapshot.empty) {
                    indicationsTbody.innerHTML = `
                        <tr>
                            <td colspan="7" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                                Nenhuma indicação encontrada. Clique em "Adicionar Indicação" para criar a primeira.
                            </td>
                        </tr>
                    `;
                    showMessage(indicationsMessageDiv, "Nenhuma indicação encontrada.", "warning");
                    return;
                }
                
                for (const docSnap of indicationsSnapshot.docs) {
                    const indication = docSnap.data();
                    indication.id = docSnap.id;
                    
                    // Get student names from emails
                    const indicatorName = await getStudentNameByEmail(indication.indicatorEmail);
                    const indicatedName = await getStudentNameByEmail(indication.indicatedEmail);
                    
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${indicatorName || indication.indicatorEmail}</td>
                        <td>${indicatedName || indication.indicatedEmail}</td>
                        <td>${indication.courseName}</td>
                        <td>${new Date(indication.date).toLocaleDateString('pt-BR')}</td>
                        <td>
                            <select class="form-select" onchange="updateIndicationStatus('${indication.id}', this.value)">
                                <option value="pending" ${indication.status === 'pending' ? 'selected' : ''}>Pendente</option>
                                <option value="approved" ${indication.status === 'approved' ? 'selected' : ''}>Aprovado</option>
                                <option value="rejected" ${indication.status === 'rejected' ? 'selected' : ''}>Não Aprovado</option>
                            </select>
                        </td>
                        <td>R$ ${(indication.points || 0).toFixed(2)}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="deleteIndication('${indication.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    indicationsTbody.appendChild(row);
                }
                
                showMessage(indicationsMessageDiv, "Indicações carregadas com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao carregar indicações:", error);
                showMessage(indicationsMessageDiv, "Erro ao carregar indicações. Tente novamente.", "error");
            }
        }

        async function getStudentNameByEmail(email) {
            try {
                const studentDoc = await getDoc(doc(firestore, "students", email));
                if (studentDoc.exists()) {
                    return studentDoc.data().name;
                }
                return null;
            } catch (error) {
                console.error("Erro ao buscar nome do aluno:", error);
                return null;
            }
        }

        async function updateIndicationStatus(indicationId, newStatus) {
            try {
                await setDoc(doc(firestore, "indications", indicationId), {
                    status: newStatus
                }, { merge: true });
                
                showMessage(indicationsMessageDiv, "Status da indicação atualizado com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao atualizar status da indicação:", error);
                showMessage(indicationsMessageDiv, "Erro ao atualizar status. Tente novamente.", "error");
            }
        }

        async function deleteIndication(indicationId) {
            if (confirm("Tem certeza que deseja excluir esta indicação?")) {
                try {
                    await deleteDoc(doc(firestore, "indications", indicationId));
                    loadIndications();
                    showMessage(indicationsMessageDiv, "Indicação excluída com sucesso!", "success");
                } catch (error) {
                    console.error("Erro ao excluir indicação:", error);
                    showMessage(indicationsMessageDiv, "Erro ao excluir indicação. Tente novamente.", "error");
                }
            }
        }

        function openAddIndicationModal() {
            // Clear form
            indicatorStudentSearch.value = "";
            indicatedStudentSearch.value = "";
            selectedIndicatorEmailModal.value = "";
            selectedIndicatedEmailModal.value = "";
            indicationCourseSelect.value = "";
            indicationDate.value = new Date().toISOString().split('T')[0];
            indicationStatusSelect.value = "pending";
            indicationPoints.value = "";
            
            // Hide search results
            indicatorStudentResults.style.display = "none";
            indicatedStudentResults.style.display = "none";
            
            // Load courses for selection
            loadCoursesForIndication();
            
            addIndicationModal.style.display = "flex";
        }

        function closeAddIndicationModal() {
            addIndicationModal.style.display = "none";
        }

        async function loadCoursesForIndication() {
            try {
                const coursesSnapshot = await getDocs(collection(firestore, "courses"));
                indicationCourseSelect.innerHTML = '<option value="">Selecione o curso...</option>';
                
                coursesSnapshot.forEach((doc) => {
                    const course = doc.data();
                    const option = document.createElement("option");
                    option.value = doc.id;
                    option.textContent = course.name;
                    indicationCourseSelect.appendChild(option);
                });
            } catch (error) {
                console.error("Erro ao carregar cursos:", error);
            }
        }

        async function searchStudentsForIndication(type) {
            const searchInput = type === "indicator" ? indicatorStudentSearch : indicatedStudentSearch;
            const resultsContainer = type === "indicator" ? indicatorStudentResults : indicatedStudentResults;
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm.length < 2) {
                resultsContainer.style.display = "none";
                return;
            }
            
            try {
                const studentsSnapshot = await getDocs(collection(firestore, "students"));
                const results = [];
                
                studentsSnapshot.forEach((doc) => {
                    const student = doc.data();
                    if (student.status !== "desativado" && 
                        (student.name.toLowerCase().includes(searchTerm) || 
                         student.cpf?.includes(searchTerm))) {
                        results.push({
                            email: doc.id,
                            name: student.name,
                            cpf: student.cpf
                        });
                    }
                });
                
                resultsContainer.innerHTML = "";
                
                if (results.length === 0) {
                    resultsContainer.innerHTML = '<div style="padding: var(--spacing-sm); color: var(--text-muted);">Nenhum aluno encontrado</div>';
                } else {
                    results.forEach(student => {
                        const resultDiv = document.createElement("div");
                        resultDiv.className = "search-result-item";
                        resultDiv.style.cssText = "padding: var(--spacing-sm); cursor: pointer; border-bottom: 1px solid var(--border-color);";
                        resultDiv.innerHTML = `
                            <div style="font-weight: 500;">${student.name}</div>
                            <div style="font-size: var(--font-size-sm); color: var(--text-muted);">${student.email}</div>
                        `;
                        resultDiv.onclick = () => selectStudentForIndication(type, student);
                        resultsContainer.appendChild(resultDiv);
                    });
                }
                
                resultsContainer.style.display = "block";
            } catch (error) {
                console.error("Erro ao buscar alunos:", error);
            }
        }

        function selectStudentForIndication(type, student) {
            if (type === "indicator") {
                indicatorStudentSearch.value = student.name;
                selectedIndicatorEmailModal.value = student.email;
                indicatorStudentResults.style.display = "none";
            } else {
                indicatedStudentSearch.value = student.name;
                selectedIndicatedEmailModal.value = student.email;
                indicatedStudentResults.style.display = "none";
            }
        }

        async function saveIndication() {
            const indicatorEmail = selectedIndicatorEmailModal.value;
            const indicatedEmail = selectedIndicatedEmailModal.value;
            const courseId = indicationCourseSelect.value;
            const date = indicationDate.value;
            const status = indicationStatusSelect.value;
            const points = parseFloat(indicationPoints.value) || 0;
            
            if (!indicatorEmail || !indicatedEmail || !courseId || !date) {
                showMessage(indicationsMessageDiv, "Por favor, preencha todos os campos obrigatórios.", "error");
                return;
            }
            
            if (indicatorEmail === indicatedEmail) {
                showMessage(indicationsMessageDiv, "O aluno indicador não pode ser o mesmo que o aluno indicado.", "error");
                return;
            }
            
            try {
                // Get course name
                const courseDoc = await getDoc(doc(firestore, "courses", courseId));
                const courseName = courseDoc.exists() ? courseDoc.data().name : "Curso não encontrado";
                
                const indicationData = {
                    indicatorEmail: indicatorEmail,
                    indicatedEmail: indicatedEmail,
                    courseId: courseId,
                    courseName: courseName,
                    date: date,
                    status: status,
                    points: points,
                    createdAt: new Date().toISOString()
                };
                
                await setDoc(doc(firestore, "indications", `${indicatorEmail}_${indicatedEmail}_${courseId}_${Date.now()}`), indicationData);
                
                closeAddIndicationModal();
                loadIndications();
                showMessage(indicationsMessageDiv, "Indicação adicionada com sucesso!", "success");
            } catch (error) {
                console.error("Erro ao salvar indicação:", error);
                showMessage(indicationsMessageDiv, "Erro ao salvar indicação. Tente novamente.", "error");
            }
        }

        closeIndicationsModalButton.addEventListener("click", closeIndicationsModal);
        

        
// Initialize the application
        loadCourses();
        updateDashboardStats();

    })();

        async function openIndicationsModal(studentEmail) {
            try {
                const studentDoc = await getDoc(doc(firestore, "students", studentEmail));
                if (!studentDoc.exists()) {
                    showMessage(studentIndicationsMessage, "Aluno não encontrado.", "error");
                    return;
                }
                const studentData = studentDoc.data();
                indicationsModalStudentName.textContent = studentData.name || studentEmail;
                studentIndicationsTbody.innerHTML = "";
                showMessage(studentIndicationsMessage, "Carregando indicações...", "warning");

                const indicationsSnapshot = await getDocs(collection(firestore, "indications"));
                let foundIndications = [];

                for (const docSnap of indicationsSnapshot.docs) {
                    const indication = docSnap.data();
                    if (indication.indicatorEmail === studentEmail || indication.indicatedEmail === studentEmail) {
                        foundIndications.push(indication);
                    }
                }

                if (foundIndications.length === 0) {
                    studentIndicationsTbody.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center; color: var(--text-muted); padding: var(--spacing-xl);">
                                Nenhuma indicação encontrada para este aluno.
                            </td>
                        </tr>
                    `;
                    showMessage(studentIndicationsMessage, "Nenhuma indicação encontrada para este aluno.", "info");
                } else {
                    for (const indication of foundIndications) {
                        const indicatorName = await getStudentNameByEmail(indication.indicatorEmail);
                        const indicatedName = await getStudentNameByEmail(indication.indicatedEmail);
                        const row = document.createElement("tr");
                        row.innerHTML = `
                            <td>${indicatorName || indication.indicatorEmail}</td>
                            <td>${indicatedName || indication.indicatedEmail}</td>
                            <td>${indication.courseName}</td>
                            <td>${new Date(indication.date).toLocaleDateString("pt-BR")}</td>
                            <td>${indication.status}</td>
                            <td>R$ ${(indication.points || 0).toFixed(2)}</td>
                        `;
                        studentIndicationsTbody.appendChild(row);
                    }
                    showMessage(studentIndicationsMessage, "Indicações carregadas com sucesso!", "success");
                }

                studentIndicationsModal.style.display = "flex";
            } catch (error) {
                console.error("Erro ao carregar indicações do aluno:", error);
                showMessage(studentIndicationsMessage, "Erro ao carregar indicações do aluno. Tente novamente.", "error");
            }
        }
    
        function closeIndicationsModal() {
            studentIndicationsModal.style.display = "none";
            studentIndicationsTbody.innerHTML = "";
            studentIndicationsMessage.style.display = "none";
        }

        window.openIndicationsModal = openIndicationsModal;
        window.closeIndicationsModal = closeIndicationsModal;

        // Event listeners for indications
        addIndicationButton.addEventListener("click", openAddIndicationModal);
        saveIndicationButton.addEventListener("click", saveIndication);
        cancelAddIndicationButton.addEventListener("click", closeAddIndicationModal);

        // ===== TABS FUNCTIONALITY =====
        function initializeTabs() {
            console.log('🔧 Inicializando sistema de abas...');
            
            try {
                const tabButtons = document.querySelectorAll('.tab-button');
                const tabContents = document.querySelectorAll('.tab-content');
                
                console.log('📋 Elementos encontrados:');
                console.log('   - Botões de aba:', tabButtons.length);
                console.log('   - Conteúdos de aba:', tabContents.length);

                if (tabButtons.length === 0) {
                    console.error('❌ Nenhum botão de aba encontrado!');
                    return;
                }

                if (tabContents.length === 0) {
                    console.error('❌ Nenhum conteúdo de aba encontrado!');
                    return;
                }

                // Adicionar event listeners de forma mais simples
                for (let i = 0; i < tabButtons.length; i++) {
                    const button = tabButtons[i];
                    const targetTab = button.getAttribute('data-tab');
                    
                    console.log(`   - Configurando botão: data-tab="${targetTab}"`);
                    
                    // Usar onclick em vez de addEventListener para maior compatibilidade
                    button.onclick = function(e) {
                        if (e && e.preventDefault) {
                            e.preventDefault();
                        }
                        
                        console.log(`🖱️ Clicou na aba: ${targetTab}`);
                        
                        // Remover classe active de todos os botões
                        for (let j = 0; j < tabButtons.length; j++) {
                            tabButtons[j].classList.remove('active');
                        }
                        
                        // Esconder todos os conteúdos
                        for (let k = 0; k < tabContents.length; k++) {
                            tabContents[k].classList.remove('active');
                            tabContents[k].style.display = 'none';
                        }
                        
                        // Ativar botão clicado
                        button.classList.add('active');
                        
                        // Mostrar conteúdo correspondente
                        const targetContent = document.getElementById(targetTab);
                        if (targetContent) {
                            targetContent.classList.add('active');
                            targetContent.style.display = 'block';
                            console.log(`✅ Aba "${targetTab}" ativada com sucesso!`);
                        } else {
                            console.error(`❌ Conteúdo da aba "${targetTab}" não encontrado!`);
                        }
                        
                        return false; // Prevenir comportamento padrão
                    };
                }

                console.log('🎉 Sistema de abas inicializado com sucesso!');
                
            } catch (error) {
                console.error('❌ Erro ao inicializar abas:', error);
            }
        }

        // Clear course form function
        function clearCourseForm() {
            courseNameInput.value = "";
            courseValueInput.value = "";
            courseWorkloadInput.value = "";
            courseDescriptionInput.value = "";
            hasTeacherNo.checked = true;
            hasTeacherYes.checked = false;
            courseTeacherSelect.value = "";
            teacherSelectionContainer.style.display = "none";
            
            // Remove any validation classes
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });
            
            showMessage(coursesMessageDiv, "Formulário limpo com sucesso!", "success");
        }

        // Enhanced form validation
        function validateCourseForm() {
            let isValid = true;
            const requiredFields = [
                { element: courseNameInput, name: "Nome do Curso" },
                { element: courseValueInput, name: "Valor" },
                { element: courseWorkloadInput, name: "Carga Horária" },
                { element: courseDescriptionInput, name: "Descrição" }
            ];

            // Clear previous validation states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
            });

            // Validate required fields
            requiredFields.forEach(field => {
                const formGroup = field.element.closest('.form-group');
                if (!field.element.value.trim()) {
                    formGroup.classList.add('error');
                    isValid = false;
                } else {
                    formGroup.classList.add('success');
                }
            });

            // Validate teacher selection if required
            if (hasTeacherYes.checked) {
                const teacherFormGroup = courseTeacherSelect.closest('.form-group');
                if (!courseTeacherSelect.value) {
                    teacherFormGroup.classList.add('error');
                    isValid = false;
                } else {
                    teacherFormGroup.classList.add('success');
                }
            }

            return isValid;
        }

        // Enhanced addCourse function with validation
        const originalAddCourse = addCourse;
        addCourse = async function() {
            // Add loading state
            const addButton = document.getElementById('add-course-button');
            addButton.classList.add('loading');
            addButton.disabled = true;

            try {
                if (!validateCourseForm()) {
                    showMessage(coursesMessageDiv, "Por favor, preencha todos os campos obrigatórios corretamente.", "error");
                    return;
                }

                await originalAddCourse();
                
                // Clear form after successful creation
                clearCourseForm();
                
                // Switch to management tab to see the created course
                setTimeout(() => {
                    document.querySelector('[data-tab="course-management"]').click();
                }, 1000);

            } finally {
                // Remove loading state
                addButton.classList.remove('loading');
                addButton.disabled = false;
            }
        };

        // Make clearCourseForm globally available
        window.clearCourseForm = clearCourseForm;

        // Initialize tabs - Compatible with all browsers
        function initTabsWhenReady() {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                // DOM is ready, initialize tabs
                setTimeout(initializeTabs, 100);
            } else {
                // DOM not ready yet, try different approaches
                if (document.addEventListener) {
                    // Modern browsers
                    document.addEventListener('DOMContentLoaded', initializeTabs);
                } else if (document.attachEvent) {
                    // IE8 and older
                    document.attachEvent('onreadystatechange', function() {
                        if (document.readyState === 'complete') {
                            initializeTabs();
                        }
                    });
                } else {
                    // Fallback for very old browsers
                    window.onload = initializeTabs;
                }
            }
        }
        
        // Execute initialization
        initTabsWhenReady();


        // Initialize the application
        loadCourses();
        updateDashboardStats();

    ;




