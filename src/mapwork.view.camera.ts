export class Camera {
  MapModel: any
  x: number
  y: number
  width: number
  height: number
  maxY: any
  maxX: any
  constructor(MapModel) {
    // injected dependencies
    this.MapModel = MapModel
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.maxY = null
    this.maxX = null
  }
  setupCamera(x, y, width, height, maxX, maxY) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.maxX = maxX
    this.maxY = maxY
  }

  getX() {
    return this.x
  }
  getY() {
    return this.y
  }
  getWidth() {
    return this.width
  }
  getHeight() {
    return this.height
  }
  getMaxX() {
    return this.maxX
  }
  getMaxY() {
    return this.maxY
  }

  setX(x) {
    this.x = x
  }
  setY(y) {
    this.y = y
  }
  setWidth(width) {
    this.width = width
  }
  setHeight(height) {
    this.height = height
  }
  setPosition(x, y) {
    this.x = x
    this.y = y

    if (x + this.getWidth() > this.getMaxX()) {
      if (this.getMaxX() > this.getWidth()) {
        this.x = this.getMaxX() - this.getWidth()
      } else {
        this.x = 0
      }
    } else if (x < 0) {
      this.x = 0
    } else {
      this.x = x
    }

    if (y + this.getHeight() > this.getMaxY()) {
      if (this.getMaxY() > this.getHeight()) {
        this.y = this.getMaxY() - this.getHeight()
      } else {
        this.y = 0
      }
    } else if (y < 0) {
      this.y = 0
    } else {
      this.y = y
    }
  }
  setSize(width, height) {
    if (width > this.MapModel.getWorldWidth()) {
      this.width = this.MapModel.getWorldWidth()
    } else {
      this.width = width
    }

    if (height > this.MapModel.getWorldHeight()) {
      this.height = this.MapModel.getWorldHeight()
    } else {
      this.height = height
    }
  }
  setBounds(maxX, maxY) {
    this.maxX = maxX
    this.maxY = maxY
  }
  move(direction, amount) {
    if (direction === 'left') {
      if (this.getMaxX() < this.getWidth()) {
        this.setX(0)
      } else if (this.getX() - amount > 0) {
        this.setX(this.getX() - amount)
      } else {
        this.setX(0)
      }
    } else if (direction === 'right') {
      if (this.getMaxX() < this.getWidth()) {
        this.setX(0)
      } else if (this.getX() + this.getWidth() + amount < this.getMaxX()) {
        this.setX(this.getX() + amount)
      } else {
        this.setX(this.getMaxX() - this.getWidth())
      }
    } else if (direction === 'down') {
      if (this.getMaxY() < this.getHeight()) {
        this.setY(0)
      } else if (this.getY() + this.getHeight() + amount < this.getMaxY()) {
        this.setY(this.getY() + amount)
      } else {
        this.setY(this.getMaxY() - this.getHeight())
      }
    } else if (direction === 'up') {
      if (this.getMaxY() < this.getHeight()) {
        this.setY(0)
      } else if (this.getY() - amount > 0) {
        this.setY(this.getY() - amount)
      } else {
        this.setY(0)
      }
    }
  }
}
