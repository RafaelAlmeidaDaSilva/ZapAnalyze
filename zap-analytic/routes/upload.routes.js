


// Copyright (C) 2021 Rafael Almeida da Silva

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

//-------------------------------------------------------------------



const upload = require('../libs/config-upload');
const readline = require('readline');
const fs = require('fs');
const moment = require('moment');
const { Console } = require('console');



//-------------------------[EXTRACTION INFORMATION METHODS]------------------------------------------

function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.toString().split(separator);
  
    // console.log('Linha: "' + stringToSplit + '"');
    // console.log('O array tem ' + arrayOfStrings.length + ' elementos: ' + arrayOfStrings.join(' / '));

    return arrayOfStrings;
}

function exist(array, data){
    for(j= 0 ; j <= array.length-1; j++)
        if(array[j].nome === data)
            return true;
    return false;
}   

function filterNameGeneric (array, name ){
    let arraySender = array.filter((line) => {
        return line.nome == name;
    });

    return arraySender;
}

let options = {     
    dateStyle: ('full' || 'long' || 'medium' || 'short' ), 
    timeStyle: ('full' || 'long' || 'medium' || 'short' ), 
}

function assignLine(line){

    let dataHora = line.substring(0, 16);
    let arraySlipString = dataHora.split(' ');
   
    let ano, mes, dia, hora, min;
    dia = arraySlipString[0].split('/')[0];
    mes = parseInt(arraySlipString[0].split('/')[1])-1;
    ano = arraySlipString[0].split('/')[2];
    hora = arraySlipString[1].split(':')[0];
    min = arraySlipString[1].split(':')[1];

    let dtMenssagem = new Date(ano,mes.toString(),dia,hora,min);

     let remetenteMsg = lineDivision(line);
     let position = firstCharPosition(remetenteMsg, ':');
     
     let rtMenssagem = remetenteMsg.substring(0,position);
 
     let txt = remetenteMsg.substring(position+2, remetenteMsg.length)
 
     let mensagem = 
     {
         data: dtMenssagem,
         nome: rtMenssagem,
         texto: txt
     }
 
     return mensagem;
    
}

function lineDivision(line){
    let contatoMensagem = line.substring(19,line.length)
    return contatoMensagem;
}

function firstCharPosition(line, char){
    for(let i = 0; i < line.length-1 ; i++)
    {
        if(line.substring(i, i+1) == char)
         return i;
    }
    return null;
}

function lineBreak(line){
    let remetenteMsg = lineDivision(line);

    if(line.substring(0, 19).split(' ')[0].substring(2,3) === '/')
    {
        if(remetenteMsg !== null) // quer dizer que e um quebra de linha
        {
            var position = firstCharPosition(remetenteMsg, ':');
            if (position !== null)
                return true;
            
        }
    }
    return false;

}

function groupOrPrivate(senders){
    if(senders.length > 2)
        return true;

    else
        return false;
}

let contarDC;
function messagesForDaysTalked(durationDays, dateBeginning, messages){
    let  MensagensAgrupadasDias =[];
    let  contDiasConversados = 0;
    let  dataAtual, dataFinal, d;

    for(i=0; i < durationDays ; i++){
        dataAtual = dateBeginning;
        d = moment(dataAtual);
        d.add(i, 'day'); 
        dataAtual = d.toDate();
        dataAtual.setHours(0,0,0,0);
        dataFinal = d.toDate();
        dataFinal.setHours(23,59,0,0);

        let objetosFiltrados = messages.filter(result => {
            return result.data >= dataAtual  && result.data <= dataFinal;
           });

      let analytic = {
            dtinicio: dataAtual,
            dtfim: dataFinal,
            msgs: objetosFiltrados 
       }
       
       MensagensAgrupadasDias.push(analytic);   

       if(objetosFiltrados.length !== 0)
           contDiasConversados++;
            
            
        objetosFiltrados=null;

    }

    // console.log("Dias conversados: ", contDiasConversados);
    contarDC = contDiasConversados;
    return MensagensAgrupadasDias;
}

