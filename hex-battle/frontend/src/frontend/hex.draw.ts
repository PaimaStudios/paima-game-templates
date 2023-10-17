export class DrawHex {
  // hexagon angule [radians]
  static hexside = (2 * Math.PI) / 6;
  // draw 2d hexagon
  public static drawHexagon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    rotation = 0
  ) {
    for (let i = 0; i <= 6; i++) {
      ctx.lineTo(
        x + size * Math.cos(DrawHex.hexside * i + rotation),
        y + size * Math.sin(DrawHex.hexside * i + rotation)
      );
    }
    ctx.stroke();
  }

  // draw 3dish hexagon
  public static draw3DHexagon(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    x_o: number,
    y_o: number
  ) {
    let start = 0;
    let end = 0;
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      start = x + size * Math.cos(DrawHex.hexside * i);
      end = y + size * Math.sin(DrawHex.hexside * i);
      ctx.lineTo(start, end);
      ctx.lineTo(start + x_o, end + y_o);
      ctx.lineTo(start, end);
    }
    ctx.lineTo(start + x_o, end + y_o);
    for (let i = 0; i <= 6; i++) {
      const start = x + size * Math.cos(DrawHex.hexside * i) + x_o;
      const end = y + size * Math.sin(DrawHex.hexside * i) + y_o;
      ctx.lineTo(start, end);
    }
    ctx.stroke();
  }
}
