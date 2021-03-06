import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Header from "./shared/Header";
import FooterMenu from "./shared/FooterMenu";
import TokenContext from '../contexts/TokenContext';
import ProgressContext from '../contexts/ProgressContext';
import { ThreeDots } from 'react-loader-spinner';

export default function TelaHabitos() {
    //Enviados pra API pra criar habito novo
    const [nomeHabitoNovo, setNomeHabitoNovo] = useState("");
    const [dias, setDias] = useState([]);

    //Estados de loading, disabled dos campos, abrir caixa de novo hábito
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [openForm, setOpenForm] = useState(false);

    //Dados envolvendo API (get.data dos habitos, enviar token, URL da API, body. config (header token))
    const [dataHabitos, setDataHabitos] = useState([]);
    const { token } = useContext(TokenContext);
    const URL = "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits";
    const body = {
        name: nomeHabitoNovo,
        days: dias
    }
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    //Funçao de get habitos
    function buscarHabitos() {
        const promise = axios.get(URL, config)
        promise
            .then((res) => {
                console.log("Listando habitos do usuario");
                console.log(res.data)
                setDataHabitos(res.data)
            })
            .catch(err => {
                alert("Não foi possível listar seus hábitos, logue novamente");
                console.log(err.status)
            })
    }


    //enviar um habito novo
    function enviarHabitoNovo() {
        setLoading(true);
        setDisabled(true);
        const request = axios.post(URL, body, config);

        if (dias.length === 0) {
            alert("Você deve selecionar pelo menos um dia!")
            setDisabled(false);
            setLoading(false);
        }
        else if (nomeHabitoNovo === "") {
            alert("Seu hábito deve ter um nome!")
            setDisabled(false);
            setLoading(false);
        }

        else {
            request
                .then((res) => {
                    console.log("Hábito criado com sucesso");
                    setNomeHabitoNovo("");
                    setDias([]);
                    setLoading(false);
                    setDisabled(false);
                    setOpenForm(false);
                    buscarHabitos();
                })
                .catch(err => {
                    alert("Não foi possível criar seu hábito, verifique os campos");
                    setDisabled(false);
                    setLoading(false);
                })
        }
    }
//mostrar os habitos
    function montarTelaHabitos() {
        if (dataHabitos.length === 0) {
            return (
                <NenhumHabito>Você não tem nenhum hábito <br />
                    cadastrado ainda. Adicione um hábito para começar a trackear!</NenhumHabito>
            )
        }
        else {
            return dataHabitos.map((el, index) => <Habito key={index} id={el.id} name={el.name} day0={el.days[0]} day1={el.days[1]} day2={el.days[2]} day3={el.days[3]} day4={el.days[4]} day5={el.days[5]} day6={el.days[6]} setDataHabitos={setDataHabitos} />)
        }
    }

    const arrDias = ["D", "S", "T", "Q", "Q", "S", "S"]

    // parte de criar habito novo
    function criarHabito() {

        if (openForm)
            return (
                <ContainerNovoHabito>
                    <Input
                        placeholder='nome do hábito'
                        type='name'
                        disabled={disabled}
                        value={nomeHabitoNovo}
                        onChange={e => setNomeHabitoNovo(e.target.value)} />
                    <ContainerDays>
                        {arrDias.map((dia, index) => <ButtonDays key={index} disabled={disabled} id={index} text={dia} dias={dias} setDias={setDias} />)}
                    </ContainerDays>
                    <ContainerCreate>
                        <TextLink onClick={() => setOpenForm(false)}>Cancelar</TextLink>
                        <SaveButton disabled={disabled} onClick={enviarHabitoNovo}>
                            {loading ? <ThreeDots color="#FFFFFF" height={80} width={80} /> : 'Salvar'}
                        </SaveButton>
                    </ContainerCreate>
                </ContainerNovoHabito>
            )
    }
    //Render
    useEffect(() => buscarHabitos(), []);
    const TelaHabitos = montarTelaHabitos();
    const AbrirNovoHabito = criarHabito();
    return (
        <>
            <Header />
            <Container>
                <TitleContainer>
                    <h1>Meus hábitos</h1>
                    <button onClick={() => setOpenForm(true)}>+</button>
                </TitleContainer>
                {openForm ? AbrirNovoHabito : null}
                {TelaHabitos}
            </Container>
            <FooterMenu />
        </>
    )
}

// componente separado dias da semana