function identifySenders(messages){
    let remetentes = []

    // percorrer por toda lista de menssagem 
    for(let i = 0 ; i <= messages.length-1 ; i++){
       if (remetentes.length !== 0){
            
            if(!exist(remetentes, messages[i].nome))
            {
                remetente= {
                    nome: messages[i].nome
                }
                remetentes.push(remetente);
            } 

           
       }
       else{
            remetente= {
                nome: messages[i].nome
            }
            remetentes.push(remetente);
       }
    }
      
       

    return remetentes;
}

function toGroupMessagesContexts(messages){
    let antes = {};
    let idContexto;
    let contextos = [];

   
        for(let i=0; i< messages.length; i++)
        {

            if(messages[i].nome !== antes.nome )
            {
                antes = {
                    nome: messages[i].nome,
                    id: i
                }

                let msgs = [];
                msgs.push(messages[i]);
                let contexto = {
                    msgs:msgs,
                    nome: messages[i].nome
                }
                
                idContexto = contextos.push(contexto)-1;
        
            }
            else{

                contextos[idContexto].msgs.push(messages[i]);
            }
        }

        return contextos;
      
}

function meanContext (groupingContext, sender){
    let ContextsSender =  filterNameGeneric(groupingContext, sender);
    let N=0 , accumulator=0;

    for(let i =0; i < ContextsSender.length-1; i++ )
    {
        accumulator+= ContextsSender[i].msgs.length;
        N++;
    }

  
    return arithmeticMean(accumulator,N);
}

function meanWordsContext(contexts, name){
    let accumulatorWords=0, N=0;
    let frequencyMessages = [];
    let messagesContextsSender = filterNameGeneric(contexts, name);

    for(let i = 0; i<= messagesContextsSender.length-1; i++)
    {
        accumulatorWords=0;
        N=0;
    
        for(let j = 0; j<= contexts[i].msgs.length-1; j++)
        {
            accumulatorWords += contexts[i].msgs[j].texto.split(' ').length;
            N++;
        }
        
      
        frequencyMessages.push(arithmeticMean(accumulatorWords,N));
    }

    accumulatorWords=0;
    N=0;


    for(let y= 0 ; y <= frequencyMessages.length-1; y++)
    {
        accumulatorWords += frequencyMessages[y];
        N++;
    }

    return arithmeticMean(accumulatorWords,N);
}

function meanWordsForMessage(messages, name){
    let accumulatorWords=0, N=0;
    let mensagens = filterNameGeneric(messages, name);
    for(let i = 0; i< mensagens.length-1 ; i++)
    {
        accumulatorWords += splitString(mensagens[i].texto, ' ').length;
        N++;
    }
    
    return arithmeticMean(accumulatorWords,N);
}

function weekContDays(week, messages){
    

    let fim = moment(messages[messages.length-1].data);
    let inicio = moment(messages[0].data)
    let duration =  moment.duration(fim.diff(inicio));

    d = moment(messages[0].data);
    
    for(let i = 0 ; i <= duration.asDays(); i++){
        let current = d;
        current = moment(current.toDate().setHours(0,0,0,0));
        current.add(i, 'day'); 
        let edit =  current.toDate();
        let dataedit = edit.toLocaleDateString( 'pt-br', options);
        let diaEdit = dataedit.split(' ')[0];
        let dia = dataedit.split(' ')[0].substring(0,diaEdit.length-1);

        switch (dia) {
            case 'segunda-feira':
                week[0].qtd +=1;
                break;
            case 'terça-feira':
                week[1].qtd +=1;
                break;
            case 'quarta-feira':
                week[2].qtd +=1;
                break;
            case 'quinta-feira':
                week[3].qtd +=1;
              break;
            case 'sexta-feira':
                week[4].qtd +=1;
                break;
            case 'sábado':
                week[5].qtd +=1;
                break;
            case 'domingo':
                week[6].qtd +=1;
                break;
                
            default:
              
          }
    }

    return week;
   
}

