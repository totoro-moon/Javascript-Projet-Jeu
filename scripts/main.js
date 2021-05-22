//variable pour attribuer une image a chaques cartes.
var imgCartes = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12];
/*
variable pour l'état des cartes :
(0)= face cachée
(1)= face visible
(-1)= déja retournée
*/
var etatsCartes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
//tableau des cartes retournées pendant la partie
var carteRetournees = [];
//variable pour les paires trouvées
var nbPairesTrouvees = 0;
//variable pour pointer les images de notre tableau.
var imgPlateau = document.getElementById('plateau').getElementsByTagName('img');

//On crée une boucle pour parcourir la longueur de notre tableau
for(var i = 0; i<imgPlateau.length;i++){
  //Attribution d'un numéro de carte à l'objet img
  imgPlateau[i].numCarte = i;
  imgPlateau[i].onclick = function () {
    controleDuJeu(this.numCarte);
  }
}

//J'appelle ma fonction initilisationDuJeu()
initialisationDuJeu();

/*
Je crée une fonction majAffichage() qui met à jour l'affichage de la carte dont on passe le numéro en paramètre.
L'affichage rendu dépend de l'état actuel de la carte (donné par le tableau etatsCartes) :
état 0 : carte face cachée, on affichage l'image de dos de carte : reverse-card.jpeg,
état 1 : carte retournée, on affiche l'image du motif correspondant, on notera que les différentes images des motifs sont dans les fichiers nommés carte1.png, carte2.png, etc.,
état -1 : carte enlevée du jeu, on cache l'élément img.
*/
function majAffichage(numCarte) {
  //SI la carte numéro ... est de dos,
  switch (etatsCartes[numCarte]) {
    //ALORS dans le cas n0 on affichage l'image de dos de carte.
    case 0:
      imgPlateau[numCarte].src = 'Images/reverse-card.jpg';
      break;
      //ALORS dans le cas n1 on affichage l'image de face.
    case 1:
      imgPlateau[numCarte].src = 'Images/Card'+ imgCartes[numCarte] + '.jpg';
      break;
      //ALORS dans le cas n-1 la carte disparait.
    case -1:
      imgPlateau[numCarte].style.visibility = 'hidden';
      break;
  }
}

//Je crée la fonction rejouer()
function rejouer(){
  setTimeout(function(){
    //utilisation de JQuery pour l'affichage de la modal
    $('#exampleModal').modal('show');
  },3000);
  // la fonction .style.diplay efface le tableau surprise avec un delais de temps
  setTimeout(function () {
    document.getElementById("surprise").style.display = "none";
  }, 2000);
  // la méthode location.reload() permet de recharger la page initiale dans le navigateur avec un delais de temps.
  window.setTimeout(function () {
    location.reload()
  }, 8000);
}
/*Je crée une fonction qui mélange les numéros de nos imgCartes.
Pour cela un algorithme de mélange est utilisé.(Fisher-Yates)
voir: https://www.delftstack.com/fr/howto/javascript/shuffle-array-javascript/
voir: https://sciences-du-numerique.fr/programmation-en-javascript/melanger-les-elements-d-un-tableau/6
*/
function initialisationDuJeu() {
  //je crée une boucle qui va fonctionner dans l'ordre inverse du tableau pour l'affichage initial de mes images.
  for(var position = imgCartes.length-1; position>=1; position--){
    //Je génère une position aléatoire de mes images dans le tableau.
    var random = Math.floor(Math.random()*(position+1));
    //cette variable correspond à l'échange de place des images entre elles dans le tableau.(de manière destructurée)
    //Et...
    var newPosition = imgCartes[position];
		imgCartes[position] = imgCartes[random];
		imgCartes[random] = newPosition;
  }
}

function controleDuJeu(numCarte) {
  //SI le nombre de cartes retournées dans le tableau est inférieur à 2.
  if(carteRetournees.length<2){
    //SI la carte n... est de dos (état 0)
    if(etatsCartes[numCarte] == 0){
      //ET qu'elle est cliquée, l'état de la carte n... passe à (état 1 = face visible)
      etatsCartes[numCarte] = 1;
      //on ajoute le numéro de la carte à la fin du tableau des cartes retournées (voir var carteRetournees ligne 10)
      carteRetournees.push (numCarte);
      //On fait la MAJ de l'affichage de la carte numéro ...
      majAffichage(numCarte);
    }
    //SI le nombre de carte retournée est égale à 2
    if(carteRetournees.length == 2){
      //je crée une variable donnant le nouvel état.
      var nouvelEtat = 0;
      //SI la carte qui se trouve en position [0] dans le tableau carteRetournees est égale à la carte qui se trouve en position [1],
      if(imgCartes[carteRetournees[0]] == imgCartes [carteRetournees[1]]){
        //Alors elle disparaissent de l'écran
        nouvelEtat = -1;
        //la variable nbPairesTrouvees est incrémentée de 1.
        nbPairesTrouvees++;
      }
      //Si les deux cartes ne sont pas identiques, elles reviennent en position initiale.
      etatsCartes [carteRetournees[0]] = nouvelEtat;
      etatsCartes [carteRetournees[1]] = nouvelEtat;

      //Fontion correspondant au temps imparti du changement de l'affichage des cartes.
      setTimeout(function () {
        majAffichage(carteRetournees[0]);
        majAffichage(carteRetournees[1]);
        carteRetournees = [];
        if (nbPairesTrouvees == 12) {
          rejouer();
        }
        //750ms
      },750);
    }
  }
}
