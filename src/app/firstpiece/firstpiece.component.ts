import { Component, OnInit } from '@angular/core';
import { range, chunk, sum, clamp } from 'lodash/fp';
import p5 = require('p5');
import 'p5/lib/addons/p5.sound';

@Component({
  selector: 'app-firstpiece',
  templateUrl: './firstpiece.component.html',
  styleUrls: ['./firstpiece.component.styl']
})
export class FirstpieceComponent implements OnInit {

  private p5Holder;
  constructor() { }

  ngOnInit() {
    this.createCanvas(this.sketch);
  }

  private createCanvas(sketch) {
    this.p5Holder = new p5(sketch);
    console.log('P5 holder: ', JSON.stringify(this.p5Holder));
  }

  private sketch(p: p5) {
    function setGradient(x, y, w, h, c1, c2, axis) {
      const Y_AXIS = 1;
      const X_AXIS = 2;
      let inter, c;
      p.noFill();

      if (axis === Y_AXIS) {  // Top to bottom gradient
        for (let i = y; i <= y + h; i++) {
          inter = p.map(i, y, y + h, 0, 1);
          c = p.lerpColor(c1, c2, inter);
          p.stroke(c);
          p.line(x, i, x + w, i);
        }
      } else if (axis === X_AXIS) {  // Left to right gradient
        for (let i = x; i <= x + w; i++) {
          inter = p.map(i, x, x + w, 0, 1);
          c = p.lerpColor(c1, c2, inter);
          p.stroke(c);
          p.line(i, y, i, y + h);
        }
      }
    }

    let color = [10, 50, 200];
    const squareColors = range(0, 100).map(x => [getDelta(255), getDelta(255), getDelta(255)]);
    const add = (a, b) => a + b;
    const sub = (a, b) => a - b;
    let changeFn = add;
    const lastFreqs = [];

    console.log('Add: ', add(1, 1));
    console.log('ChangeFn: ', changeFn(1, 1));
    function getDelta(amplitude) {
      return Math.floor(Math.random() * amplitude);
    }

    function mutateColor(c: any, amplitude = 15) {
      return c.map(x => {
        const newColor = Math.max(Math.min(255, changeFn(x, getDelta(getDelta(15)))), 0);
        if (newColor >= 200) {
          changeFn = sub;
        } else if (newColor <= 50) {
          changeFn = add;
        }
        return newColor;
      });
    }
    let music;
    let fft;
    let quadX;
    let quadY;
    let quadLength;
    p.preload = () => {
      music = p['loadSound']('/assets/firstPiece.mp3');
    };

    p.setup = () => {
      const canvas = p.createCanvas(1024, 768);
      p.frameRate(10);
      canvas.parent('firstPieceContainer');
      music.setVolume(0.5);
      music.play();
      fft = new p5.FFT();
    };

    p.draw = () => {

      p.push();
      const c1 = p.color(color);
      const c2 = p.color(color.map(x => Math.max(0, x - 150)));
      setGradient(0, 0, p.width, p.height - 268, c1, c2, 1);
      p.pop();

      // console.log(JSON.stringify(color));
      color = mutateColor(color, 50);
      // console.log('New Color: ', JSON.stringify(color));
      p.push();
      const analyze = fft.analyze();
      const chunks = chunk(Math.ceil(analyze.length / 5), analyze).map(sum).map(x => Math.ceil(x / 5000));
      for (let i = 0; i < chunks.length; i++) {
        for (let j = 0; j < chunks[i]; j++) {
          const size = 3 + getDelta(15);
          const x = getDelta(1024);
          const yDelta = x > 512 ? clamp(35, 200, (x - 512) / 4) : clamp(35, 200, (512 - x) / 4);
          p.rect(x, i * 100 + yDelta + getDelta(5), size, size);
        }
      }
      p.pop();

      p.push();
      p.fill([25, 25, 100]);
      p.rect(0, 500, 1024, 268);
      p.pop();

      // p.push();
      // if (!quadX || quadX < 0) {
      //   quadX = 1024;
      //   quadY = 500 + getDelta(268);
      //   quadLength = (quadY - 500) / 3;
      // }

      // p.quad(
      //   quadX, quadY,
      //   quadX - quadLength, quadY,
      //   quadX - (1.5 * quadLength), quadY + quadLength,
      //   quadX + (quadLength), quadY + quadLength);
      // quadX -= 1;

      // p.pop();

      p.push();
      p.rotate(-.9);
      p.translate(-650, 300);
      p.fill(squareColors[10]);

      p.ellipse(550, 550, 300, 450);
      p.pop();

      for (let i = 0; i < 100; i++) {
        squareColors[i] = mutateColor(squareColors[i]);
        p.fill(squareColors[i]);
        const size = 50 - getDelta(25);
        p.rect((i % 10) * 50 + getDelta(50), (i % 10) * 50 + getDelta(50), size, size);
      }
    };
  }

}
