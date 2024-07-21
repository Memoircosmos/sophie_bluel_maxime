const gallery = document.querySelector(".gallery");
const categoryContainer = document.querySelector(".categories")
const content_gallery_interface = document.querySelector(".gallery_interface")
const openModal = document.querySelector(".openModal")
const addWorksSecondModal = document.querySelector(".button_add")
const firstModal = document.querySelector("#modal")
const secondModal = document.querySelector("#myModal")
const openSecondModal = document.querySelector(".button_add")
const closeModal = document.querySelectorAll(".gallery_close")
const returnIcon = document.querySelector("#arrow-return")
const buttonModifier = document.querySelector("#openModal")
const modal =document.querySelector(".modal")
/*création fonction pour appeler api pour retourner works*/

let allWorks = []; /*création initialisation tableau*/

const api = 'http://localhost:5678/api/works';
const getWorks = async () => {
    try {
        const result = await fetch(`${api}`)
        const data = await result.json()
        allWorks.length = 0 /*on s'assure que le tableau est vide avant de lui assigner data*/
        allWorks = data
        console.log("l'ensemble des works est ",allWorks)
        for(let work of allWorks) { /*boucle qui crée(=itère) creatWorkfigure pour chaque élèments du tableau*/
           const figure = creatWorkfigure(work) /*création balise figure à partir d'un works*/
           gallery.appendChild(figure)
        }
    } catch (error) {
        console.error(error)
    }

}

getWorks()

/*méthode qui crée une balise figure avec une balise image et qui insère une balise figure caption*/
const creatWorkfigure = (work) => {
    const figure = document.createElement("figure") /*crée div figure*/
    const image = document.createElement("img") /*cré div img*/
    image.src = work.imageUrl;
    image.alt = work.title;
    figure.appendChild(image) /*ajoute élèment enfant image dans élèment parent figure*/
    const figureCaption = document.createElement("figcaption") /*alt*/
    figureCaption.innerHTML = work.title;
    figure.appendChild(figureCaption)
    return figure;
}

const apiCategory = "http://localhost:5678/api/categories"
let allCategories = []
const getCategory = async () => {
try {
    const result = await fetch(`${apiCategory}`)
    const data = await result.json()
    allCategories = data
    allCategories.unshift({ /*ajout id tous pour filtre*/
        id : 0,
        name : "Tous"
    })
    populateCategories(allCategories)
    console.log(allCategories)
}catch (error) {
    console.error(error)
}

}
getCategory()

const populateCategories = (categories) => {
categoryContainer.innerHTML = "";
categories.forEach(category => {
    const button = createCategoryButton(category) /*créer balise button et ajouter les classes*/
    categoryContainer.appendChild(button)
    /*setupCategoryFilter(button,category.id)*/    /*méthode qui ajoute filtre de catégorie*/
});
}

const createCategoryButton = (category) => {
    const button = document.createElement("button")
    button.classList.add("work-filter", "filters-design") /*créer classe pour les boutons*/
    if (category.id === 0){
        button.classList.add("filter-active", "filter-all") /*applique les classes sur le bouton actif */

    }

    button.setAttribute("data-filter", category.id)
    button.innerHTML = category.name
    return button
}

const filterWorkByCategory = (categoryId) => {
gallery.innerHTML = "" ; /*on s'assure que la gallery est vide au départ*/
if (categoryId === 0){ /* pour chaque work de allWorks, on crée la balise figure et on met dans la gallery. Si id de la category du work = 0 alors on le mets dans la gallery*/
    for(let work of allWorks){
        const figure = creatWorkfigure(work)
        gallery.appendChild(figure)
    }
}else{
const filteredWorks = allWorks.filter((work)=>work.categoryId === categoryId) /* cette méthode = filtre*/
    for(let work of filteredWorks){
        const figure = creatWorkfigure(work)
        gallery.appendChild(figure)
}
}

}

categoryContainer.addEventListener("click",(event) => {                              /*quand je click sur le bouton, appel la méthode categoryContainer pour trier*/
const buttons = document.querySelectorAll(".categories button")     /*on va chercher les button contenus dans la div de classe categories*/
if (event.target.getAttribute("data-filter")){
    buttons.forEach((button) => button.classList.remove("filter-active"))   /*si y'a un bouton qui est sélectionné, on le dé-sélectionne en lui enlevant la classe filter-active*/
    const categoryId = parseInt(event.target.getAttribute("data-filter")) /*fait en sorte que data-filter qui est en string apparaisse en nombre ou en chiffre*/
    event.target.classList.add("filter-active")
    filterWorkByCategory(categoryId)
}

})

openSecondModal.onclick = () => {
    firstModal.style.display = "none"
    secondModal.style.display = "block"
    resetFileInput() /*réinitialiser le champ input file*/ 
    selectCategory()
    updateSubmitButtonState()
    
}

closeModal.forEach((btn) =>{
    btn.onclick = () => {
        firstModal.style.display = "none"
        secondModal.style.display = "none"
    }
} ) 


window.onclick = (event) => {/*on ferme les 2 modales quand on click à l'extérieure*/
if(event.target == firstModal){
    firstModal.style.display = "none"
}else if(event.target == secondModal) {
    secondModal.style.display = "none"
}
}

/*Méthode pour faire apparaitre la première modale*/ 

const showFirstModal = () => {
    firstModal.style.display = "flex"
    secondModal.style.display = "none"
}

returnIcon.addEventListener("click",(event) => {
    event.preventDefault()
    showFirstModal()
})

buttonModifier.addEventListener("click",()=>{
    modal.style.display = "flex"
    content_gallery_interface.style.display = "flex"
} )