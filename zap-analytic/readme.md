
### Commmon users 
 - Parental Protection (Proteção de pais);
 - Coaching Profissional (Profissionais de Coaching);
 - Psychologists (Psicólogos);
 - Relationship audit (auditoria no relacionamento);



### Description
Software baseado em Nodejs, com objetivo acadêmico de construir uma leitura quantitativa das mensagens trocadas com outros usuarios do whatsapp. O objetivo é, aplicar aprendizado estatístico, relacionado com aprendizado de maquina para determinar um perfil de usuario, e um rating de usabilidade. ajudando a responder perguntas como:

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


Atualmente o zapanalytic faz a leitura e a limpeza de arquivos txt, exportados por uma conversa de whatsapp. A leitura fica responsavel por identificar cada linha como uma mensagem, sendo que cada mensagem contem uma data, hora, autor e texto. sendo a mensagem, texto e ou multimidia(audio, imagem e video).

O sistema é responsavel por efetuar a contagem  de mensagens por data, hora, autor, periodo, dia da semana, palavras, palavras por mensagem, palavras por contexto de mensagem. Execuntando tambem calculo de media e porcentagem de cada uma das contagens. 





### Get Started

    ~ git clone https://github.com/RafaelAlmeidaDaSilva/ZapAnalyze.git

    Criar uma uma pasta com o nome de "uploads" na raiz do projeto se caso nao houver.
    
    Executar os comandos abaixo. ignorando o primeiro comando "npm init"
    

### Commands
   ``` 
    ~ npm init 
    ~ npm install express
    ~ npm install consign 
    ~ npm install multer
    ~ npm install handlebars
    ~ npm install express-handlebars 
    ~ npm install moment
    ~ npm install fs

    ~ npm install express consign multer handlebars express-handlebars moment fs
  ```

## Init
    ~ node index.js




## Methods to implements
- Identificador e contador de perguntas na conversa de cada remetente da conversa;
- Identificar tipos de reciprocidade existentes;
- Comparar reciprocidade


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


    