function weekCont(message){

    let data = [
        {semana:'segunda',
         cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'terça',
          cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'quarta',
          cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'quinta',
          cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'sexta',
          cont: 0,
          qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'sabado',
          cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0},
         {semana:'domingo',
          cont: 0,
         qtd: 0,
         media: 0,
         porcent: 0}
    ];

    data = weekContDays(data, message);

    for(let i = 0; i <= message.length-1; i++){
        
        let dataedit = message[i].data.toLocaleDateString( 'pt-br', options);
        let diaEdit = dataedit.split(' ')[0];
        var dia = dataedit.split(' ')[0].substring(0,diaEdit.length-1);
        
        switch (dia) {
            case 'segunda-feira':
                data[0].cont +=1;
                break;
            case 'terça-feira':
                data[1].cont +=1;
                break;
            case 'quarta-feira':
                data[2].cont +=1;
                break;
            case 'quinta-feira':
                data[3].cont +=1;
              break;
            case 'sexta-feira':
                data[4].cont +=1;
                break;
            case 'sábado':
                data[5].cont +=1;
                break;
            case 'domingo':
                data[6].cont +=1;
                break;
                
            default:
              
          }
          
    }
    return meanContDistribution(data);
}

function periodCont(message){

   let period =[
        {periodo:'manha',
         cont:0,
         qtd:0,
         media: 0,
         porcent: 0},
         {periodo:'tarde',
         cont:0,
         qtd:0,
         media: 0,
         porcent: 0},
         {periodo:'noite',
         cont:0,
         qtd:0,
         media: 0,
         porcent: 0},
         {periodo:'madrugada',
         cont:0,
         qtd:0,
         media: 0,
         porcent: 0}
    ];

    period = periodContHours(period,message);

    for(let i= 0; i <= message.length-1 ; i++){
        let periodo = getPeriodWithHours(message[i].data.getHours())
        switch (periodo) {
            case 'manha':
                period[0].cont++;
                break;
            case 'tarde':
                period[1].cont++;
                break;
            case 'noite':
                period[2].cont++;
                break;
            case 'madrugada':
                period[3].cont++;
              break;
                
            default:
              
          }

    }
    return meanContDistribution(period);
}

function getPeriodWithHours(hour){
    
    if(hour >= 6 && hour <= 11)
        return 'manha'
    if(hour >= 12 && hour <= 17)
        return 'tarde'
    if(hour >= 18 && hour <= 23)
        return 'noite'
    if(hour >= 0 && hour <= 5)
        return 'madrugada'
}

function periodContHours(period, messages){
    
    let fim = moment(messages[messages.length-1].data);
    let inicio = moment(messages[0].data)
    let duration =  moment.duration(fim.diff(inicio));

    d = moment(messages[0].data);
    
    for(let i = 0 ; i <= duration.asHours(); i++){
        let current = d;
        current = moment(current.toDate().setHours(0,0,0,0));
        current.add(i, 'hours'); 
        let hora = getPeriodWithHours(current.toDate().getHours())
       
        switch (hora) {
            case 'manha':
                period[0].qtd ++; 
                break;
            case 'tarde':
                period[1].qtd ++; 
                break;
            case 'noite':
                period[2].qtd ++; 
                break;
            case 'madrugada':
                period[3].qtd ++; 
              break;
            default:
              
          }
    }

    return period;
   
}

function meanMessagesDay(messages, quantityDaysConversation)
{
    return arithmeticMean(messages.length, quantityDaysConversation);
}

function countWordsForMessage (message)
{
    return splitString(message, ' ').length;
}

//---------------------------------[STATISTIC METHODS]-------------------------------------------


function meanContDistribution (distribution){
    let max = 0;
    for(let i =0 ; i <= distribution.length-1; i++){
        distribution[i].media = distribution[i].cont / distribution[i].qtd
        max += distribution[i].media;  
        distribution[i].porcent = percentage(max, distribution[i].media);    
    }

   return distribution;    
}

function percentage(max, x){
    return (x * 100) / max;
}

function messageCounterBySender(messagesOfSender){
    let totalRemetentes=0;
    messagesOfSender.forEach(item=> {
        totalRemetentes +=  item.mgsrt.length;
    });
    
    return totalRemetentes;
} 

function relativeFrequency(total, frequencia){
    return (frequencia / total)*100; 
 }

function frequencyDistribution (messagesOfSender){
    let totalRemetentes = 0; 
    let freqRelativa = 0;
    let msgs = []; 

    messagesOfSender.forEach(item => {
        totalRemetentes = messageCounterBySender(messagesOfSender);
        freqRelativa = relativeFrequency(totalRemetentes, item.mgsrt.length);
        mg = {
            element: item,
            frel: freqRelativa,
            
        }  
        
        msgs.push(mg);
    });
    
    return msgs;
 }

