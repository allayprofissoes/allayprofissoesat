## Tarefas para implementar o Histórico de Matrículas

### Fase 1: Analisar arquivos HTML, CSS e JavaScript existentes para identificar pontos de integração.
- [x] Analisar `index.html` para identificar a estrutura do menu lateral e das seções de conteúdo.
- [x] Analisar `script.js` para entender a lógica de navegação entre as abas e a interação com o Firebase.
- [x] Analisar `style.css` para garantir a consistência visual.

### Fase 2: Modificar index.html para adicionar a nova aba 'Histórico de Matrículas' e seu conteúdo.
- [x] Adicionar o item 'Histórico de Matrículas' ao menu lateral.
- [x] Criar a seção 'indications-history' no conteúdo principal com a tabela e botões.
- [x] Adicionar o modal 'add-indication-modal' para adicionar novas indicações.

### Fase 3: Modificar script.js para gerenciar a navegação da nova aba e carregar/exibir os dados de indicações.
- [x] Adicionar event listener para a nova aba 'Histórico de Matrículas'.
- [x] Implementar a função `loadIndications()` para buscar dados de indicações no Firebase.
- [x] Popular a tabela de indicações (`indications-tbody`) com os dados recuperados.
- [x] Adicionar lógica para exibir nomes de alunos indicadores e indicados (buscar por email no Firebase).
- [x] Preencher o dropdown de cursos no modal de adicionar indicação.

### Fase 4: Implementar a funcionalidade de edição de status na tabela de indicações.
- [x] Adicionar dropdown de status editável para cada indicação na tabela.
- [x] Implementar a função `updateIndicationStatus()` para salvar a alteração de status no Firebase.

### Fase 5: Criar o pop-up e a lógica para adicionar novas indicações.
- [x] Implementar a função `openAddIndicationModal()` para exibir o pop-up.
- [x] Implementar a função `searchStudentsForIndication()` para buscar alunos no pop-up.
- [x] Implementar a função `saveIndication()` para coletar dados do pop-up e salvar no Firebase.

### Fase 6: Integrar o salvamento e atualização de indicações no Firebase.
- [x] Criar uma nova coleção no Firebase (ex: `indications`) para armazenar os dados de indicação.
- [x] Estruturar os dados de cada indicação (aluno indicador, aluno indicado, curso, data, status, pontos).
- [x] Implementar a lógica para adicionar novas indicações ao Firebase.
- [x] Implementar a lógica para atualizar o status de indicações existentes no Firebase.

### Fase 7: Testar e validar todas as novas funcionalidades.
- [ ] Testar a navegação para a nova aba.
- [ ] Testar o carregamento e exibição das indicações na tabela.
- [ ] Testar a edição de status e o salvamento no Firebase.
- [ ] Testar a abertura e o preenchimento do pop-up de adicionar indicação.
- [ ] Testar o salvamento de novas indicações no Firebase.

### Fase 8: Entregar o código modificado ao usuário.
- [ ] Apresentar os arquivos `index.html` e `script.js` atualizados ao usuário.
- [ ] Fornecer instruções claras sobre como usar as novas funcionalidades.

