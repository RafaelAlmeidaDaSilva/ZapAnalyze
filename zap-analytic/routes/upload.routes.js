


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


//-------------------------------------------------------------------
function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator);
  
    // console.log('Linha: "' + stringToSplit + '"');
    // console.log('O array tem ' + arrayOfStrings.length + ' elementos: ' + arrayOfStrings.join(' / '));

    return arrayOfStrings;
}

function exist(array, dado){
    for(j= 0 ; j <= array.length-1; j++)
        if(array[j].nome === dado)
            return true;
    return false;
}   

function filterGeneric (Menssagens, nome ){
    let menssagens = Menssagens.filter((line) => {
        return line.nome == nome;
    });

    return menssagens;
}

let options = {     
    dateStyle: ('full' || 'long' || 'medium' || 'short' ), 
    timeStyle: ('full' || 'long' || 'medium' || 'short' ), 
}


//-------------------------------------------------------------------
function assignLine(line){

    var dataHora = line.substring(0, 16);
    var arraySlipString = dataHora.split(' ');
   
    var ano, mes, dia, hora, min;
    dia = arraySlipString[0].split('/')[0];
    mes = parseInt(arraySlipString[0].split('/')[1])-1;
    ano = arraySlipString[0].split('/')[2];
    hora = arraySlipString[1].split(':')[0];
    min = arraySlipString[1].split(':')[1];

    var dtMenssagem = new Date(ano,mes.toString(),dia,hora,min);

     var remetenteMsg = lineDivision(line);
     var position = firstCharPosition(remetenteMsg, ':');
     
     var rtMenssagem = remetenteMsg.substring(0,position);
 
     var txt = remetenteMsg.substring(position+2, remetenteMsg.length)
 
     var mensagem = 
     {
         data: dtMenssagem,
         nome: rtMenssagem,
         texto: txt
     }
 
     return mensagem;
    
}

function lineDivision(line){
    var contatoMensagem = line.substring(19,line.length)
    return contatoMensagem;
}

function firstCharPosition(line, char){
    for(var i = 0; i < line.length-1 ; i++)
    {
        if(line.substring(i, i+1) == char)
         return i;
    }
    return null;
}

