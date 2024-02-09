function Ball() {
    this.id = "ball";
    this.x = 0;
    this.y = 0;
    this.vx=5;
    this.vy=5;
}

function place_objects(objects) {
    for (let object of objects) {
        let element = document.getElementById(object.id);

        // Si l'objet est la balle
        if (object.id === "ball") {
            element.style.left = object.x + "px";
            element.style.top = object.y + "px";
        }
        // Si l'objet est une raquette
        else if (object instanceof Raquette) {
            element.style.left = (object.position === "left" ? 10 : window.innerWidth - 30) + "px";
            element.style.top = object.y + "px";
            
        }
    }
}

let scoreJoueur1 = 0;
let scoreJoueur2 = 0;

let resettingBall = false; // Variable pour indiquer si la balle est en cours de réinitialisation

function update() {
    ball.x += ball.vx;
    ball.y += ball.vy;
    const bodyRect = document.body.getBoundingClientRect();

    // Correction du rebondissement en haut et en bas
    if (ball.y < 0 || ball.y + 64 > bodyRect.height) {
        ball.vy = -ball.vy;
    }

    // Mettez à jour les positions des raquettes
    raquetteGauche.update();
    raquetteDroite.update();

  // Correction du rebondissement sur les raquettes
if (
    ball.x < raquetteGauche.width && // Si la balle touche la raquette gauche
    ball.y + 64 > raquetteGauche.y && // Si la balle est plus basse que le haut de la raquette gauche
    ball.y < raquetteGauche.y + raquetteGauche.height // Si la balle est plus haute que le bas de la raquette gauche
) {
    ball.vx = Math.abs(ball.vx); // Ajuste la vitesse horizontale pour qu'elle soit positive (vers la droite)
    ball.x = raquetteGauche.width; // Place la balle juste à côté de la raquette gauche
    
}

if (
    ball.x + 64 > window.innerWidth - 30 && // Si la balle touche la raquette droite
    ball.y + 64 > raquetteDroite.y && // Si la balle est plus basse que le haut de la raquette droite
    ball.y < raquetteDroite.y + raquetteDroite.height // Si la balle est plus haute que le bas de la raquette droite
) {
    ball.vx = -Math.abs(ball.vx); // Ajuste la vitesse horizontale pour qu'elle soit négative (vers la gauche)
    ball.x = window.innerWidth - 30 - 64; // Place la balle juste à côté de la raquette droite
   
}


    // Vérification si la balle sort complètement de l'écran à gauche ou à droite
    if (ball.x < 0) {
        if (!resettingBall) { // Vérifie si la balle n'est pas déjà en cours de réinitialisation
            resettingBall = true; // Indique que la balle est en cours de réinitialisation
            scoreJoueur2++;
            updateScore();
            // Attendre un certain délai avant de réinitialiser la balle et mettre à jour le score
            setTimeout(function() {
                resetBall();
                updateScore();
                resettingBall = false; // Indique que la réinitialisation est terminée
            }, 1000); // 1000 millisecondes = 1 seconde de délai
        }
    } else if (ball.x + 64 > window.innerWidth - 30) {
        if (!resettingBall) { // Vérifie si la balle n'est pas déjà en cours de réinitialisation
            resettingBall = true; // Indique que la balle est en cours de réinitialisation
            scoreJoueur1++;
            updateScore();
            // Attendre un certain délai avant de réinitialiser la balle et mettre à jour le score
            setTimeout(function() {
                resetBall();
                updateScore();
                resettingBall = false; // Indique que la réinitialisation est terminée
            }, 1000); // 1000 millisecondes = 1 seconde de délai
        }
    }

    place_objects([ball, raquetteDroite, raquetteGauche]);
    requestAnimationFrame(update);
    document.addEventListener("keydown", track_player_input);
    document.addEventListener("keyup", track_player_input);
}



function resetBall() {
    ball.x = window.innerWidth / 2 - 32; // Positionne la balle au milieu horizontalement
    ball.y = window.innerHeight / 2 - 32; // Positionne la balle au milieu verticalement
    // Change la direction de la balle avec une direction aléatoire
    // Si le joueur 1 a marqué, la balle va vers le joueur 2 (vers la droite)
    // Si le joueur 2 a marqué, la balle va vers le joueur 1 (vers la gauche)
    ball.vx = (scoreJoueur1 > scoreJoueur2 ? -1 : 1) * 5;
    ball.vy = (Math.random() > 0.5 ? 1 : -1) * 5;
}


function updateScore() {
    document.getElementById("player1Score").innerText = scoreJoueur1;
    document.getElementById("player2Score").innerText = scoreJoueur2;
}



let ball, raquetteGauche, raquetteDroite;

function init() {
    ball = new Ball();
    raquetteGauche = new Raquette("left", window.innerHeight);
    raquetteDroite = new Raquette("right", window.innerHeight);

    // Ajustez la position y de la raquetteGauche
    raquetteGauche.y = window.innerHeight / 2 - raquetteGauche.height / 2;

    // Ajustez la position y de la raquetteDroite
    raquetteDroite.y = window.innerHeight / 2 - raquetteDroite.height / 2;
    updateScore();
    requestAnimationFrame(update);
}





function track_player_input(event) {
    if (event.type == "keydown") {
        switch (event.key) {
            case "a":
                raquetteGauche.p1_up = true;
                break;
            case "q":
                raquetteGauche.p1_down = true;
                break;
            case "p":
                raquetteDroite.p2_up = true;
                break;
            case "m":
                raquetteDroite.p2_down = true;
                break;
        }
    } else if (event.type == "keyup") {
        switch (event.key) {
            case "a":
                raquetteGauche.p1_up = false;
                break;
            case "q":
                raquetteGauche.p1_down = false;
                break;
            case "p":
                raquetteDroite.p2_up = false;
                break;
            case "m":
                raquetteDroite.p2_down = false;
                break;
        }
    }
}


function Raquette(position, spaceHeight) {
    this.position = position;
    if(position=='left')
        this.id="paddle1";
    if(position=='right')
        this.id="paddle2";
    
    this.y = window.innerHeight / 2 - this.height / 2;
    this.spaceHeight = spaceHeight;
    this.width = 24;
    this.height = 192;
    this.speed = 5;

    // Ajouter ces propriétés
    this.p1_up = false;
    this.p1_down = false;
    this.p2_up = false;
    this.p2_down = false;

    this.update = function () {
        // Mettre à jour la position en fonction des touches
        if (this.position === "left") {
            if (this.p1_up && this.y > this.height/2) {
                this.y -= this.speed;
            }
            if (this.p1_down && this.y < spaceHeight - this.height/2) {
                this.y += this.speed;
            }
        } else if (this.position === "right") {
            if (this.p2_up && this.y > this.height/2) {
                this.y -= this.speed;
            }
            if (this.p2_down && this.y < spaceHeight - this.height/2) {
                this.y += this.speed;
            }
        }
    };
}


function resetBall() {
    ball.x = window.innerWidth / 2 - 32; // Positionne la balle au milieu horizontalement
    ball.y = window.innerHeight / 2 - 32; // Positionne la balle au milieu verticalement
    // Change la direction de la balle avec une direction aléatoire
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.vy = (Math.random() > 0.5 ? 1 : -1) * 5;
}

window.onload=init;
document.body.getBoundingClientRect();





