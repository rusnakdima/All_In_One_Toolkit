//Блок загружаемый при загрузки документа
(() => {
  if (localStorage['theme'] === undefined) {
    localStorage['theme'] = '';
  }
  document.querySelector("html").setAttribute("class", localStorage['theme']);
})();

//Кнопка открывания меню
const menuBut = document.querySelector("#menuBut");
const menuBack = document.querySelector("#menuBack");
const content = document.querySelector("#content");

menuBut.addEventListener('click', () => {
  menuBack.classList.add("block");
  menuBack.classList.remove("-translate-x-full");
  menuBack.children[0].classList.remove("-translate-x-full");
});

function closeNav(){
  menuBack.classList.remove("block");
  menuBack.classList.add("-translate-x-full");
  menuBack.children[0].classList.add("-translate-x-full");
}

document.addEventListener('click', (event) => {
  if(event.target.parentElement != null){
    if(event.target.id != "menuBut" && event.target.parentElement.id != "menuBut"){
      closeNav();
    }
  } else {
    closeNav();
  }
});

const ancAll = document.querySelectorAll("#menuBack a");
ancAll.forEach(item => {
  item.addEventListener('click', () => {
    closeNav();
  });
});

//Кнопки переключения темы
const lightBut = document.querySelector('#light');
const darkBut = document.querySelector('#dark');

//Привязка события к кнопке
lightBut.addEventListener('click', () => {
  localStorage['theme'] = 'dark';
  document.querySelector("html").setAttribute("class", localStorage['theme']);
});

//Привязка события к кнопке
darkBut.addEventListener('click', () => {
  localStorage['theme'] = '';
  document.querySelector("html").setAttribute("class", localStorage['theme']);
});
