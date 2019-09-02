/**
* LMS_GameRenderer constructor
*/
function LMS_GameRenderer() {
  this.drawPauseScreen = function(canvas, ctx) {
    console.log('draw pause scree');
  };
  this.drawGameOverScreen = function( canvas, ctx ) {
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = 0.1;
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();

    // Game Over text
    ctx.save();
    ctx.font = 'bold 50px Arial';
    const text = 'Game Over';
    ctx.fillStyle = '#fff';
    const emoji = '😱';
    const emojiObj = ctx.measureText(emoji);
    const textObj = ctx.measureText(text);
    ctx.fillText( emoji, canvas.width / 2 - emojiObj.width / 2, canvas.height / 2 - 25);
    ctx.fillText( text, canvas.width / 2 - textObj.width / 2, canvas.height / 2 + 25);
    ctx.font = '30px Arial';
    const desc = 'Click/tab screen to Start a New Game';
    const descObj = ctx.measureText(desc);
    ctx.fillText( desc, canvas.width / 2 - descObj.width / 2, canvas.height / 2 + 70);
    ctx.restore();
  };
};

LMS_GameRenderer.prototype.draw = function( tFrame, canvas, ctx, control, model ) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const prop in model.shapeObjects) {
    if (model.shapeObjects.hasOwnProperty(prop)) {
      model.shapeObjects[prop].sort((a, b) =>{
        const renderingIdxA = a.renderingIdx || 0;
        const renderingIdxB = b.renderingIdx || 0;
        return renderingIdxB - renderingIdxA;
      }).forEach(( viewObj ) => {
        viewObj.draw( tFrame, ctx, canvas );
      });
    }
  }
  if ( control.pause ) {
    this.drawPauseScreen( canvas, ctx );
  }
  if ( control.gameOver ) {
    this.drawGameOverScreen( canvas, ctx );
  }
  if ( model.fpsObj ) {
    model.fpsObj.draw(tFrame, ctx, canvas);
  }
};

exports.LMS_GameRenderer = LMS_GameRenderer;
