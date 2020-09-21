const upload = require('../libs/config-upload');
const readline = require('readline');
const fs = require('fs');
const moment = require('moment');

function splitString(stringToSplit, separator) {
    var arrayOfStrings = stringToSplit.split(separator);
  
    // console.log('Linha: "' + stringToSplit + '"');
    // console.log('O array tem ' + arrayOfStrings.length + ' elementos: ' + arrayOfStrings.join(' / '));

    return arrayOfStrings;
}

function atribLine(line){

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
     var position = FirstCharPosition(remetenteMsg, ':');
     
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

function FirstCharPosition(line, char){
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
            var position = FirstCharPosition(remetenteMsg, ':');
            if (position !== null)
                return true;
            
        }
    }
    return false;

}

var contarDC;
function contarDiasConversados(durationDias, dataInicio, Menssagens){
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

function exist(array, dado){
    for(j= 0 ; j <= array.length-1; j++)
        if(array[j].nome === dado)
            return true;
    return false;
}   

function identificarRemetentes(Menssagens){
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
      
        // verificar se ja contem remetente
            // senao houver
                // adiciona
            // se houver  
                // pula para proxima linha 
    return remetentes;
}

function filterGeneric (Menssagens, nome ){
    let menssagens = Menssagens.filter((line) => {
        return line.nome == nome;
    });

    return menssagens;
}

function AgruparContextos(Menssagens){
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

function MediaContexto (AgrupamentoContexto, remetente){
    var ContextosRemetente =  filterGeneric(AgrupamentoContexto, remetente);
    var N=0 , E=0;

    for(var i =0; i < ContextosRemetente.length-1; i++ )
    {
        E+= ContextosRemetente[i].msgs.length;
        N++;
    }

  
    return E/N;
}

function mediaPalavras(Mensagens, nome){
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

function mediaPalavrasContexto(contexto, nome){
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

function weekContDays(week, menssagens){
    

    var fim = moment(menssagens[menssagens.length-1].data);
    var inicio = moment(menssagens[0].data)
    var duration =  moment.duration(fim.diff(inicio));

    d = moment(menssagens[0].data);
    
    for(var i = 0 ; i <= duration.days(); i++){
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
         media: 0},
         {semana:'terça',
          cont: 0,
         qtd: 0,
         media: 0},
         {semana:'quarta',
          cont: 0,
         qtd: 0,
         media: 0},
         {semana:'quinta',
          cont: 0,
         qtd: 0,
         media: 0},
         {semana:'sexta',
          cont: 0,
          qtd: 0,
         media: 0},
         {semana:'sabado',
          cont: 0,
         qtd: 0,
         media: 0},
         {semana:'domingo',
          cont: 0,
         qtd: 0,
         media: 0}
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
    return weekMediaCont(data);
}

function weekMediaCont(week){
   
    for(var i =0 ; i <= week.length-1; i++)
        week[i].media = week[i].cont / week[i].qtd

   return week;     
}


let options = {     
    dateStyle: ('full' || 'long' || 'medium' || 'short' ), 
    timeStyle: ('full' || 'long' || 'medium' || 'short' ), 
}
// char por remetente 
// por mensagem 
// por contexto

// identificar imagem 
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
                    Menssagens.push(atribLine(line));
                }     
            });
            rl.on('close', () => {
                
                fs.unlinkSync("./uploads/file.txt"); 
               
           
                var fim = moment(Menssagens[Menssagens.length-1].data);
                var inicio = moment(Menssagens[0].data)
                var duration =  moment.duration(fim.diff(inicio));
                
                var  MensagensAgrupadasDias =[];
                 
                MensagensAgrupadasDias = contarDiasConversados(duration.asDays(), inicio.toDate(), Menssagens);
                var msgsRemententes = [];
                var media;
                var contextos = AgruparContextos(Menssagens);
                var dados=[];

                identificarRemetentes(Menssagens).forEach(element => {
                    media = MediaContexto(contextos, element.nome);
                    
                    var msgsRt={
                       nome: element.nome,
                       mediaMsgContexto: media,
                       mediaPalavras: mediaPalavras(Menssagens, element.nome),
                       mediaPalavrasContexto: mediaPalavrasContexto(contextos, element.nome),
                       msgsContexto: filterGeneric(contextos, element.nome),  
                       mgsrt: filterGeneric(Menssagens,element.nome)
                   };
                   
                   msgsRemententes.push(msgsRt); 
                });
                
                // console.log("Ultima mensagem: ",Menssagens[Menssagens.length-1].data);
                // console.log("Mensagem:", Menssagens[Menssagens.length-1]);
                
                // console.log("Primeira mensagem",Menssagens[0].data);

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
                                    });
            });
        
        
    });
    
}
