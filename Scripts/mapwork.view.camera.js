/*check existence of mapwork.model in global namespace*/
window.mapwork = mapwork || {};
window.mapwork.view = mapwork.view || {};

window.mapwork.view.Camera = function() {
  'use strict';
  this.x = 0;
  this.y = 0;
  this.width = 0;
  this.height = 0;
  this.maxY = null;
  this.maxX = null;

  this.setupCamera = function(x, y, width, height, maxX, maxY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.maxX = maxX;
    this.maxY = maxY;
  };

  this.getX = function() {
    return this.x;
  };
  this.getY = function() {
    return this.y;
  };
  this.getWidth = function() {
    return this.width;
  };
  this.getHeight = function() {
    return this.height;
  };
  this.getMaxX = function() {
    return this.maxX;
  };
  this.getMaxY = function() {
    return this.maxY;
  };

  this.setX = function(x) {
    this.x = x;
  };
  this.setY = function(y) {
    this.y = y;
  };
  this.setWidth = function(width) {
    this.width = width;
  };
  this.setHeight = function(height) {
    this.height = height;
  };
  this.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    if (x + this.getWidth() > this.getMaxX()) {
      if (this.getMaxX() > this.getWidth()) {
        this.x = this.getMaxX() - this.getWidth();
      } else {
        this.x = 0;
      }
    } else if (x < 0) {
      this.x = 0;
    } else {
      this.x = x;
    }

    if (y + this.getHeight() > this.getMaxY()) {
      if (this.getMaxY() > this.getHeight()) {
        this.y = this.getMaxY() - this.getHeight();
      } else {
        this.y = 0;
      }
    } else if (y < 0) {
      this.y = 0;
    } else {
      this.y = y;
    }
  };
  this.setSize = function(width, height) {
    if (width > mapwork.viewcontroller.mapModel.getWorldWidth()) {
      this.width = mapwork.viewcontroller.mapModel.getWorldWidth();
    } else {
      this.width = width;
    }

    if (height > mapwork.viewcontroller.mapModel.getWorldHeight()) {
      this.height = mapwork.viewcontroller.mapModel.getWorldHeight();
    } else {
      this.height = height;
    }
  };
  this.setBounds = function(maxX, maxY) {
    this.maxX = maxX;
    this.maxY = maxY;
  };
  this.move = function(direction, amount) {
    if (direction === 'left') {
      if (this.getMaxX() < this.getWidth()) {
        this.setX(0);
      } else if (this.getX() - amount > 0) {
        this.setX(this.getX() - amount);
      } else {
        this.setX(0);
      }
    } else if (direction === 'right') {
      if (this.getMaxX() < this.getWidth()) {
        this.setX(0);
      } else if (this.getX() + this.getWidth() + amount < this.getMaxX()) {
        this.setX(this.getX() + amount);
      } else {
        this.setX(this.getMaxX() - this.getWidth());
      }
    } else if (direction === 'down') {
      if (this.getMaxY() < this.getHeight()) {
        this.setY(0);
      } else if (this.getY() + this.getHeight() + amount < this.getMaxY()) {
        this.setY(this.getY() + amount);
      } else {
        this.setY(this.getMaxY() - this.getHeight());
      }
    } else if (direction === 'up') {
      if (this.getMaxY() < this.getHeight()) {
        this.setY(0);
      } else if (this.getY() - amount > 0) {
        this.setY(this.getY() - amount);
      } else {
        this.setY(0);
      }
    }
  };
};