function contextToListValues (contexts)
{   let listValues = [];
    for (let index = 0; index < contexts.length; index++) 
        listValues[index]= contexts[index].length;
        
    return listValues;
}

function messagesForDayToListValues(messagesForDay)
{

    let listValues = [];

    for (let index = 0; index < messagesForDay.length; index++) 
        listValues[index] = messagesForDay[index].msgs.length;

    
    return listValues;
    
}

function WordsForMessageToListValues(messages){
    let listValues = [];
    for (let index = 0; index < messages.length; index++) 
        listValues.push(countWordsForMessage(messages[index]));
    
    return listValues;
}


function median (listValues)
{  let elementList
    for (let index = 0; index < listValues.length; index++) {
        let element = listValues[index];
        
        if(!listValues[index + 1] >= element){
            elementList = listValues[index+1]
            listValues[index+1] = element;
            element = elementList;
            
        }
        else continue;//maior que o elemento

           
    }

    return listValues[Math.round(listValues.length/2)];
}

function mode (listValues){
    let frequencyList = null;
    let conting = false;
    for (let indexEx = 0; indexEx < listValues.length; indexEx++) {
        if(frequencyList !== null){
            for (let indexIn = 0; indexIn < frequencyList.length; indexIn++) {
                if(frequencyList[indexIn].value == listValues[IndexEx])
                {
                    frequencyList[indexIn].cont ++;
                    conting = true;
                }
               
                //nao tem nenhum anterior
                if (conting == false )
                {
                    frequencyList[indexEx] ={
                        value :listValues[indexEx],
                        cont: 1
                    } ;
                    
                }
                conting = false;
             }
            
            
         }   

       
    }

    for (let index = 0; index < frequencyList.length; index++) {
        const element = frequencyList[index];
        for (let index = 0; index < frequencyList.length; index++) {
            const element = frequencyList[index].cont;
            
            if(index+1 < frequencyList.length)
                if(element > frequencyList[index+1].cont )
                {
                    let lat = element;
                    element = frequencyList[index+1].cont;
                    frequencyList[index+1].cont = lat;
                }else
                    continue;

        }
    }

    // retorna o ultimo valor da lista que é o valor que mais se repete.
    return frequencyList[frequencyList.length-1];
   

}

function variance(listValues, meanValues){
    let diferenceList = [];
    let PotenceList = [];
    let Acumulator = 0;
    for (let index = 0; index < listValues.length; index++) {
        
        if (listValues[index] >= meanValues)
            diferenceList[index] = listValues[index] - meanValues;
       
        if(listValues[index] < meanValues)
            diferenceList[index] = meanValues - listValues[index];
    }

    for (let index = 0; index < diferenceList.length; index++) 
        PotenceList[index] = diferenceList[index] * diferenceList[index];


    for (let index = 0; index < PotenceList.length; index++) 
        Acumulator += PotenceList[index];
        
    
    return Acumulator / PotenceList.length;
}

function standardDeviation(listValues, meanValues) {
    // subtrair a media do valor da lista 
    let diferenceList = null ;
    let PotenceList = null;
    let Acumulator = null;
    for (let index = 0; index < listValues.length; index++) {
        const element = listValues[index];
        if (listValues[index] >= meanValues)
            diferenceList[index] = listValues[index] - meanValues;
        else
            diferenceList[index] = meanValues - listValues[index];
    }

    for (let index = 0; index < diferenceList.length; index++) 
        PotenceList[index] = diferenceList[index] * diferenceList[index];


    for (let index = 0; index < PotenceList.length; index++) 
       Acumulator += PotenceList[index];
        
    
    return Math.sqrt(Acumulator / PotenceList.length);
}

function standardDeviation(variance) {
    // subtrair a media do valor da lista 
    return Math.sqrt(variance);
}

function arithmeticMean (accumulator, n){
    return accumulator / n;
}

function weightedHarmonicMean (ListValues,listWeights)
{
    let acumulatorDivisionValues = null ;
    let acumulatorWeights = null;

    for (let index = 0; index < listWeights.length; index++) 
         acumulatorWeights += listWeights[index];
        
    
    for (let index = 0; index < listValues.length; index++) {
        acumulatorDivisionValues += listValues[index] / listWeights[index];
        
    }
    // mhp = w1+w2+...+wn / (w1/x1)+ (w2/x2)+...(wn/xn)
    return acumulatorWeights / acumulatorDivisionValues;

}

