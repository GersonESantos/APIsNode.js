document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/produto'; // A API será servida no mesmo host
 
    const formAdicionar = document.getElementById('form-adicionar');
    const tabelaPessoasBody = document.querySelector('#tabela-pessoas tbody');
 
    // Modal de edição
    const modalEditar = document.getElementById('modal-editar');
    const formEditar = document.getElementById('form-editar');
    const closeModalButton = document.querySelector('.close-button');
    const idEditInput = document.getElementById('id-edit');
    const nomeEditInput = document.getElementById('nome-edit');
    const idadeEditInput = document.getElementById('idade-edit');
    const cidadeEditInput = document.getElementById('cidade-edit');
 
    // Função para buscar e renderizar as pessoas
    async function fetchAndRenderPessoas() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Erro ao buscar pessoas');
            }
            const pessoas = await response.json();
            renderPessoas(pessoas);
        } catch (error) {
            console.error('Erro:', error);
            tabelaPessoasBody.innerHTML = `<tr><td colspan="5">Erro ao carregar dados. Verifique se o servidor está rodando.</td></tr>`;
        }
    }
 
    // Função para renderizar a tabela de pessoas
    function renderPessoas(pessoas) {
        tabelaPessoasBody.innerHTML = ''; // Limpa a tabela antes de renderizar
        if (pessoas.length === 0) {
            tabelaPessoasBody.innerHTML = `<tr><td colspan="5">Nenhuma pessoa cadastrada.</td></tr>`;
            return;
        }
 
        pessoas.forEach(pessoa => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pessoa._id}</td>
                <td>${pessoa.nome}</td>
                <td>${pessoa.idade}</td>
                <td>${pessoa.cidade}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${pessoa._id}">Editar</button>
                    <button class="delete-btn" data-id="${pessoa._id}">Excluir</button>
                </td>
            `;
            tabelaPessoasBody.appendChild(tr);
        });
    }
 
    // Event listener para o formulário de adicionar
    formAdicionar.addEventListener('submit', async (event) => {
        event.preventDefault();
 
        const nome = document.getElementById('nome-add').value;
        const idade = document.getElementById('idade-add').value;
        const cidade = document.getElementById('cidade-add').value;
 
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, idade, cidade }),
            });
 
            if (!response.ok) {
                throw new Error('Erro ao cadastrar pessoa');
            }
 
            formAdicionar.reset(); // Limpa o formulário
            fetchAndRenderPessoas(); // Atualiza a tabela
        } catch (error) {
            console.error('Erro ao adicionar:', error);
            alert('Não foi possível cadastrar a pessoa.');
        }
    });
 
    // Event listener para os botões de editar e excluir (usando delegação de eventos)
    tabelaPessoasBody.addEventListener('click', async (event) => {
        const target = event.target;
 
        // Botão de Excluir
        if (target.classList.contains('delete-btn')) {
            const id = target.dataset.id;
            if (confirm(`Tem certeza que deseja excluir a pessoa com ID ${id}?`)) {
                try {
                    const response = await fetch(`${apiUrl}/${id}`, {
                        method: 'DELETE',
                    });
                    if (response.status !== 204) { // DELETE bem-sucedido retorna 204
                        throw new Error('Erro ao excluir pessoa');
                    }
                    fetchAndRenderPessoas(); // Atualiza a tabela
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert('Não foi possível excluir a pessoa.');
                }
            }
        }
 
        // Botão de Editar
        if (target.classList.contains('edit-btn')) {
            const id = target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                if (!response.ok) throw new Error('Pessoa não encontrada');
                const pessoa = await response.json();
                
                // Preenche o modal com os dados da pessoa
                idEditInput.value = pessoa._id;
                nomeEditInput.value = pessoa.nome;
                idadeEditInput.value = pessoa.idade;
                cidadeEditInput.value = pessoa.cidade;
 
                // Exibe o modal
                modalEditar.style.display = 'block';
            } catch (error) {
                console.error('Erro ao buscar para editar:', error);
                alert('Não foi possível carregar os dados para edição.');
            }
        }
    });
 
    // Event listener para o formulário de edição
    formEditar.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = idEditInput.value;
        const pessoaAtualizada = {
            nome: nomeEditInput.value,
            idade: parseInt(idadeEditInput.value, 10),
            cidade: cidadeEditInput.value,
        };
 
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pessoaAtualizada),
            });
            if (!response.ok) throw new Error('Erro ao atualizar pessoa');
            
            modalEditar.style.display = 'none'; // Esconde o modal
            fetchAndRenderPessoas(); // Atualiza a tabela
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            alert('Não foi possível atualizar os dados da pessoa.');
        }
    });
 
    // Fechar o modal
    closeModalButton.onclick = () => {
        modalEditar.style.display = 'none';
    };
    window.onclick = (event) => {
        if (event.target == modalEditar) {
            modalEditar.style.display = 'none';
        }
    };
 
    // Carrega os dados iniciais
    fetchAndRenderPessoas();
});