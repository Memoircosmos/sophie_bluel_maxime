const gallery = document.querySelector(".gallery");
const categoryContainer = document.querySelector(".categories")
const content_gallery_interface = document.querySelector(".gallery_interface")
const openModal = document.querySelector(".openModal")
const firstModal = document.querySelector("#modal")
const secondModal = document.querySelector("#myModal")
const openSecondModal = document.querySelector(".button_add")
const closeModal = document.querySelectorAll(".gallery_close")
const returnIcon = document.querySelector("#arrow-return")
const buttonModifier = document.querySelector("#openModal")
const modal = document.querySelector(".modal")
const modalWorkContainer = document.querySelector(".list_works")
const imagePreview = document.querySelector("#imagePreview")
const fileInput = document.querySelector('#file-upload');
const titleInput = document.querySelector('#title');
const categorySelect = document.querySelector('#category');
const buttonValidate = document.querySelector("#myModal form button[type='submit']")
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
    resetSecondModalFields()
    updateSubmitButton()
    
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
    resetFileInput()
})

let snaps = []
let trash = []

/*méthode qui récupère les works pour la mettre dans la premère modal et qui fait en sorte qu'on puisse les suppr avec l'icone poubelle*/

// Fonction pour récupérer les works et les afficher dans la modale avec l'icône trash
const getWorksModal = async() => {
    try {
        const response = await fetch(api);
        const worksData = await response.json();
        modalWorkContainer.innerHTML = ""; // On s'assure que le conteneur est vide

        worksData.forEach((work) => {
            // Création de l'élément figure pour chaque work
            const figure = document.createElement("figure");
            
            // Création de l'image
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            // Ajout de l'image dans la figure
            figure.appendChild(img);

            // Création de l'icône poubelle
            const trashIcon = document.createElement("i");
            trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");

            // Ajout de l'icône poubelle dans la figure
            figure.appendChild(trashIcon);

            // Ajout de la figure dans le conteneur de la modale
            modalWorkContainer.appendChild(figure);

            // Ajout de l'événement de suppression à l'icône poubelle
            trashIcon.addEventListener("click", () => {
                deleteData(work.id, figure);
            });
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des works", error);
    }
};

// Fonction pour supprimer un work
const deleteData = async (workId, figureElement) => {
    const token = localStorage.getItem('token')
    if (!token){
        alert("Vous n'êtes pas connecté")
        return
    }

    const confirmation = confirm("Êtes vous sur de vouloir supprimer cette image ?")
    if (!confirmation){
        return
    }
    const deleteUrl = `http://localhost:5678/api/works/${workId}`;
    
    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Si authentification requise
            },
        });

        if (response.ok) {
            // Suppression de l'élément figure de l'interface
            figureElement.remove();
        } else {
            console.error("Erreur lors de la suppression du work");
        }
    } catch (error) {
        console.error("Erreur lors de la requête de suppression", error);
    }
};

// Ouverture de la modale lors du clic sur le bouton modifier
buttonModifier.addEventListener("click", () => {
    modal.style.display = "flex";
    content_gallery_interface.style.display = "flex";
    getWorksModal(); // Afficher les works dans la modale
});

//fonction pour afficher la barre noire

const showEditModeBanner = () => {
    const banner = document.querySelector('#edit-mode-banner');
    const token = localStorage.getItem('token');

    if (token) {
        banner.style.display = 'block'; // Affiche la bande si l'utilisateur est connecté
        document.body.style.paddingTop = '60px'; // Évite de masquer le contenu sous la bande
    }
};




//login, verification token + masquer modifier et menu

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    const loginLink = document.querySelector('nav ul li:nth-child(3) a');
    const modifyButton = document.querySelector('#openModal');
    const modifyIcon = document.querySelector('.fa-pen-to-square');

    if (token) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        categoryContainer.style.visibility = "hidden"
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });

        modifyButton.style.display = 'flex';
        modifyIcon.style.display = 'inline-block';
        // Appelez la fonction pour afficher la bande si l'utilisateur est connecté
        showEditModeBanner();
    } else {
        modifyButton.style.display = 'none';
        modifyIcon.style.display = 'none';
        categoryContainer.style.visibility = "visible"
    }
});


