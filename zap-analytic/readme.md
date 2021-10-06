# ZapAnalytic 
#### Analisador estatístico de mensagens do whatsapp.
#### Baseado em NODEJS

### LICENSE
    Copyright (C) 2021 Rafael Almeida da Silva

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

## Common users 
 - Parental Protection (Proteção de pais);
 - Coaching Profissional (Profissionais de Coaching);
 - Psychologists (Psicólogos);
 - Relationship audit (auditoria no relacionamento);
 - Prospectors (Prospectadores);
 - Recruiters (Recrutadores);
 - Perceivers (Perceptores);
 - Investigators (Investigadores);
 - Statisticians (Estátisticos);
 - Outhers (outros).



## Description
Software baseado em Nodejs, com objetivo acadêmico de construir uma leitura quantitativa das mensagens trocadas com outros usuarios do whatsapp. O objetivo é, aplicar aprendizado estatístico, relacionado com aprendizado de maquina para determinar um perfil de usuario, e um rating de usabilidade. Ajudando a responder perguntas como:

- ~~Qual o melhor dia da semana para conversar com determinada pessoa?~~ X
- ~~Qual o melhor periodo da semana para conversar com determinada pessoa ?~~ X
- ~~Quando começamos a conversar?~~ X
- ~~Quantos dias houveram conversas ?~~ X
- ~~Existe algum dia da semana que nao há conversas ?~~ X
- Existe algum tipo de reciprocidade na conversa ? 
- Quem é o maior interessado ?
- Qual a taxa de aliciamento ? 
- Qual o nível de interação na conversa ?
- Qual o perfil comportamental ? 
- Em que fase do ano tem mais conversas ?
- Qual é o assunto que mais conversa ?
- Tem algum sinal de depressao ?
- Quantidade de perguntas feitas por pessoa ?
- Qual o nivel de intimidade ?


Atualmente, o zapanalytic faz a leitura e a limpeza de arquivos txt, exportados por uma conversa de whatsapp. A leitura fica responsavel, por identificar cada linha como uma mensagem, sendo que, cada mensagem contem uma data, hora, autor e texto. O sistema é responsavel por efetuar a contagem  de mensagens por data, hora, autor, periodo, dia da semana, palavras, palavras por mensagem, palavras por contexto de mensagem. Execuntando tambem calculo de media e porcentagem de cada uma das contagens. 



## Get Started

    git clone https://github.com/RafaelAlmeidaDaSilva/ZapAnalyze.git


 ### Commands

     npm install express consign multer handlebars express-handlebars moment fs
 

 ### Initiation
     node index.js

## Project

### To implements (TASKS)
- Identificador e contador de perguntas na conversa de cada remetente da conversa;
- Identificar tipos de reciprocidade existentes;
- Comparar reciprocidade com base em um rating;
- Ele deverá considerá uma mensagem como texto e ou multimidia(audio, imagem e video).



### Extracts methods 
Manual dos métodos do arquivo routes/upload.routes.js.

    - assignLine(line)
        - intepreta os dados de uma linha e retorna um objeto
    
    - lineDivision(line)
        - Divide uma linha do arquivo analisado pegando apenas o remetente e a mensagem

    - firstCharPosition(line, char) 
        - Pega a posição do primeiro caracter encontrado em uma string

    - lineBreak(line)
        - Verifica se a linha do arquivo analisado tem ou nao a estrutura de uma linha com mensagem.   


    

