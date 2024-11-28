import {Alert, Col, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Book} from "../../model/Book.ts";
import BookService from "../../service/BookService.ts";
import Button from "react-bootstrap/Button";
import "./rental.css"
import SessionService from "../../service/SessionService.ts";
import Form from "react-bootstrap/Form";
import {Session} from "../../model/Session.ts";

function Rental(){
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [author, setAuthor] = useState("");
    const [launchDate, setLaunchDate] = useState<Date | null>(null);
    const [launchDateString, setLaunchDateString] = useState("");
    const bookService : BookService = new BookService();

    const [showSucess, setShowSucess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    const [sucessMessage, setSucessMessage] = useState("");
    const [bookList, setBookList] = useState<Book[]>([]);
    const [bookEdit, setBookEdit] = useState<Book>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [session, setSession] = useState<Session>();
    const [isEdit, setIsEdit] = useState(false);
    const sessionService: SessionService = new SessionService();

    function fetchBooks() {
        setLoading(true);
        bookService.getAll()
            .then(response => {
                setBookList(response.data)
            })
            .catch(error => setError(error));
        setLoading(false);
    }

    function deleteBook(id:string){
        bookService.delete(id)
    }

    async function getSession(){
        sessionService.getSession()
            .then(response => {
                setSession(response.data)
                ;
            }).catch(error => {
            console.error(error)
            setError(error);
            setShowFailure(true);
        });
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleAuthorChange = (event) => {
        setAuthor(event.target.value);
    };

    const handleLaunchDateChange = (event) => {
        const [year, month, day] = event.target.value.split('-').map(Number);
        const adjustedDate = new Date(year, month - 1, day, 0, 0, 0);

        setLaunchDate(adjustedDate);
        setLaunchDateString(event.target.value);
    };

    useEffect(() => {
        fetchBooks();
        getSession()
    }, []);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar os livros: {error}</div>;

    function isAdmin() : boolean{
        return session?.user.userRoles[0]?.name == "Admin" || session?.user.userRoles[0]?.name == "Funcionario"  ;
    }

    async function loadBookEdit(book: Book) {
        if (book.id != null) {
            bookService.getById(book.id)
                .then(response => {
                    const fetchedBook = response.data;
                    const launchDate = new Date(fetchedBook.launchDate);

                    setBookEdit(fetchedBook);
                    setId(fetchedBook.id)
                    setName(fetchedBook.title);
                    setAuthor(fetchedBook.author);
                    setLaunchDate(launchDate);

                    setLaunchDateString(formatDateToInput(launchDate));

                    setIsEdit(true);
                })
                .catch(error => console.error(error));
        }
    }


    const handleConfirm = (id : string) => {
        const isConfirmed = confirm('Você quer continuar?');
        if (isConfirmed) {
            deleteBook(id)
            alert('Livro deletado"');
            fetchBooks();
        } else {
            alert('Exclusão cancelada"');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault()
        const book: Book = new Book({
            title: name,
            author: author,
            launchDate: launchDate,
        })
        if (isEdit) {
            if(id != null){
                book.id = id;
            }
            bookService.updateBook(book).then(response => {
                setIsEdit(false)
                resetForm()
                setSucessMessage("Livro atualizado com sucesso")
                setShowSucess(true)
                fetchBooks()
            }).catch(error => {
                setShowFailure(true)
                setError(error)
            });
        } else {
            bookService.saveBook(book).then(response => {
                resetForm()
                setSucessMessage("Livro criado com sucesso")
                setShowSucess(true)
                fetchBooks()
            }).catch(error => {
                setShowFailure(true)
                setError(error)
            });
        }
    }

    function resetForm(){
        setId("")
        setName("")
        setAuthor("")
        setLaunchDate(null)
        setLaunchDateString("")
    }

    function formatDateToInput(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate() + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDateToTable(date: Date): string {

        let dateString = date.toString()
        const cutoffIndex = dateString.indexOf("T");
        dateString = dateString.substring(0, cutoffIndex)

        const [year, month, day] = dateString.toString().split('-').map(Number);
        const adjustedDate = new Date(year, month - 1, day, 0, 0, 0);


        return adjustedDate.toLocaleDateString("pt-BR")
    }

    function rent(isReturn:boolean){
        if(session && session.id != null){
            const book: Book = new Book({
                id: id,
                title: name,
                author: author,
                launchDate: launchDate,
                locatorId: session.id
            })
            if(!isReturn){
                bookService.rent(book).then(response => {
                    setSucessMessage("Livro alugado com sucesso")
                    setShowSucess(true)
                    resetForm()
                })
            } else{
                bookService.returnBook(book).then(response => {
                    setSucessMessage("Livro devolvido com sucesso")
                    setShowSucess(true)
                    resetForm()
                })
            }

        }
    }

    function isMyRent(locatorId: string, book : Book){
        if(session.id == locatorId || (session.id != null && locatorId != null)) {
            return (
                <Button variant="primary" className="btn-table" onClick={() => {
                    setIsEdit(true)
                    loadBookEdit(book).then(r => {
                        rent(true)
                    })
                }}>Devolver</Button>)
        }
         else {
            return (<Button variant="primary" className="btn-table" onClick={() => {
                setIsEdit(true)
                loadBookEdit(book).then(r => {
                    rent(false)
                })
            }}>Alugar</Button>)
        }
    }


        return (
        <div className="container">
            <h1>Livros</h1>
            <Form className="form">
                <Row>
                    <Col>
                        <Form.Control
                            size="lg"
                            className="input-modal"
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            size="lg"
                            className="input-modal"
                            type="text"
                            placeholder="Autor"
                            value={author}
                            onChange={handleAuthorChange}
                        />
                    </Col>
                    <Col>
                        <Form.Control
                            size="lg"
                            className="input-modal"
                            type="date"
                            placeholder="Data de lançamento"
                            value={launchDateString}
                            onChange={handleLaunchDateChange}
                        />
                    </Col>
                    <Col>
                        <Button variant="success" className="btn-form-custom" onClick={handleSubmit}>{isEdit ? "Editar" : "Salvar"}</Button>
                    </Col>
                </Row>
            </Form>
            <Alert variant="success" show={showSucess} onClose={() => setShowSucess(false)} dismissible>
                <Alert.Heading>Sucesso!</Alert.Heading>
                <p>
                    {sucessMessage}
                </p>
            </Alert>
            <Alert variant="danger" show={showFailure} onClose={() => setShowFailure(false)} dismissible>
                <Alert.Heading>Um erro ocorreu</Alert.Heading>
                <p>
                    {error}
                </p>
            </Alert>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Autor</th>
                    <th>Data de lançamento</th>
                    <th>Alugado?</th>
                    <th>
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody>
                {bookList.map((book: Book) => {
                    return (
                        <tr>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.launchDate != null ? formatDateToTable(book.launchDate) : "N/A"}</td>
                            <td>{book.locatorId != null ? "SIM" : "NÃO" }</td>
                            <td>
                                {isAdmin() ?
                                    <div>
                                        <Button variant="warning" className="btn-table"  onClick={() => {
                                            setIsEdit(true)
                                            loadBookEdit(book)
                                        }}>Editar</Button>
                                        <Button variant="danger" className="btn-table" onClick={ () => book.id != null ? handleConfirm(book.id) : null}>Excluir</Button>
                                    </div> : null
                                }
                                {(session.id != book.locatorId) ?
                                   null :
                                    isMyRent(book.locatorId, book)
                                }
                                {book.locatorId == null ?
                                    <Button variant="primary" className="btn-table" onClick={() => {
                                        setIsEdit(true)
                                        loadBookEdit(book).then(r => {
                                            rent(false)
                                        })
                                    }}>Alugar</Button> : null
                                }
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>

        </div>
    )
}

export default Rental;