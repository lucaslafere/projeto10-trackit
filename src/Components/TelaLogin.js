import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import logo from '../Assets/logo.png';
import TokenContext from '../contexts/TokenContext';
import ImageContext from '../contexts/ImageContext';

export default function TelaLogin() {
    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const URL = "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/login";
    const navigate = useNavigate();
    
    const { setToken } = useContext(TokenContext);
    const { setImage, setName } = useContext(ImageContext);

    const body = {
        email,
        password: senha
    }

    function entrar(event) {
        event.preventDefault();
        setDisabled(true);
        setLoading(true);

        const request = axios.post(URL, body);
        request
            .then((res) => {
                console.log("Login feito com sucesso");
                setToken(res.data.token);
                setImage(res.data.image);
                setName(res.data.name);
                setLoading(false);
                navigate("/hoje");
            })
            .catch(err => {
                alert("Não foi possível fazer login, verifique se os campos foram preenchidos corretamente");
                setDisabled(false);
                setLoading(false)
            })
    }

    return (
        <Container>
            <LogoBox>
                <img src={logo} alt="logo trackit" />
            </LogoBox>
            <Form onSubmit={entrar}>
                <Input
                    placeholder='email'
                    type='email'
                    autoComplete='email'
                    disabled={disabled}
                    value={email}
                    onChange={e => setEmail(e.target.value)} />
                <Input
                    placeholder='senha'
                    type='password'
                    autoComplete='current-password'
                    disabled={disabled}
                    value={senha}
                    onChange={e => setSenha(e.target.value)} />
                <Button
                    disabled={disabled}
                    type='submit'>
                        {loading ? <ThreeDots color="#FFFFFF" height={80} width={80} /> : 'Entrar'}
                </Button>
            </Form>
            <Link to={`/cadastro`}>
                <TextLink>Não tem uma conta? Cadastre-se!</TextLink>
            </Link>
        </Container>
    )
}





const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
height: 80vh;
`
export { Container };

const LogoBox = styled.div`
img {
    width: 180px;
    height: 180px;
}
`
export { LogoBox };

const Form = styled.form`
display: flex;
flex-direction: column;
width: 100%;
align-items: center;
margin-top: 32px;
margin-bottom: 26px;
gap: 6px;
`
export { Form };

const Button = styled.button`
width: 90%;
height: 45px;
background: #52B6FF;
border: 1px solid #52B6FF;
border-radius: 8px;
opacity: ${props => props.disabled ? 0.7 : 1};
display: flex;
align-items: center;
justify-content: center;

font-weight: 400;
font-size: 20px;
color: #FFFFFF;
font-family: 'Lexend Deca';
font-style: normal;
`
export { Button };

const TextLink = styled.div`
text-decoration: underline;
font-size: 1rem;
color: #52B6FF;
font-family: 'Lexend Deca';
font-style: normal;
`
export { TextLink };


const Input = styled.input`
width: 90%;
height: 45px;

border-radius: 8px;
border: 1px solid #D5D5D5;
padding: 10px;

opacity: ${props => props.disabled ? 0.7 : 1};
background-color: ${props => props.disabled ? '#F2F2F2' : '#FFFFFF'};

color: #666666;
font-size: 20px;
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
::placeholder{
    font-size: 20px;
    color: ${props => props.disabled ? '#AFAFAF;' : '#DBDBDB'};
    font-family: 'Lexend Deca';
    font-style: normal;
} 
`
export { Input };