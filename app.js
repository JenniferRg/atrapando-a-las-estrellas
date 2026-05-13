document.addEventListener('DOMContentLoaded', () => {

  const car = document.getElementById('car')
  const game = document.querySelector('.game')

  const scoreDisplay = document.getElementById('score')
  const timeDisplay = document.getElementById('time')
  const levelDisplay = document.getElementById('level')

  const starSound = document.getElementById('starSound')
  const boomSound = document.getElementById('boom')

  const startScreen = document.getElementById('startScreen')
  const startBtn = document.getElementById('startBtn')
  const container = document.querySelector('.container')

  let carX = 125
  let score = 0
  let time = 30
  let level = 1
  let gameOver = false

  let starInterval, obstacleInterval, roadInterval

  const lanes = [25, 125, 225]

  // ocultar juego al inicio
  container.style.display = 'none'

  // 🚗 movimiento
  document.addEventListener('keydown', (e) => {
    if (gameOver) return

    if (e.key === 'ArrowLeft' && carX > 25) {
      carX -= 100
    }

    if (e.key === 'ArrowRight' && carX < 225) {
      carX += 100
    }

    car.style.left = carX + 'px'
  })

  // ⭐ estrellas
  function createStar() {
    if (gameOver) return

    const star = document.createElement('div')
    star.classList.add('star')

    let lane = lanes[Math.floor(Math.random() * lanes.length)]
    star.style.left = lane + 'px'
    star.style.top = '0px'

    game.appendChild(star)

    let fall = setInterval(() => {
      let top = parseInt(star.style.top)
      star.style.top = top + (2 + level) + 'px'

      if (!gameOver && top > 400 && lane === carX) {
        score++
        scoreDisplay.textContent = score

        starSound.currentTime = 0
        starSound.play()

        star.remove()
        clearInterval(fall)

        checkLevel()
      }

      if (top > 500) {
        star.remove()
        clearInterval(fall)
      }

    }, 30)
  }

  // 🚧 obstáculos
  function createObstacle() {
    if (gameOver) return

    const obs = document.createElement('div')
    obs.classList.add('obstacle')

    let lane = lanes[Math.floor(Math.random() * lanes.length)]
    obs.style.left = lane + 'px'
    obs.style.top = '0px'

    game.appendChild(obs)

    let fall = setInterval(() => {
      let top = parseInt(obs.style.top)
      obs.style.top = top + (3 + level) + 'px'

      if (!gameOver && top > 400 && lane === carX) {

        let carRect = car.getBoundingClientRect()
        let gameRect = game.getBoundingClientRect()

        let x = carRect.left - gameRect.left
        let y = carRect.top - gameRect.top

        createExplosion(x, y)

        boomSound.currentTime = 0
        boomSound.play()

        clearInterval(fall)

        setTimeout(() => {
          endGame()
        }, 400)
      }

      if (top > 500) {
        obs.remove()
        clearInterval(fall)
      }

    }, 30)
  }

  // 💥 explosión
  function createExplosion(x, y) {
    const explosion = document.createElement('div')
    explosion.classList.add('explosion')

    explosion.style.left = x + 'px'
    explosion.style.top = y + 'px'

    game.appendChild(explosion)

    setTimeout(() => {
      explosion.remove()
    }, 500)
  }

  // 🛣️ líneas
  function createRoadLine() {
    if (gameOver) return

    const line = document.createElement('div')
    line.classList.add('road-line')

    line.style.top = '0px'
    game.appendChild(line)

    let move = setInterval(() => {
      let top = parseInt(line.style.top)
      line.style.top = top + (4 + level) + 'px'

      if (top > 500) {
        line.remove()
        clearInterval(move)
      }

    }, 30)
  }

  // 📈 niveles
  function checkLevel() {
    if (score === 5 || score === 10 || score === 20) {
      level++
      levelDisplay.textContent = level
    }
  }

  // ⏱️ timer
  function startTimer() {
    let timer = setInterval(() => {
      if (time > 0) {
        time--
        timeDisplay.textContent = time
      } else {
        clearInterval(timer)
        endGame()
      }
    }, 1000)
  }

  // 🎮 iniciar juego
  function startGame() {
    startScreen.style.display = 'none'
    container.style.display = 'block'

    startTimer()

    starInterval = setInterval(createStar, 1500)
    obstacleInterval = setInterval(createObstacle, 2000)
    roadInterval = setInterval(createRoadLine, 300)
  }

  startBtn.addEventListener('click', startGame)

  // ❌ fin del juego
  function endGame() {
    gameOver = true

    clearInterval(starInterval)
    clearInterval(obstacleInterval)
    clearInterval(roadInterval)

    document.body.innerHTML = `
      <div class="end-screen">
        <h1>💥 Fin del juego</h1>
        <h2>Puntaje final: ${score}</h2>
        <h2>Nivel alcanzado: ${level}</h2>
        <button id="restartBtn">🔄 Reiniciar</button>
      </div>
    `

    document.getElementById('restartBtn').addEventListener('click', () => {
      location.reload()
    })
  }

})