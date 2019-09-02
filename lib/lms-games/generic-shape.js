/* eslint-disable camelcase */
/**
 * Library for basic units
 all generic units will need  LMS_   prefix so we can reuse in other games
 all shapes should will a prototype.draw( ctx, canvas )
 */

/**
 *  should start using this more often
 * @param  {number} x
 * @param  {number} y
*/
function Coordinate(x, y) {
  this.x = x;
  this.y = y;
}

/**
 * LMS_CollisionObject Object
 * @param  {string} shapeType  - 'circle'|'rectangle'
 * @param  {object} shape
 */
function LMS_CollisionObject(shapeType, shape) {
  const shapeSelf = this;
  switch (shapeType) {
    case 'rectangle':
      this.hitBox = {
        shapeType,
        shape,
        get x() {
          return shapeSelf.x + (shape.offsetX || 0);
        },
        get y() {
          return shapeSelf.y + (shape.offsetY || 0);
        },
      };
      break;
  }

}

/**
* LMS_Text object
* @param {object} options
*/
function LMS_Text( options) {
  const {text, x, y, font, color, align} = options || {};
  this.text = '';
  this.x = x;
  this.y = y;
  this.font = font;
  this.text = text;
  this.color = color;
  this.align = align || 'center';
}
LMS_Text.prototype.draw = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.font = this.font;
  let deltaX = 0;
  const textObj = ctx.measureText(this.text);
  if (this.align == 'center') {
    deltaX = -1 * textObj.width/2;
  }
  ctx.fillStyle = this.color;
  ctx.fillText(this.text, this.x + deltaX, this.y);
  ctx.restore();
};
/**
* LMS_HpBar object
* @param {object} options
*/
function LMS_HpBar( options ) {
  const {x, y, width, height, bgColor, borderColor, hpColor, hp, borderWidth} = options;
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
  this.bgColor = bgColor;
  this.borderColor = borderColor;
  this.hpColor = hpColor;
  this.hp = hp;
  this.borderWidth = borderWidth;
  this.animating = false;
  this.nextUpdateHp = this.hp;
  this.newHp = this.hp;
  this.animationMaxStep = 20;
  this.animationStep = 0;
  this.animationTimeFrame = 100; // milisecond per step;
  this.animationStart = 0;
  this.hpStep = 0;
  this.startHp = this.hp;
  // console.log('this.startHp',this.startHp);
  // console.log('this.startHp',this.hp);
  // console.log('this.startHp',this.newHp);
}
LMS_HpBar.prototype.draw = function( tFrame, ctx, canvas ) {
  if ( this.hp != this.newHp ) {
    this.animationStep = 0;
    this.animationStart = tFrame;
    this.hpStep = (this.newHp - this.hp) / this.animationMaxStep;
    this.startHp = this.hp;
    this.hp = this.newHp;
  }
  if ( this.animationStep < this.animationMaxStep ) {
    this.animationStep += Math.floor( (tFrame - this.animationStart) / this.animationTimeFrame );
    this.animationStep = Math.min( this.animationStep, this.animationMaxStep);
  }
  ctx.save();
  // ctx.fillStyle = '#c20000';
  ctx.fillStyle = this.borderColor;
  ctx.fillRect( this.x, this.y, this.width, this.height );
  ctx.fillStyle = this.bgColor;
  ctx.fillRect( this.x + this.borderWidth, this.y +
      this.borderWidth, this.width - 2 * this.borderWidth, this.height - 2 * this.borderWidth);
  ctx.fillStyle = this.hpColor;
  ctx.fillRect( this.x + this.borderWidth, this.y + this.borderWidth,
      (this.width - 2 * this.borderWidth) * ( this.startHp + this.hpStep * this.animationStep ),
      this.height - 2 * this.borderWidth);
  ctx.restore();
};
/**
* LMS_spring
* @param {object} options
*/
function LMS_spring(options) {
  // const {x1, y1, x2, y2, windings, width, offset, col1, col2, lineWidth} = options;
  for ( prop in options) {
    if (options.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
}

LMS_spring.prototype.draw = function( tFrame, ctx, canvas ) {
  let {x1, y1, x2, y2, windings, width, offset, col1, col2, lineWidth} = this;
  const x = x2 - x1;
  const y = y2 - y1;
  const dist = Math.sqrt(x * x + y * y);

  const nx = x / dist;
  const ny = y / dist;
  ctx.save();
  ctx.strokeStyle = col1;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  x1 += nx * offset;
  y1 += ny * offset;
  x2 -= nx * offset;
  y2 -= ny * offset;
  const step = 1 / (windings);
  // for each winding
  for (let i = 0; i <= 1-step; i += step) {
    for (let j = 0; j < 1; j += 0.05) {
      let xx = x1 + x * (i + j * step);
      let yy = y1 + y * (i + j * step);
      xx -= Math.sin(j * Math.PI * 2) * ny * width;
      yy += Math.sin(j * Math.PI * 2) * nx * width;
      ctx.lineTo(xx, yy);
    }
  }
  ctx.lineTo(x2, y2);
  ctx.lineTo(x2 + nx * offset, y2 + ny * offset);
  ctx.stroke();
  ctx.strokeStyle = col2;
  ctx.lineWidth = lineWidth - 4;
  ctx.beginPath();
  ctx.moveTo(x1 - nx * offset, y1 - ny * offset);
  ctx.lineTo(x1, y1);
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 + nx * offset, y2 + ny * offset);
  // for each winding
  for (let i = 0; i <= 1-step; i += step) {
    for (let j = 0.25; j <= 0.76; j += 0.05) {
      let xx = x1 + x * (i + j * step);
      let yy = y1 + y * (i + j * step);
      xx -= Math.sin(j * Math.PI * 2) * ny * width;
      yy += Math.sin(j * Math.PI * 2) * nx * width;
      if (j === 0.25) {
        ctx.moveTo(xx, yy);
      } else {
        ctx.lineTo(xx, yy);
      }
    }
  }
  ctx.stroke();
  ctx.restore();
};
/**
* LMS_spring
* @param {object} options
*/
function LMS_spike(options) {
  // const {x1, y1, x2, y2, windings, width, offset, col1, col2, lineWidth} = options;
  for ( prop in options) {
    if (options.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
}

LMS_spike.prototype.draw = function( tFrame, ctx, canvas ) {
  const {x1, y1, width, spikeLegnth, col1, lineWidth, frequency} = this;
  const base = frequency * 2;
  const offset = 1; // get rid of boundaries bewteen spike and block
  const posY = y1 + offset;
  ctx.save();

  ctx.fillStyle = col1;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);

  for (let i = 1; i <= base; i++) {
    if (i % 2 == 0) {
      ctx.lineTo(x1 + i * width/base, posY);
    } else {
      ctx.lineTo(x1 + i * width/base, posY - spikeLegnth);
    }
  }

  ctx.fill();
  ctx.restore();
};
/**
* heart object
* @param {object} options The first number.
*/
function LMS_heart( options ) {
  // let {x, y, size, color, dy} = options;
  for ( prop in options) {
    if (options.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
  this.r = this.size / 2;
  this.toBeDeleted = false;
}
LMS_heart.prototype.draw = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.fillStyle = this.color;
  const d = this.size;
  const k = 0;
  const deltaX = this.x - d/2;
  const deltaY = this.y - d/2;
  ctx.beginPath();
  ctx.moveTo(k + deltaX, k + d / 4 + deltaY);
  ctx.quadraticCurveTo(k + deltaX, k + deltaY, k + d / 4 + deltaX, k + deltaY);
  ctx.quadraticCurveTo(k + d / 2 + deltaX, k + deltaY, k + d / 2 + deltaX, k + d / 4 + deltaY);
  ctx.quadraticCurveTo(k + d / 2 + deltaX, k + deltaY, k + d * 3/4 + deltaX, k + deltaY);
  ctx.quadraticCurveTo(k + d + deltaX, k + deltaY, k + d + deltaX, k + d / 4 + deltaY);
  ctx.quadraticCurveTo(k + d + deltaX, k + d / 2 + deltaY, k + d * 3/4 + deltaX, k + d * 3/4 + deltaY);
  ctx.lineTo(k + d / 2 + deltaX, k + d + deltaY);
  ctx.lineTo(k + d / 4 + deltaX, k + d * 3/4 + deltaY);
  ctx.quadraticCurveTo(k + deltaX, k + d / 2 + deltaY, k + deltaX, k + d / 4 + deltaY);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};
/**
* coins object
* @param {object} options The first number.
*/
function LMS_coin( options ) {
  // let { x, y, r, r2, dy, thickness, fps } = options;
  let {fps} = options;
  fps = fps || 15;
  for ( prop in options) {
    if (options.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }
  this.frameTick = 1000/fps;
  this.startTFrame = 0;
}
LMS_coin.prototype.draw = function( tFrame, ctx, canvas ) {
  // always start with frame 1
  let frame = 1;
  if ( this.startTFrame == 0 ) {
    this.startTFrame = tFrame;
  } else {
    frame = Math.floor( (tFrame - this.startTFrame) / this.frameTick ) % 6;
  }
  switch ( frame ) {
    case 1:
      this.drawFrame1( tFrame, ctx, canvas );
      break;
    case 2:
      this.drawFrame2( tFrame, ctx, canvas );
      break;
    case 3:
      this.drawFrame3( tFrame, ctx, canvas );
      break;
    case 4:
      this.drawFrame4( tFrame, ctx, canvas );
      break;
    case 5:
      this.drawFrame5( tFrame, ctx, canvas );
      break;
    case 0:
      this.drawFrame6( tFrame, ctx, canvas );
      break;
  }
};
LMS_coin.prototype.drawFrame1 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.fillStyle = 'gold';
  // outer circle
  ctx.beginPath();
  ctx.arc( this.x, this.y, this.r, 0, Math.PI*2, true );
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc( this.x, this.y, this.r2, 0, Math.PI*2, true );
  ctx.fillStyle = '#000';
  ctx.closePath();
  ctx.stroke();
  ctx.resetTransform();
  ctx.restore();
};
LMS_coin.prototype.drawFrame2 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.setTransform(0.75, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'gold';
  const posX = this.x/0.75;
  for ( let i = 0; i < this.thickness / 0.8; i++) {
    ctx.beginPath();
    ctx.arc( posX - i, this.y, this.r, 0, Math.PI*2, true );
    ctx.fill();
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.arc( posX + (this.r - this.r2)/3, this.y, this.r2, 0, Math.PI*2, true );
  ctx.fillStyle = '#000';
  ctx.closePath();
  ctx.stroke();
  ctx.resetTransform();
  ctx.restore();
};
LMS_coin.prototype.drawFrame3 = function( tFrame, ctx, canvas ) {
  ctx.save();
  const posX = this.x/0.25;
  ctx.setTransform(0.25, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'gold';
  for ( let i = 0; i < this.thickness / 0.5; i++) {
    ctx.beginPath();
    ctx.arc( posX - i, this.y, this.r, 0, Math.PI*2, true );
    ctx.fill();
    ctx.closePath();
  }

  ctx.beginPath();
  ctx.arc( posX + (this.r - this.r2), this.y, this.r2, 0, Math.PI*2, true );
  ctx.fillStyle = '#000';
  ctx.closePath();
  ctx.stroke();
  ctx.resetTransform();
  ctx.restore();
};
LMS_coin.prototype.drawFrame4 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.fillStyle = 'gold';
  ctx.beginPath();
  ctx.fillRect(this.x - this.thickness/2, this.y - this.r, this.thickness, this.r * 2);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};
LMS_coin.prototype.drawFrame5 = function( tFrame, ctx, canvas ) {
  ctx.save();
  const posX = this.x/0.25;
  ctx.setTransform(0.25, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'gold';
  for ( let i = 0; i < this.thickness / 0.5; i++) {
    ctx.beginPath();
    ctx.arc( posX + i, this.y, this.r, 0, Math.PI*2, true );
    ctx.fill();
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.arc( posX - (this.r - this.r2), this.y, this.r2, 0, Math.PI*2, true );
  ctx.fillStyle = '#000';
  ctx.closePath();
  ctx.stroke();
  ctx.resetTransform();
  ctx.restore();
};
LMS_coin.prototype.drawFrame6 = function( tFrame, ctx, canvas ) {
  ctx.save();
  const posX = this.x/0.75;
  ctx.setTransform(0.75, 0, 0, 1, 0, 0);
  ctx.fillStyle = 'gold';
  for ( let i = 0; i < this.thickness / 0.8; i++) {
    ctx.beginPath();
    ctx.arc( posX + i, this.y, this.r, 0, Math.PI*2, true );
    ctx.fill();
    ctx.closePath();
  }
  ctx.beginPath();
  ctx.arc( posX - (this.r - this.r2)/3, this.y, this.r2, 0, Math.PI*2, true );
  ctx.fillStyle = '#000';
  ctx.closePath();
  ctx.stroke();
  ctx.resetTransform();
  ctx.restore();
};

/**
* Add two numbers.
* @param {object} options
    options.x , options.y  = top left corner
*/
function LMS_hourglass( options ) {
  const {color, x, y, width, height} = options || {};
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 15;
  this.height = height || 30;

  // eslint-disable-next-line max-len
  const p = `M128.6719 385.875 L29.6719 385.875 L29.6719 378.9844 L35.4375 378.9844 L35.4375 372.9375 Q35.4375 366.6094 38.5312 358.875 Q41.625 351.1406 52.7344 336.2344 Q61.1719 324.9844 63.2812 320.2734 Q65.3906 315.5625 65.3906 312.1875 Q65.3906 308.6719 63.2812 304.0312 Q61.1719 299.3906 52.7344 288 Q41.625 273.0938 38.5312 265.4297 Q35.4375 257.7656 35.4375 251.4375 L35.4375 245.3906 L29.6719 245.3906 L29.6719 238.3594 L128.6719 238.3594 L128.6719 245.3906 L122.9062 245.3906 L122.9062 251.4375 Q122.9062 257.7656 119.8828 265.4297 Q116.8594 273.0938 105.6094 288 Q97.1719 299.3906 95.1328 304.0312 Q93.0938 308.6719 93.0938 312.1875 Q93.0938 315.5625 95.1328 320.2734 Q97.1719 324.9844 105.6094 336.2344 Q116.8594 351.1406 119.8828 358.875 Q122.9062 366.6094 122.9062 372.9375 L122.9062 378.9844 L128.6719 378.9844 L128.6719 385.875 ZM116.0156 251.1562 L116.0156 245.3906 L42.3281 245.3906 L42.3281 251.1562 Q42.3281 256.2188 45.1406 263.1797 Q47.9531 270.1406 61.875 289.125 Q71.4375 291.9375 79.1719 291.9375 Q86.9062 291.9375 96.4688 289.125 Q110.5312 270.1406 113.2734 263.1797 Q116.0156 256.2188 116.0156 251.1562 ZM116.0156 378.9844 L116.0156 373.2188 Q116.0156 367.7344 113.2734 360.9141 Q110.5312 354.0938 100.125 340.0312 Q90.8438 327.5156 88.4531 321.9609 Q86.0625 316.4062 86.0625 312.1875 L86.0625 311.625 Q81.8438 318.7969 79.1719 318.7969 Q76.5 318.7969 72.2812 311.3438 L72.2812 312.1875 Q72.2812 316.4062 69.8906 321.9609 Q67.5 327.5156 58.2188 340.0312 Q47.8125 354.0938 45.0703 360.9141 Q42.3281 367.7344 42.3281 373.2188 L42.3281 378.9844 Q50.625 365.0625 61.1719 354.5859 Q71.7188 344.1094 79.1719 344.1094 Q86.625 344.1094 97.2422 354.5859 Q107.8594 365.0625 116.0156 378.9844 ZM79.1719 323.4375 Q82.125 323.4375 82.125 326.25 Q82.125 329.2031 79.1719 329.2031 Q76.3594 329.2031 76.3594 326.25 Q76.3594 323.4375 79.1719 323.4375 ZM79.1719 333.7031 Q82.125 333.7031 82.125 336.6562 Q82.125 339.4688 79.1719 339.4688 Q76.3594 339.4688 76.3594 336.6562 Q76.3594 333.7031 79.1719 333.7031 Z`;
  this.path = new Path2D(p);
  this.color = color;
}
LMS_hourglass.prototype.draw = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.fillStyle = this.color;
  ctx.translate(-10 + this.x, -70 + this.y);
  // width = 0.4 * 99 = 39.6
  // height = 0.3 * 147.52 = 44.256
  ctx.scale(0.4 * this.width / 39.6, 0.3 * this.height / 44.256);
  ctx.fill(this.path);
  ctx.restore();
};


/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {object} options
      options.x {number}- The top left x coordinate
      options.y {number}- The top left y coordinate
      options.width {number}- width The width of the rectangle
      options.height {number}- The height of the rectangle
      options.radius {number}[radius = 5]- The corner radius; It can also be an object
                                            to specify different radii for corners
                     {Number}[radius.tl = 0] Top left
                     {Number}[radius.tr = 0] Top right
                     {Number}[radius.br = 0] Bottom right
                     {Number}[radius.bl = 0] Bottom left
      options.fill {boolean}[fill = false] Whether to fill the rectangle.
      options.stroke {Boolean} [stroke = true] Whether to stroke the rectangle.
      options.strokeColor {string} [strokeColor = '#fff'] stroke color.
      options.fillColor {string} [fillColor = '#fff'] fill color.
 */
function RoundRect(options) {
  let {x, y, width, height, radius, fill, stroke, strokeColor, fillColor} = options;
  stroke = stroke || true;
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (const side in defaultRadius) {
      if (defaultRadius.hasOwnProperty(side)) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
  }
  this.x = x || 0;
  this.y = y || 0;
  this.width = width || 0;
  this.height = height || 0;
  this.radius = radius || 5;
  this.fill = fill || false;
  this.stroke = stroke || true;
  this.strokeColor = strokeColor || '#fff';
  this.fillColor = fillColor || '#000';
}
RoundRect.prototype.draw = function( tFrame, ctx, canvas ) {
  const {x, y, width, height, radius, fill, stroke} = this;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fillStyle = this.fillColor;
  ctx.strokeStyle = this.strokeColor;
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
};


/**
* coins object
* @param {object} options The first number.
*/
function LMS_collapse( options ) {
  for ( prop in options) {
    if (options.hasOwnProperty(prop)) {
      this[prop] = options[prop];
    }
  }

  this.crackWidth = 5;
  this.totalLength = this.length * this.width;
  this.lineWidth = 1;
}
LMS_collapse.prototype.draw = function( tFrame, ctx, canvas ) {
  this.lineWidth = 0.25 * this.crackWidth;
  if (this.crackPercentage < 0.25) {
    this.drawFrame1( tFrame, ctx, canvas );
  } else if (this.crackPercentage >= 0.25 && this.crackPercentage < 0.5) {
    this.drawFrame1( tFrame, ctx, canvas );
  } else if (this.crackPercentage >= 0.5 && this.crackPercentage < 0.75) {
    this.lineWidth = 0.5 * this.crackWidth;
    this.drawFrame1( tFrame, ctx, canvas );
    this.drawFrame2( tFrame, ctx, canvas );
  } else if (this.crackPercentage >= 0.75 && this.crackPercentage < 0.9) {
    this.drawFrame1( tFrame, ctx, canvas );
    this.drawFrame2( tFrame, ctx, canvas );
  } else {
    this.lineWidth = 20;
    this.drawFrame3( tFrame, ctx, canvas );
  }
};
LMS_collapse.prototype.drawFrame1 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.strokeStyle = '#0f0f0f';
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  for (let i = 0; i <= this.length; i++ ) {
    const defaultPosition = this.x1 + this.totalLength * i / this.length;
    ctx.moveTo(defaultPosition, this.y1);
    ctx.lineTo(defaultPosition + 10, this.y1 + 5);
    ctx.lineTo(defaultPosition + 10 + 5, this.y1 + 5 - 2);
    ctx.lineTo(defaultPosition + 10 + 5 + 5, this.y1 + 5 - 2 + 5);
    ctx.lineTo(defaultPosition + 10 + 5 + 5, this.y1 + 5 - 2 + 5 - 2);
    ctx.lineTo(defaultPosition + 10 + 5 + 5 + 5, this.y1 + 5 - 2 + 5 - 2 + 10);
    ctx.lineTo(defaultPosition + 10 + 5 + 5 + 5 + 3, this.y1 + this.height);
  }
  ctx.stroke();
  ctx.restore();
};

LMS_collapse.prototype.drawFrame2 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.strokeStyle = '#0f0f0f';
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  for (let i = 0; i <= this.length; i++ ) {
    const defaultPosition = this.x1 + this.width / 2 + this.totalLength * i / this.length;
    ctx.moveTo(defaultPosition, this.y1 + this.height);
    ctx.lineTo(defaultPosition - 10, this.y1 + this.height - 4);
    ctx.lineTo(defaultPosition - 10 - 5, this.y1 + this.height - 4 + 3);
    ctx.lineTo(defaultPosition - 10 - 5 - 5, this.y1 + this.height - 4 + 3 - 4);
    ctx.lineTo(defaultPosition - 10 - 5 - 5 - 5, this.y1 + this.height - 4 + 3 - 4 - 8);
  }
  ctx.stroke();
  ctx.restore();
};

LMS_collapse.prototype.drawFrame3 = function( tFrame, ctx, canvas ) {
  ctx.save();
  ctx.strokeStyle = '#0f0f0f';
  ctx.lineWidth = this.lineWidth;
  ctx.beginPath();
  for (let i = 1; i < this.length; i++ ) {
    const defaultPosition = this.x1 + this.totalLength * i / this.length;
    ctx.moveTo(defaultPosition, this.y1);
    ctx.lineTo(defaultPosition + 5, this.y1 + 5);
    ctx.lineTo(defaultPosition, this.y1 + 10);
    ctx.lineTo(defaultPosition + 5, this.y1 + 15);
    ctx.lineTo(defaultPosition, this.y1 + 20);
    ctx.lineTo(defaultPosition + 5, this.y1 + 25);
  }
  ctx.stroke();
  ctx.restore();
};

exports.LMS_hourglass = LMS_hourglass;
exports.LMS_coin = LMS_coin;
exports.LMS_heart = LMS_heart;
exports.LMS_Text = LMS_Text;
exports.LMS_CollisionObject = LMS_CollisionObject;
exports.LMS_HpBar = LMS_HpBar;
exports.LMS_collapse = LMS_collapse;
exports.LMS_spring = LMS_spring;
exports.LMS_spike = LMS_spike;

