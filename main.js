const searchInput = document.querySelector('.searchInput');
const runSerachBtn = document.querySelector('.runSearchBtn');
const itemList = document.querySelector('.itemList');
const favoriteList = document.querySelector('.favoriteList');

let userSearchData = [];
let clicked = false; // eventListener가 중복해서 쌓이는 것을 방지하기 위한 장치.
let srcs = [];
let favorites = [];

runSerachBtn.addEventListener('click', (event) => {
    clicked = false;
    
    if(event.target.matches('.fas')){
        
        userSearchData = [];
        clearItems();
        userSearchData.push(searchInput.value)
        loadItems(userSearchData, itemList);
    }
})


function loadItems(itemArray, toWhere){
    fetch('data.json')
    .then((response) => response.json())
    .then((myData) => myData.data)
    .then((myData) => {

        myData.forEach((e)=> {
            if(itemArray === userSearchData){
                if(e["name"].toLowerCase().includes(itemArray[0].toLowerCase())){
                const li = document.createElement('li');
                li.setAttribute('class', 'itemCard');
                li.innerHTML = `
                    <img class="thumbNail" src=${e.src} alt="${e.name}">
                        <div class="itemNameAndFavBtn">
                            <div class="itemName">${e.name}</div>
                            <button class="favoriteBtn" data-id="${e.name}"><i class="fas fa-heart"></i></button>
                        </div>
                        `
                toWhere.appendChild(li);     
            }
                

        } else if(itemArray === favorites){
            if(e["name"].toLowerCase().includes(itemArray[itemArray.length-1].toLowerCase())){
                console.log('fav')
                const li = document.createElement('li');
                li.setAttribute('class', 'favoriteCard');
                li.setAttribute('data-id', e["name"])
                srcs.push(e.src)
                saveItems();
                li.innerHTML = `
                    <img class="favorThumbNail" src=${e.src} alt="${e.name}">
                            <div class="favoriteName">${e.name}</div>
                            `;
                toWhere.appendChild(li);
            
        }
    
    } 
})
    addFavoriteItem(); 
    }
        
    )}


function saveItems(){
    localStorage.setItem('saveItems', JSON.stringify(favorites))
    localStorage.setItem('srcs', JSON.stringify(srcs))
}

function loadFavorites(){
    if(localStorage.getItem('saveItems')){
    const loadedItems = JSON.parse(localStorage.getItem('saveItems'));
    const loadedSrcs = JSON.parse(localStorage.getItem('srcs'));
    favorites.push(loadedItems);
    srcs.push(loadedSrcs);

    for(let i = 0; i < loadedItems.length; i++){
    const localFavLi = document.createElement('li');
    localFavLi.setAttribute('class', 'favoriteCard');
    localFavLi.setAttribute('data-id', loadedItems[i])
    localFavLi.innerHTML = `
        <img class="favorThumbNail" src=${loadedSrcs[i]} alt="${loadedItems[i]}">
                <div class="favoriteName">${loadedItems[i]}</div>
                `;
    favoriteList.appendChild(localFavLi);
    }
}
}


function clearItems(){
    const allItems = document.querySelectorAll('.itemList li');
    allItems.forEach((e) => {
        e.remove();
    })
}

function addFavoriteItem(){
    const favoriteBtn = document.querySelectorAll('.favoriteBtn')
    favoriteBtn.forEach((e) => {
        if(clicked === false){
        e.addEventListener('click', () => {
            if(e.matches('.favClicked')){
                e.classList.remove('favClicked');
                favorites.splice(favorites.indexOf(e.dataset.id));
                const toBeDelete = document.querySelector(`.favoriteCard[data-id="${e.dataset.id}"]`);
                toBeDelete.remove();
            } else {
                e.classList.add('favClicked')
                favorites.push(e.dataset.id);
                loadItems(favorites, favoriteList);
                saveItems()
            }
                
        })
        }})
        clicked = true;
    }

loadFavorites();












/* ------------------- 배운 것 정리 -------------------------------

1) if 조건으로 함수 작성할때, 앞에서 뒷 조건 자체를 바꾸면 조건식이 이어짐에 유의하자
    ex) if(a === b){
        a = c}
    else if(a === c){
        ~~~}
        js 엔진은 위에서부터 아래로 차례대로 읽으므로, 윗 조건의 내용과 밑 조건의 내용을 이어서 읽어버릴 것이다.

2) 이벤트리스너가 중복해서 등록될때에는 특정 boolean값을 설정해줌으로써 이를 방지하자.
ex) 한번 클릭에 이벤트리스너가 두번, 세번 발동된다면, clicked = false 로 설정후,
이벤트리스너 등록 조건을 clicked === false로 하자, 그리고  
이벤트리스너 등록함수 자체로 들어가 마지막에 clicked = true값을 부여한다면,
이벤트리스너가 한번만 실행되고 그 이후는 clicked trigger에 막혀 실행되지 않을 것이다.

3) 문서 시작에서 let favorites = []라고 선언함. 그런데 중간에 여러 save 과정을 거치다보니,
 화면이 새로고침되면 favorites 는 []이고, 결국 localstroage에 save된 array도 []이 되어버렸다. 
 이걸 계속 유지해줄 방법이 필요했다.

 그래서 웹페이지 불러오자마자 실행되는 loadFavorites()함수 안에, favorites array에 localStroage 내용을
 바로 push해주는 함수를 넣었다.
그 결과, 처음 favorites = [] 이 불러와지자마자, localStroage내용이 push되니까, 계속 save를 이어서 갱신해나갈 수 있었다.

*/