let totalPages = 1
let page = 1
document.addEventListener("DOMContentLoaded", () => {
  const createDiv = document.getElementById("create-monster")
  createDiv.addEventListener("submit", postMonster)
  const pageSelector = document.getElementById('pageSelector')
  pageSelector.addEventListener('change', event => {
    getMonstersByPage(event.target.value)
    page = +event.target.value
  })

  getMonsters(page, totalPages, 0)
  document
    .getElementById("forward")
    .addEventListener("click", () => page = getMonsters(page, totalPages, 1))
  document
    .getElementById("back")
    .addEventListener("click", () => page = getMonsters(page, totalPages, -1))
})

function getMonsters(pageNum, maxPages, direction) {
  if (pageNum + direction >= 1 && pageNum + direction <= maxPages) {
    fetch(
      `http://localhost:3000/monsters/?_limit=50&_page=${pageNum + direction}`,
    )
      .then((resp) => {
        getPages(Math.ceil(resp.headers.get("x-total-count") / 50))
        const pageSelector = document.getElementById('pageSelector')
        pageSelector.value = pageNum + direction
        return resp.json()
      })
      .then(appendMonsters)
    return pageNum + direction
  } else {
    return pageNum
  }
}

function appendMonsters(monsterData) {
  //totalPages = monsterData.pages
  const containerDiv = document.getElementById("monster-container")
  const monsterRows = []

  monsterData.forEach((monster) => {
    const newRow = document.createElement("tr")
    const rowContent = (info) => {
      const tblData = document.createElement("td")
      if (info === "age") {
        tblData.textContent = monster[info].toFixed(2)
      } else {
        tblData.textContent = monster[info]
      }
      return tblData
    }
    newRow.appendChild(rowContent("id"))
    newRow.appendChild(rowContent("name"))
    newRow.appendChild(rowContent("age"))
    newRow.appendChild(rowContent("description"))

    monsterRows.push(newRow)
  })

  containerDiv.replaceChildren(
    document.getElementById("tbl-header"),
    ...monsterRows,
  )
}

function createMonster() {
  return {
    name: document.getElementById("formName")["value"],
    age: +document.getElementById("formAge")["value"],
    description: document.getElementById("formDesc")["value"],
  }
}

function postMonster(event) {
  event.preventDefault()

  fetch("http://localhost:3000/monsters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(createMonster()),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      getMonstersByPage(page)})

    event.target.reset()
}

function getPages(allPages) {
  const pageSelector = document.getElementById('pageSelector')
  const pageOptions = []
  for(let i = 1; i <= allPages; i++){
    const pageOption = document.createElement('option')
    pageOption.value = i
    pageOption.textContent = i

    pageOptions.push(pageOption)
  }

  totalPages = allPages
  pageSelector.replaceChildren(...pageOptions)
}

function getMonstersByPage(pageNum) {

  fetch(
      `http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`,
    )
      .then((resp) => {
        getPages(Math.ceil(resp.headers.get("x-total-count") / 50)) 
        document.getElementById('pageSelector').value = pageNum 
        return resp.json()
      })
      .then(appendMonsters)
}