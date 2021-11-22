
## To implements (TASKS)


- Ele deverá considerá uma mensagem como texto e ou multimidia(audio, imagem e video);
- Gerar PDF da pagina;



 #### Identificador e contar perguntas na conversa de cada remetente da conversa;

   - identificar "?" nas mensagens
   - contar quantidade total de cada usuario
   - identificar quem é mais curioso
   - tirar a diferença 
   - se for maior que 2, entao existe uma significancia 



#### Identificar tipos de reciprocidade existentes;

    - pegar a correlação pearson entre a quantidade de mensagens que mando e que o outro manda
    - identificar se esta positivamente ou nao correlacionado
    - se sim, existe reciprocidade
    


#### Pegar o tempo medio entre cada mensagem;

    - pegar tempo entre cada mensagem de resposta;
    - tirar media de cada remetente;



#### Comparar reciprocidade com base em um rating;

    - pegar a correlação pearson entre a quantidade de mensagens que mando e que o outro manda
    - identificar se esta positivamente ou nao correlacionado
    - se sim, conta +1

    - identificar quem inicia mais a conversa
    - tirar a diferença
    - se nao for uma diferença abrupta conta +1

    - pegar correlação entre  a quantidades de iniciação de cada um
    - se for positiva, conta +1.
    
    - tirar diferença entre a media de tempo de resposta
    - se nao for abrupta +1

    - fazer correlação entre o tempo de um com o de outro
    - se for positivo, conta +1 

    - calcular a interação (media de palavras x media de mensagens) de cada remetente
    - tirar a diferença  entre os remetentes
    - se nao abrupta , contar +1
    - tirar correlação, se der neutro +1

    -  0 nada significante (sem vinculo), 2 alguma coisa haver (conhecido), 3 significante (casual), 4 e 5 amizade (prospero), 6 e 7 intimidade (apego emocional).



#### determinar e exibir acuracia dos resultados;



### fazer lista de conjunto de mensagens que ultrapassam a media de mensagens em conjunto
    - categorizar como mensagens acima da media.
    - dias da semana que mais ocorre
    - periodo que mais ocorre.