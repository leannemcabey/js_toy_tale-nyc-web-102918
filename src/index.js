const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!

let allToys = []
const toyCollection = document.querySelector("#toy-collection")

function showToy(toy) {
  toyCollection.innerHTML += `
    <div id="toy-${toy.id}" class="card">
      <h2> ${toy.name} </h2>
      <img src="${toy.image}" class="toy-avatar">
      <p> ${toy.likes} Likes </p>
      <button data-id="${toy.id}" class="like-btn"> Like <3 </button>
    </div>
  `
}

fetch("http://localhost:3000/toys")
.then( result => result.json() )
.then( parsedResult => {
  allToys = parsedResult
  allToys.forEach( toy => showToy(toy))
})

document.body.addEventListener("submit", event => {
  event.preventDefault()
  const nameValue = document.getElementsByName("name")[0].value
  const imageValue = document.getElementsByName("image")[0].value

  document.querySelector(".add-toy-form").reset()
  toyForm.style.display = 'none'

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": `${nameValue}`,
      "image": `${imageValue}`,
      "likes": 0
    })
  })
  .then( result => result.json() )
  .then( parsedResult => {
    showToy(parsedResult)
    allToys.push(parsedResult)
  })
})

document.body.addEventListener("click", event => {
  if (event.target.className === "like-btn") {
    const toyId = event.target.dataset.id
    const toyObject = allToys.find( toy => toy.id == toyId)
    const toyElement = document.querySelector(`#toy-${toyId}`)

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": `${++toyObject.likes}`
      })
    })
    .then( result => result.json() )
    .then( parsedResult => {
      toyElement.innerHTML = `
        <h2> ${parsedResult.name} </h2>
        <img src="${parsedResult.image}" class="toy-avatar">
        <p> ${parsedResult.likes} Likes </p>
        <button data-id="${parsedResult.id}" class="like-btn"> Like <3 </button>
      `
    })
  }
})
