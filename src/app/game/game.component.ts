import { CommonModule } from '@angular/common';
import { Component, inject, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Game } from "../../models/game";
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { GameTodoComponent } from '../game-todo/game-todo.component';
import { Firestore, collection, getDocs, onSnapshot, addDoc, doc } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule, GameTodoComponent],
  providers: [MatDialog],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit, OnDestroy {


  private unsubscribeSnapshot?: () => void;
  private ngZone = inject(NgZone);
  private firestore = inject(Firestore);
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  gamesCollection = collection(this.firestore, 'games');

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newGame();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const gameId = params.get('id');
      console.log(params.get('id'));
      const gameDocRef = doc(this.firestore, `games/${gameId}`);

      this.unsubscribeSnapshot = onSnapshot(gameDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log('Game Update:', docSnapshot.data());
          const gameData = docSnapshot.data() as Game;
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.playedCards = gameData.playedCards;
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
        }

      });
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }

  async newGame() {
    this.game = new Game();
    await addDoc(this.gamesCollection, { game: this.game.toJson() });
    const querySnapshot = await getDocs(this.gamesCollection);
    const gameIds = querySnapshot.docs.map(doc => doc.data());
    console.log(gameIds);
  }

  takeCard() {

    if (!this.pickCardAnimation && this.game.players.length > 0) {
      this.currentCard = this.game.stack.pop() as string;
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);

    }
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      debugger;
      if (name) {
        if (!this.game.players) {
          this.game.players = [];
        }
      }
      this.game.players.push(name);
    });
  }

}