function lineBreak(line){
    var remetenteMsg = lineDivision(line);

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

//-------------------------------------------------------------------

var contarDC;
function countDaysTalked(durationDias, dataInicio, Menssagens){
    var  MensagensAgrupadasDias =[];
    var  contDiasConversados = 0;
    let  dataAtual, dataFinal, d;

    for(i=0; i < durationDias ; i++){
        dataAtual = dataInicio;
        d = moment(dataAtual);
        d.add(i, 'day'); 
        dataAtual = d.toDate();
        dataAtual.setHours(0,0,0,0);
        dataFinal = d.toDate();
        dataFinal.setHours(23,59,0,0);

        let objetosFiltrados = Menssagens.filter(result => {
            return result.data >= dataAtual  && result.data <= dataFinal;
           });

      var analytic = {
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

function identifySenders(Menssagens){
    var remetentes = []

    // percorrer por toda lista de menssagem 
    for(i = 0 ; i <= Menssagens.length-1 ; i++){
       if (remetentes.length !== 0){
            
            if(!exist(remetentes, Menssagens[i].nome))
            {
                remetente= {
                    nome: Menssagens[i].nome
                }
                remetentes.push(remetente);
            } 

           
       }
       else{
            remetente= {
                nome: Menssagens[i].nome
            }
            remetentes.push(remetente);
       }
    }
      
       

    return remetentes;
}

function toGroupMenssageContext(Menssagens){
    var antes = {};
    var idContexto;
    var contextos = [];

   
        for(var i=0; i< Menssagens.length-1; i++)
        {

            if(Menssagens[i].nome !== antes.nome )
            {
                antes = {
                    nome: Menssagens[i].nome,
                    id: i
                }

                var msgs = [];
                msgs.push(Menssagens[i]);
                var contexto = {
                    msgs:msgs,
                    nome: Menssagens[i].nome
                }
                
                idContexto = contextos.push(contexto)-1;
        
            }
            else{

                contextos[idContexto].msgs.push(Menssagens[i]);
            }
        }

        return contextos;
      
}

function mediaContext (AgrupamentoContexto, remetente){
    var ContextosRemetente =  filterGeneric(AgrupamentoContexto, remetente);
    var N=0 , E=0;

    for(var i =0; i < ContextosRemetente.length-1; i++ )
    {
        E+= ContextosRemetente[i].msgs.length;
        N++;
    }

  
    return E/N;
}

function mediaWordsContext(contexto, nome){
    var Epalavras=0, N=0, media=0;
    var fi = [];
    var mensagens = filterGeneric(contexto, nome);

    for(var i = 0; i<= mensagens.length-1; i++)
    {
        Epalavras=0;
        N=0;
        media=0;
        for(var j = 0; j<= contexto[i].msgs.length-1; j++)
        {
            Epalavras += contexto[i].msgs[j].texto.split(' ').length;
            N++;
        }
        
        media = Epalavras/N;
        fi.push(media);
    }

    Epalavras=0;
    N=0;
    media=0;

    for(var y= 0 ; y <= fi.length-1; y++)
    {
        Epalavras += fi[y];
        N++;
    }

    media = Epalavras/N;
    return media;
}

function mediaWords(Mensagens, nome){
    var Epalavras=0, N=0, media=0;
    var mensagens = filterGeneric(Mensagens, nome);
    for(var i = 0; i< mensagens.length-1 ; i++)
    {
        Epalavras += splitString(mensagens[i].texto, ' ').length;
        N++;
    }
    media = Epalavras / N;
    return media;
}
//-----------------------------------------------------
function mediaLetter(){

}

function mediaLetterMessage(){

}

function mediaLetterContextMessage(){

}



//------------------------------------------------------------
function weekContDays(week, menssagens){
    

    var fim = moment(menssagens[menssagens.length-1].data);
    var inicio = moment(menssagens[0].data)
    var duration =  moment.duration(fim.diff(inicio));

    d = moment(menssagens[0].data);
    
    for(var i = 0 ; i <= duration.asDays(); i++){
        var current = d;
        current = moment(current.toDate().setHours(0,0,0,0));
        current.add(i, 'day'); 
        var edit =  current.toDate();
        var dataedit = edit.toLocaleDateString( 'pt-br', options);
        var diaEdit = dataedit.split(' ')[0];
        var dia = dataedit.split(' ')[0].substring(0,diaEdit.length-1);

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

function weekCont(Mensagem){

    var data = [
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

    data = weekContDays(data, Mensagem);

    for(var i = 0; i <= Mensagem.length-1; i++){
        
        var dataedit = Mensagem[i].data.toLocaleDateString( 'pt-br', options);
        var diaEdit = dataedit.split(' ')[0];
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
    return mediaCont(data);
}


//------------------------------------------------------------
function periodCont(mensagem){

    period =[
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

    period = periodContHours(period,mensagem);

    for(var i= 0; i <= mensagem.length-1 ; i++){
        var periodo = getPeriodWithHours(mensagem[i].data.getHours())
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
    return mediaCont(period);
}

function getPeriodWithHours(hora){
    
    if(hora >= 6 && hora <= 11)
        return 'manha'
    if(hora >= 12 && hora <= 17)
        return 'tarde'
    if(hora >= 18 && hora <= 23)
        return 'noite'
    if(hora >= 0 && hora <= 5)
        return 'madrugada'
}

function periodContHours(period, mensagens){
    
    var fim = moment(mensagens[mensagens.length-1].data);
    var inicio = moment(mensagens[0].data)
    var duration =  moment.duration(fim.diff(inicio));

    d = moment(mensagens[0].data);
    
    for(var i = 0 ; i <= duration.asHours(); i++){
        var current = d;
        current = moment(current.toDate().setHours(0,0,0,0));
        current.add(i, 'hours'); 
        var hora = getPeriodWithHours(current.toDate().getHours())
       
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



//-------------------------------------------------------------------
function mediaCont(distribuicao){
   
    for(var i =0 ; i <= distribuicao.length-1; i++)
        distribuicao[i].media = distribuicao[i].cont / distribuicao[i].qtd

   return mediaPorcent(distribuicao);     
}
 
function mediaPorcent(distribuicao){
    var max = 0;
    for(var i =0 ; i <= distribuicao.length-1; i++)
        max += distribuicao[i].media;

    for(var i = 0; i <= distribuicao.length-1; i++)
        distribuicao[i].porcent = porcent(max, distribuicao[i].media);

    return distribuicao;
}


function porcent(max, x){
    return (x * 100) / max;
}

//------------------------------[velho]

function contMenssagensRemetentes(msgsRemententes){
    var totalRemetentes=0;
    msgsRemententes.forEach(item=> {
        totalRemetentes +=  item.mgsrt.length;
    });
    
    return totalRemetentes;
} 

function frequenciaRelativa(total, frequencia){
    return (frequencia / total)*100; 
 }

 function distribuicaoFrequencia (msgsRemententes){
    var totalRemetentes = 0; 
    var freqRelativa = 0;
    var msgs = []; 

    msgsRemententes.forEach(item => {
        totalRemetentes = contMenssagensRemetentes(msgsRemententes);
        freqRelativa = frequenciaRelativa(totalRemetentes, item.mgsrt.length);
        mg = {
            element: item,
            frel: freqRelativa,
            
        }  
        
        msgs.push(mg);
    });
    
    return msgs;
 }

// news ==========================================================




// function contextoToListValues (Contextos)
// {
    
// }

function mediana (listValues)
{  let elementList
    for (let index = 0; index < listValues.length; index++) {
        const element = listValues[index];
        
        if(!listValues[index + 1] >= element){
            elementList = listValues[index+1]
            listValues[index+1] = element;
            element = elementList;
            
        }
        else continue;//maior que o elemento

           
    }

    return listValues[Math.round(listValues.length/2)];
}

function moda (listValues){
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

function Variancia(listValues, mediaValues){
    let diferenceList =null;
    let PotenceList = null;
    let Acumulator = null;
    for (let index = 0; index < listValues.length; index++) {
        const element = listValues[index];
        if (listValues[index] >= mediaValues)
            diferenceList[index] = listValues[index] - mediaValues;
        else
            diferenceList[index] = mediaValues - listValues[index];
    }

    for (let index = 0; index < diferenceList.length; index++) 
        PotenceList[index] = diferenceList[index] * diferenceList[index];


    for (let index = 0; index < PotenceList.length; index++) 
        Acumulator += PotenceList[index];
        
    
    return Acumulator / PotenceList.length;
}




function DesvioPadrao(listValues, mediaValues) {
    // subtrair a media do valor da lista 
    let diferenceList = null ;
    let PotenceList = null;
    let Acumulator = null;
    for (let index = 0; index < listValues.length; index++) {
        const element = listValues[index];
        if (listValues[index] >= mediaValues)
            diferenceList[index] = listValues[index] - mediaValues;
        else
            diferenceList[index] = mediaValues - listValues[index];
    }

    for (let index = 0; index < diferenceList.length; index++) 
        PotenceList[index] = diferenceList[index] * diferenceList[index];


    for (let index = 0; index < PotenceList.length; index++) 
       Acumulator += PotenceList[index];
        
    
    return Math.sqrt(Acumulator / PotenceList.length);
}

function DesvioPadrao(variancia) {
    // subtrair a media do valor da lista 
    return Math.sqrt(variancia);
}

function MediaHarmonicaPonderada (ListValues,listWeights)
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

function CoeficientePearson(listValueA, listValueB, mediaA, mediaB, desvioA, desvioB){


    
}

function CoeficienteCorrelecao(media, mediana, moda, desvio){
    // return 3*(media - mediana) / desvio;
}



function DirectionCoeficientePearson (media, moda)
{
    return media - moda;
}

function statusCoeficientePearson(coeficiente)
{
    // assimetrica positiva
    if(coeficiente > 0)
        return "Alguma relação"

    // assimetrica negativa
    if(coeficiente < 0)
        return "Nenhuma relação" //

    // simetrica
    if(coeficiente == 0)
        return "Neutro" // normal 

}
//-------------------------------------------------------------------
module.exports = app => {

    app.get('/', function(req,res){
        res.render("form-upload");
    });
    
    app.post('/upload',upload.single("backup"), (req, res) =>{
            var Menssagens= [];
            var sujeiras= [];

            const rl = readline.createInterface({
                input: fs.createReadStream('./uploads/file.txt')
            });
            
            rl.on('line', (line) => {
                
                if(!lineBreak(line))
                {
                    if(Menssagens.length !== 0){
                        var space = ' ';
                        Menssagens[Menssagens.length-1].texto = Menssagens[Menssagens.length-1].texto.concat(space.concat(splitString(line, ' ').join(' ')));
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
                    Menssagens.push(assignLine(line));
                }     
            });
            rl.on('close', () => {
                
                fs.unlinkSync("./uploads/file.txt"); 
               
          
           
                var fim = moment(Menssagens[Menssagens.length-1].data);
                var inicio = moment(Menssagens[0].data)
                var duration =  moment.duration(fim.diff(inicio));
                
                var  MensagensAgrupadasDias =[];
                 
                MensagensAgrupadasDias = countDaysTalked(duration.asDays(), inicio.toDate(), Menssagens);
                var msgsRemententes = [];
              
                var media;
                var contextos = toGroupMenssageContext(Menssagens);
                var dados=[];

                identifySenders(Menssagens).forEach(element => {
                    media = mediaContext(contextos, element.nome);
                  
                    var msgsRt={
                       nome: element.nome,
                       qtdContexto: contextos.length,
                       mediaMsgContexto: media,
                       mediaPalavras: mediaWords(Menssagens, element.nome),
                    //    desvio:
                    //    mediana:
                    //    moda:
                    
                       mediaPalavrasContexto: mediaWordsContext(contextos, element.nome),
                    //    desvio:
                    //    mediana:
                    //    moda:
                       msgsContexto: filterGeneric(contextos, element.nome),  
                    //    desvio:
                    //    mediana:
                    //    moda:
                       mgsrt: filterGeneric(Menssagens,element.nome),
                       
                   };
                   
                   msgsRemententes.push(msgsRt); 
                   
                   
                });
               
               
               
                var dias = Math.trunc(duration.asDays());
                var horas = Math.trunc(((duration.asDays() - Math.trunc(duration.asDays()))*24));
                var minutos = Math.trunc((((duration.asDays() - Math.trunc(duration.asDays()))*24) - Math.trunc((duration.asDays() - Math.trunc(duration.asDays()))*24)) * 60);

                res.render('home', {totalmsg:Menssagens.length, 
                                    dtinicio: Menssagens[0].data.toLocaleDateString( 'pt-br', options),
                                    dtfim: Menssagens[Menssagens.length-1].data.toLocaleDateString( 'pt-br', options),
                                    msgsRemetentes: msgsRemententes,
                                    dias: dias,
                                    horasDias: horas,
                                    minutosHoras: minutos,
                                    convDias: contarDC,
                                    week: weekCont(Menssagens),
                                    periodos: periodCont(Menssagens),
                                    distribFrequence: distribuicaoFrequencia(msgsRemententes),
                                    
                                    
                                    });
            });
        
        
    });
}