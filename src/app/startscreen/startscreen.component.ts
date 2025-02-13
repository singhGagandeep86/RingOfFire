import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, getDocs, addDoc, collection } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-startscreen',
  imports: [],
  templateUrl: './startscreen.component.html',
  styleUrl: './startscreen.component.scss'
})
export class StartscreenComponent {

  private firestore = inject(Firestore);
  gamesCollection = collection(this.firestore, 'games');

  constructor(private router: Router) { }

  async newGame() {
    let game = new Game();
    // console.log(game);

    let gameRef = await addDoc(this.gamesCollection, { game: game.toJson() });
    // console.log( await addDoc(this.gamesCollection, { game: game.toJson() }));
    // console.log(gameRef.id);
    
    
    // const querySnapshot = await getDocs(this.gamesCollection);
    // const gameIds = querySnapshot.docs.map(doc => doc.data());
    // console.log(gameIds);
    this.router.navigateByUrl('/game/' + gameRef.id);
  }

}
