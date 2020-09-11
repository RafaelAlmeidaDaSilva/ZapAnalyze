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

function atribLine(arraySlipString){

    


    // pegar a data da mensagem
    var dtMenssagem = new Date(splitString(arraySlipString[0], '/')[2],
                                splitString(arraySlipString[0], '/')[1],
                                splitString(arraySlipString[0], '/')[0],
                                splitString(arraySlipString[1], ':')[0],
                                splitString(arraySlipString[1], ':')[1]
                                );
    
    // pega o nome do remetente

    var rtMenssagem = splitString( arraySlipString[3], ':' )[0];
    var txtMenssagem = [];
    for (var i = 4; i < arraySlipString.length; i++) {
        if(arraySlipString[i] !== '' || arraySlipString[i] !== null)
            txtMenssagem.push(arraySlipString[i]);
        else
            break;   
     }

    var txt = txtMenssagem.join(' ');

    var mensagem = {
        data: dtMenssagem,
        nome: rtMenssagem,
        texto: txt
    }

    return mensagem;
    
}
var contarDC;
function contarDiasConversados(durationDias, dataInicio ){
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
    for(i = 0 ; i < Menssagens.length-1 ; i++){
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

function quebraDeLinha (arraySlipString){
    if(arraySlipString[0].substring(2,3) === '/')
           return true 
   return false;        
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

var Menssagens= [];
var sujeiras= [];

module.exports = app => {

    app.get('/', function(req,res){
        res.render("form-upload");
    });
    
    app.post('/upload',upload.single("backup"), (req, res) =>{

            const rl = readline.createInterface({
                input: fs.createReadStream('./uploads/file.txt')
            });
            
            rl.on('line', (line) => {
                 // analisar

                // objetivo: Calcular o nivel de interesse 

                // esse codigo repara sujeira e quebra de linhas provadas por imagens com legenda
                if(!quebraDeLinha(splitString(line, ' ')))
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
                    Menssagens.push(atribLine(splitString(line, ' ')));
                }    
            });
            rl.on('close', () => {
                
                fs.unlinkSync("./uploads/file.txt"); 
                let options = {     
                    dateStyle: ('full' || 'long' || 'medium' || 'short' ), 
                    timeStyle: ('full' || 'long' || 'medium' || 'short' ), 
                }
           
                console.log("Inicio: ",Menssagens[0].data);
                console.log("Fim: ", Menssagens[Menssagens.length-1].data); 
                var fim = moment(Menssagens[Menssagens.length-1].data);
                var inicio = moment(Menssagens[0].data)
                var duration =  moment.duration(fim.diff(inicio));
                
                
                var  MensagensAgrupadasDias =[];
                 
                MensagensAgrupadasDias = contarDiasConversados(duration.asDays(), inicio.toDate());
                var msgsRemententes = [];
               
                identificarRemetentes(Menssagens).forEach(element => {
                   var msgsRt={
                       nome: element.nome,
                       mgsrt: filterGeneric(Menssagens,element.nome)
                   };
               
                   msgsRemententes.push(msgsRt); 
                });
          
                
                var dias = Math.round(duration.asDays());
                var horas = Math.round((duration.asDays() - Math.round(duration.asDays()))*24);
                var minutos = Math.round(((duration.asDays() - Math.round(duration.asDays()))*24 - Math.round((duration.asDays() - Math.round(duration.asDays()))*24)) * 60);
                
                var contextos = AgruparContextos(Menssagens);

                console.log(contextos);

                res.render('home', {totalmsg:Menssagens.length, 
                                    dtinicio: Menssagens[0].data.toLocaleDateString( 'pt-br', options),
                                    dtfim: Menssagens[Menssagens.length-1].data.toLocaleDateString( 'pt-br', options),
                                    msgsRemetentes: msgsRemententes,
                                    dias: dias,
                                    horasDias: horas ,
                                    minutosHoras: minutos,
                                    convDias: contarDC
                                });
            });
        //   
        
    });
    
}