//méthode pour insérer catégory dans menu déroulant
const populateCategoryDropdown = async () => {
    try {
        const result = await fetch(apiCategory);
        const categories = await result.json();
        const categorySelect = document.querySelector('#category');
        categorySelect.innerHTML = ''; // On vide le select avant de le remplir
        let option = document.createElement('option');  // Créer une première option vide qui apparait par défaut
        categorySelect.appendChild(option);  // Ajouter la première option au select
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
    }
};

fileInput.addEventListener("change",(event)=>{
    const file = event.target.files[0];
    const ACCEPTEXTENSION = ["png","jpg"]
    const fileName = file.name
    const extension = fileName.split(".").pop().toLowerCase()
    if (file && file.size < 4 * 1024 * 1024 && ACCEPTEXTENSION.includes(extension)){
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.src = e.target.result
            imagePreview.style.display="block"
        }
        reader.readAsDataURL(file)
    }else{
        alert("Erreur lors du chargement de l'image")
    }
    updateSubmitButton();
})

// Fonction pour gérer l'ajout d'images à la galerie
const handleImageUpload = async (event) => {
    event.preventDefault();
    const file = fileInput.files[0];
    const title = titleInput.value;
    const categoryId = categorySelect.value;

    if (!file || !title || !categoryId) {
        alert('Veuillez remplir tous les champs.');
        return;
    }
console.log("categoryId",categoryId)
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId);
    const confirmation = confirm(`Êtes-vous sur de vouloir ajouter ${title}`)
    try {
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            const newWork = await response.json();
            allWorks.push(newWork); // Ajoute la nouvelle image à la liste des travaux
            const figure = creatWorkfigure(newWork);
            gallery.appendChild(figure); // Ajoute la nouvelle image à la galerie
            resetFileInput(); // Réinitialiser le formulaire
            secondModal.style.display = "none"; // Fermer la modale
        } else {
            alert('Erreur lors de l\'ajout de l\'image.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'image', error);
    }
};



// Fonction pour réinitialiser les champs de la seconde modale
const resetSecondModalFields = () => {
    // Réinitialiser le champ de fichier, le titre et la catégorie
    fileInput.value = '';
    titleInput.value = '';
    categorySelect.value = '';

    // Réinitialiser l'aperçu de l'image
    imagePreview.src = '';
    imagePreview.style.display = 'none';

  
};

// Appel de la fonction de réinitialisation lorsque la modale est fermée
closeModal.forEach((btn) => {
    btn.onclick = () => {
        firstModal.style.display = "none";
        secondModal.style.display = "none";
        resetSecondModalFields(); // Réinitialise les champs ici
    }
});

window.onclick = (event) => {
    if (event.target == firstModal) {
        firstModal.style.display = "none";
    } else if (event.target == secondModal) {
        secondModal.style.display = "none";
        resetSecondModalFields(); // Réinitialise les champs ici
    }
};

// Réinitialisation des champs lors du retour à la première modale
returnIcon.addEventListener("click", (event) => {
    event.preventDefault();
    showFirstModal();
    resetSecondModalFields(); // Réinitialise les champs ici
});

//état du bouton par défaut lorsque la page est chargée
document.addEventListener('DOMContentLoaded',() =>{
    updateSubmitButton()
})
// gérer l'état du bouton de soumission "valider"
const updateSubmitButton = () => {
    const title = titleInput.value.trim();
    const categorySelected = categorySelect.selectedIndex > 0; //passe en >= pour inclure objet
    const imageLoaded = fileInput.files.length > 0;

    if (title && categorySelected && imageLoaded){
        buttonValidate.classList.remove("disableButton");
        buttonValidate.classList.add("enableButton");
        buttonValidate.disabled = false;

    }else {
        buttonValidate.classList.remove("enableButton")
        buttonValidate.classList.add("disableButton")
        buttonValidate.disabled = true;
    }
}

document.querySelector('#title').addEventListener('input',updateSubmitButton)
categorySelect.addEventListener('change',updateSubmitButton)
fileInput.addEventListener('change',updateSubmitButton)

// Appeler la fonction pour afficher les catégories dans le menu déroulant
populateCategoryDropdown();

// Ajouter un événement sur le formulaire pour gérer l'ajout d'images
document.querySelector('form').addEventListener('submit', handleImageUpload);