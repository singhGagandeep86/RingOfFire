import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Game } from "../../models/game";
import { PlayerComponent } from "../player/player.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { GameTodoComponent } from '../game-todo/game-todo.component';
import { Firestore, collection, onSnapshot, doc } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { updateDoc } from 'firebase/firestore';
import { PlayerMobileComponent } from "../player-mobile/player-mobile.component";
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule, GameTodoComponent, PlayerMobileComponent],
  providers: [MatDialog],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit, OnDestroy {
  private unsubscribeSnapshot?: () => void;
  private firestore = inject(Firestore);
  game!: Game;
  gameOver = false;
  gamesCollection = collection(this.firestore, 'games');

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.newGame();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const gameId = params.get('id');
      const gameDocRef = doc(this.firestore, 'games', gameId as string);

      this.unsubscribeSnapshot = onSnapshot(gameDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          let gameData = docSnapshot.data() as { game: Game };
          this.game.currentPlayer = gameData.game.currentPlayer;
          this.game.playedCards = gameData.game.playedCards;
          this.game.players = gameData.game.players;
          this.game.playersPic = gameData.game.playersPic;
          this.game.stack = gameData.game.stack;
          this.game.pickCardAnimation = gameData.game.pickCardAnimation;
          this.game.currentCard = gameData.game.currentCard;
        } else {
          console.log(`no such Game`);
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
  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
      this.saveGame();
    } else if (!this.game.pickCardAnimation && this.game.players.length > 0) {
      this.game.currentCard = this.game.stack.pop() as string;
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);

    }
  }

  editPlayer(index: number) {
    console.log('test', index);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      console.log(`Changes made`, change);
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(index, 1);
        }
        this.game.playersPic[index] = change;
        this.saveGame();
      }
    });
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        if (!this.game.players) {
          this.game.players = [];
        }
      }
      this.game.players.push(name);
      this.game.playersPic.push('user.png');
      this.saveGame();
    });
  }


  saveGame() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const gameId = params.get('id');
      updateDoc(doc(this.firestore, 'games', gameId as string), { game: this.game.toJson() });
    });
  }

}
