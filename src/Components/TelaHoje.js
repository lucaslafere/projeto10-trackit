import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import Header from "./shared/Header";
import FooterMenu from "./shared/FooterMenu";
import TokenContext from '../contexts/TokenContext';
import ProgressContext from '../contexts/ProgressContext';

export default function TelaHoje() {
    //Variaveis de estado, const, etc
    const { progress, setProgress } = useContext(ProgressContext);
    const { token } = useContext(TokenContext);
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const URL = "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today";

    const [dataHabitos, setDataHabitos] = useState([]);
    const [feito, setFeito] = useState(false);

    // dayjs
        const now = dayjs().locale('pt-br').format('dddd');
        const diaCerto = now.charAt(0).toUpperCase() + now.slice(1);
        const date = dayjs().locale('pt-br').format('DD/MM')




// Logica, funçoes


    function buscarHabitos() {
        const promise = axios.get(URL, config)
        promise
            .then((res) => {
                console.log("Listando hábitos de hoje");
                console.log(res.data);
                setDataHabitos(res.data)
            })
            .catch(err => {
                console.log(err);
                console.log(err.status);
            })
    }

    function montarTelaHabitos() {
        if (dataHabitos.length === 0) {
            return (
                <NenhumHabito>Você não tem nenhum hábito hoje</NenhumHabito>
            )
        }
        else {
            return dataHabitos.map((el, index) => <Habito key={index} id={el.id} name={el.name} done={el.done} currentSequence={el.currentSequence} highestSequence={el.highestSequence}/>)
        }
    }
    // Render
    useEffect(() => buscarHabitos(), []);
    const TelaHabitos = montarTelaHabitos();

    const concluidos = (progress.length / dataHabitos.length) * 100;
    const concluidosAproximado = Math.round(concluidos);

    if (progress.length > 0) {
        setFeito(true)
    }

    return (
        <>
            <Header />
            <Container>
                <TitleContainer feito={feito}>
                    <h1>{diaCerto}, {date}</h1>
                    <p>{feito ? `${concluidosAproximado}% dos hábitos concluídos` : `Nenhum hábito concluído ainda`}</p>
                </TitleContainer>
                {TelaHabitos}
            </Container>
            <FooterMenu />
        </>
    )
}

function Habito({ id, name, done, currentSequence, highestSequence }) {
    const [recorde, setRecorde] = useState(false);
    function testarRecorde () {
        {highestSequence === currentSequence & currentSequence > 0 ? setRecorde(true) : setRecorde(false)}
    }
    useEffect(() => testarRecorde(), []);

    return (
        <ContainerHabitos>
            <TextoHabitos>
                <h2>{name}</h2>
                <SequenciaAtual done={done} recorde={recorde}>Sequência atual: <span>{currentSequence} dias</span></SequenciaAtual>
                <SeuRecorde recorde={recorde}>Seu recorde: <span>{highestSequence} dias</span></SeuRecorde>
            </TextoHabitos>
            <ion-icon name="checkbox" done={done}></ion-icon>
        </ContainerHabitos>
    )
}


const Container = styled.div`
height: 100%;
width: 100%;
background-color: #F2F2F2;
padding: 1rem;
`
const TitleContainer = styled.div`
width: 100%;
display: flex;
flex-direction: column;
margin-top: 80px;
margin-bottom: 2rem;
gap: 0.4rem;
align-items: flex-start;
    h1 {
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    color: #126BA5;
    }
    p {
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 1rem;
    color: ${props => props.feito ? "#8FC549" : "#BABABA"};
    }
`
const NenhumHabito = styled.div`
font-family: 'Lexend Deca';
font-style: normal;
font-weight: 400;
font-size: 18px;
line-height: 22px;
color: #666666;

`
const ContainerHabitos = styled.div`
width: 100%;
min-height: 94px;
padding: 0.8rem;
background-color: #FFFFFF;
border-radius: 6px;
margin-bottom: 2rem;

display: flex;
justify-content: space-between;

    ion-icon {
        color: ${props => props.done ? "#8FC549" : "#EBEBEB"};
        font-size: 90px;
    }
    h2 {
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 24px;
    color: #666666;
    margin-bottom: 20px;
    margin-top: 10px;
    }
    &:last-child {
    margin-bottom: 80px;
}
`
const TextoHabitos = styled.div`
display: flex;
flex-direction: column;
justify-content: flex-start;
`
const SequenciaAtual = styled.div`
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 0.8rem;
    color: #666666;
    margin-bottom: 4px;
    span {
    color: ${props => props.done || props.recorde ? "#8FC549" : "#666666"};
    }

`
const SeuRecorde = styled.div`
    font-family: 'Lexend Deca';
    font-style: normal;
    font-weight: 400;
    font-size: 0.8rem;
    color: #666666;
    span {
    color: ${props => props.recorde ? "#8FC549" : "#666666"};
    }
`
