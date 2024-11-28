function Home(){
    return (
        <div className="container">
            <p>
                Bem vindo(a) ao sistema de Biblioteca, com ele você pode :
            </p>
            <ul>
                <h4>Como Funcionário ou Administrador:</h4>
                <p>Cadastrar livros</p>
                <p>Editar Livros</p>
                <p>Excluir Livros</p>
                <p>Listar Livros</p>
                <p>Alugar e Devolver Livros</p>
            </ul>
            <ul>
                <h4>Como Administrador: </h4>
                <p>Criar Usuários</p>
                <p>Editar Usuários</p>
                <p>Excluir Usuários</p>
                <p>Listar Usuários</p>
            </ul>
        </div>
    )
}

export default Home;