function ButtonDays({ disabled, id, text, dias, setDias }) {
    const [selected, setSelected] = useState(false);

    function selecionar() {
        if (!selected) {
            setSelected(true);
            setDias([...dias, id]);
        }
        else if (selected) {
            setSelected(false);
            setDias(dias.filter((habito) => habito !== id));
        }
    }
    return (
        <Days selected={selected} disabled={disabled} onClick={selecionar}>{text}</Days>
    )
}
// componente hábito já criado
function Habito({ id, name, day0, day1, day2, day3, day4, day5, day6, setDataHabitos }) {
    const arrDias = ["D", "S", "T", "Q", "Q", "S", "S"]
    const { token } = useContext(TokenContext);

    function apagarHabito() {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        if (window.confirm("Você deseja apagar esse hábito?") === true) {
            const request = axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}`, { data: {}, headers: { Authorization: `Bearer ${token}` } });
            request
                .then(() => {
                    console.log("Hábito deletado com sucesso!");
                    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits", config)
                    promise
                        .then((res) => {
                            console.log("Listando habitos do usuario");
                            console.log(res.data)
                            setDataHabitos(res.data)
                        })
                        .catch(err => {
                            alert("Não foi possível listar seus hábitos, logue novamente no site");
                            console.log(err.status)
                        });
                })
                .catch((err) => console.log(err.status));
        }
    }


    return (
        <ContainerHabitos>
            <ion-icon name="trash-outline" id={id} onClick={apagarHabito}></ion-icon>
            <NomeHabito>{name}</NomeHabito>
            <ContainerDays>
                {arrDias.map((dia, index) => {
                    if (index === day0) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day1) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day2) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day3) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day4) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day5) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    else if (index === day6) {
                        return <Days key={index} index={index} selected={true} >{dia}</Days>
                    }
                    return <Days key={index} index={index} selected={false}>{dia}</Days>
                })
                }
            </ContainerDays>
        </ContainerHabitos>
    )
}

const Container = styled.div`
height: 100%;
min-height: 100vh;
width: 100%;
background-color: #F2F2F2;
padding: 1rem;
`

const TitleContainer = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 80px;
margin-bottom: 2rem;
    h1 {
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    color: #126BA5;
    }
    button {
    width: 40px;
    height: 35px;
    background: #52B6FF;
    border-radius: 6px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 26px;
    line-height: 34px;
    color: #FFFFFF;
}
`
export { TitleContainer }
const NenhumHabito = styled.div`
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 22px;
color: #666666;

`
const ContainerNovoHabito = styled.div`
width: 100%;
height: 180px;
background-color: #FFFFFF;
border-radius: 6px;
margin-bottom: 2rem;
padding: 1rem;
display: flex;
flex-direction: column;
gap: 8px;
`
const Input = styled.input`
width: 100%;
height: 45px;

border: 1px solid #D5D5D5;
border-radius: 6px;
padding: 1rem;

opacity: ${props => props.disabled ? 0.7 : 1};
background-color: ${props => props.disabled ? '#F2F2F2' : '#FFFFFF'};

color: #666666;
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 20px;
::placeholder{
    font-size: 20px;
    color: ${props => props.disabled ? '#AFAFAF;' : '#DBDBDB'};
    font-family: 'Lexend Deca';
    font-style: normal;
}
`
const ContainerDays = styled.div`
display: flex;
gap: 4px;
`
const Days = styled.button`
width: 2rem;
height: 2rem;

background-color: ${props => props.selected ? "#DBDBDB" : "#FFFFFF"};
border: 1px solid #D5D5D5;
border-radius: 6px;

font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 20px;
color: ${props => props.selected ? "#FFFFFF" : "#DBDBDB"};
`
const ContainerCreate = styled.div`
display: flex;
justify-content: flex-end;
align-items: center;
gap: 24px;
margin-top: 20px;
`
const TextLink = styled.div`
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 1rem;
color: #52B6FF;
`
const SaveButton = styled.button`
    width: 30%;
    height: 35px;
    background: #52B6FF;
    border-radius: 6px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;

    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
`
const ContainerHabitos = styled.div`
width: 100%;
min-height: 90px;
background-color: #FFFFFF;
border-radius: 6px;
margin-bottom: 2rem;
padding: 1rem;
display: flex;
flex-direction: column;
gap: 8px;
position: relative;
    ion-icon {
        position: absolute;
        top: 10%;
        right: 2%;
        color: #666666;
    }
    &:last-child {
    margin-bottom: 80px;
}
`
const NomeHabito = styled.div`
width: 90%;
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 20px;
color: #666666;
`