function coeficientePearson(ListVars){

    let vars = null;
    for (let index = 0; index < ListVars.length; index++) {
        const element = ListVars[index];

        
    }
    
}

function asymmetryCoefficient(mean, median, deviation){
        return 3*(mean - median) / deviation;
}

function directionCoefficient (mean, mode)
{
    return mean - mode;
}

function statusCoefficient(coefficient)
{
    // assimetrica positiva
    if(coefficient > 0)
        return "Alguma relação"

    // assimetrica negativa
    if(coefficient < 0)
        return "Nenhuma relação" //

    // simetrica
    if(coefficient == 0)
        return "Neutro" // normal 

}

function forceAsymmetry(coefficient)
{
    if(coefficient > 0,15 && coefficient < 1)
        return "Moderada";
    if(coefficient > 1)
        return "Forte";
}


//-------------------------------------[BUSINESS RULES METHODS]-------------------------------

// // Implements 

// function reciprocityCalculate(){}

// // implements

// function recprocitySenibilityCalculate(){}



function MessagesSebilitty(){}
function WordSebilitty(){}
function ContextSebilitty(){}


module.exports = app => {

    app.get('/', function(req,res){
        res.render("form-upload");
    });
    
    app.post('/upload',upload.single("backup"), (req, res) =>{
            let messages= [];
            let sujeiras= [];

            const rl = readline.createInterface({
                input: fs.createReadStream('./uploads/file.txt')
            });
            
            rl.on('line', (line) => {
                
                if(!lineBreak(line))
                {
                    if(messages.length !== 0){
                        var space = ' ';
                        messages[messages.length-1].texto = messages[messages.length-1].texto.concat(space.concat(splitString(line, ' ').join(' ')));
                    }
                    else{
                        // armazena como sujeira no documento 
                            sujeira = {
                                texto : splitString(line, ' ').join(' ')
                            }
                            sujeiras.push(sujeira);
                        // deleta a linha 
                    }
                }else{
                    messages.push(assignLine(line));
                }     
            });
            rl.on('close', () => {
                
                fs.unlinkSync("./uploads/file.txt"); 
                let messagesOfDays =[];
                let FrequencyInfosMean = [];
                let DispersionSenders = [];
                let context = toGroupMessagesContexts(messages);
                let end = moment(messages[messages.length-1].data);
                let beginning = moment(messages[0].data)
                let duration =  moment.duration(end.diff(beginning));
                messagesOfDays = messagesForDaysTalked(duration.asDays(), beginning.toDate(), messages);
                let days = Math.trunc(duration.asDays());
                let hours = Math.trunc(((duration.asDays() - Math.trunc(duration.asDays()))*24));
                let minutes = Math.trunc((((duration.asDays() - Math.trunc(duration.asDays()))*24) - Math.trunc((duration.asDays() - Math.trunc(duration.asDays()))*24)) * 60);

            

                identifySenders(messages).forEach(element => {
                    messagesForSender = filterNameGeneric(messages,element.nome);
                    messagesOfDaysForSender = messagesForDaysTalked(duration.asDays(), beginning.toDate(), messagesForSender); 

                    let FrequencyInfoMeanSenders={
                       nome: element.nome,
                       qtdContexto: context.length,
                       mediaMsgContexto: meanContext(context, element.nome),
                       mediaPalavras: meanWordsForMessage(messages, element.nome),        
                       mediaPalavrasContexto: meanWordsContext(context, element.nome),
                       msgsContexto: toGroupMessagesContexts(messagesForSender),  
        
                       mgsrt: filterNameGeneric(messages,element.nome),
                       
                   };

                     
                

                   let DispersionInfoSenders = {
                       name : element.nome,
                //        dispersionVariables :[{variable: "Messages", 
                //                               mean: meanMessagesDay(messagesForSender,messagesOfDaysForSender.length),
                //                               variance: variance(messagesForDayToListValues(messagesOfDaysForSender), meanMessagesDay(messagesForSender,messagesOfDaysForSender.length) ) ,
                //                               deviation: standardDeviation(messagesForDayToListValues(messagesOfDaysForSender), meanMessagesDay(messagesForSender,messagesOfDaysForSender.length) ),
                //                               asymmetry: asymmetryCoefficient(meanMessagesDay(messagesForSender,messagesOfDaysForSender.length), median(messagesForDayToListValues(messagesOfDaysForSender)),standardDeviation(messagesForDayToListValues(messagesOfDaysForSender), meanMessagesDay(messagesForSender,messagesOfDaysForSender.length) )) ,
                //                               forceAsymmetry: forceAsymmetry(asymmetryCoefficient(meanMessagesDay(messagesForSender,messagesOfDaysForSender.length), median(messagesForDayToListValues(messagesOfDaysForSender)),standardDeviation(messagesForDayToListValues(messagesOfDaysForSender), meanMessagesDay(messagesForSender,messagesOfDaysForSender.length) )))},
                                              
                //                               {variable: "Words", 
                //                               mean: meanWordsForMessage(messagesForSender, element.nome),
                //                               variance: variance(WordsForMessageToListValues(messagesForSender), meanWordsForMessage(messagesForSender, element.nome)) ,
                //                               deviation: standardDeviation(WordsForMessageToListValues(messagesForSender), meanWordsForMessage(messagesForSender, element.nome)),
                //                               asymmetry: asymmetryCoefficient(meanWordsForMessage(messagesForSender, element.nome), median(WordsForMessageToListValues(messagesForSender)), standardDeviation(WordsForMessageToListValues(messagesForSender), meanWordsForMessage(messagesForSender, element.nome))),
                //                               forceAsymmetry:forceAsymmetry(asymmetryCoefficient(meanWordsForMessage(messagesForSender, element.nome), median(WordsForMessageToListValues(messagesForSender)), standardDeviation(WordsForMessageToListValues(messagesForSender), meanWordsForMessage(messagesForSender, element.nome)))) },
                                              
                //                               {variable: "Context", 
                //                               mean: mediaContext(context, element.nome),
                //                               variance: variance(contextToListValues(toGroupMessagesContexts(messagesForSender)), mediaContext(context, element.nome)),
                //                               deviation: standardDeviation(contextToListValues(filterNameGeneric(context,element.name)), mediaContext(context, element.nome) ),
                //                               asymmetry: asymmetryCoefficient(mediaContext(context, element.nome), median(contextToListValues(toGroupMessagesContexts(messagesForSender))),standardDeviation(contextToListValues(filterNameGeneric(context,element.name)), mediaContext(context, element.nome) ) ),
                //                               forceAsymmetry: forceAsymmetry(asymmetryCoefficient(mediaContext(context, element.nome), median(contextToListValues(toGroupMessagesContexts(messagesForSender))),standardDeviation(contextToListValues(filterNameGeneric(context,element.name)), mediaContext(context, element.nome) ) ))}]
                //    };

                dispersionVariables :[{variable: "Messages", 
                mean: meanMessagesDay(messagesForSender,messagesOfDaysForSender.length),
                variance: variance(messagesForDayToListValues(messagesOfDaysForSender), meanMessagesDay(messagesForSender,messagesOfDaysForSender.length) ) },
                
                {variable: "Words", 
                mean: meanWordsForMessage(messagesForSender, element.nome),
                variance: variance(WordsForMessageToListValues(messagesForSender), meanWordsForMessage(messagesForSender, element.nome)) },
                    
                {variable: "Context", 
                mean: meanContext(context, element.nome),
                variance: variance(contextToListValues(toGroupMessagesContexts(messagesForSender)), meanContext(context, element.nome)),
               }]
};
            
                   FrequencyInfosMean.push(FrequencyInfoMeanSenders); 
                   DispersionSenders.push(DispersionInfoSenders)
                   
                });



           
                res.render('home', {totalmsg:messages.length, 
                                    dtinicio: messages[0].data.toLocaleDateString( 'pt-br', options),
                                    dtfim: messages[messages.length-1].data.toLocaleDateString( 'pt-br', options),
                                    msgsRemetentes: FrequencyInfosMean,
                                    dias: days,
                                    horasDias: hours,
                                    minutosHoras: minutes,
                                    convDias: contarDC,
                                    week: weekCont(messages),
                                    periodos: periodCont(messages),
                                    distribFrequence: frequencyDistribution(FrequencyInfosMean),
                                    dispercions: DispersionSenders,
                                    
                                    });
            });
        
        
    });
}