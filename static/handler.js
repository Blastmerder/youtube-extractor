let urls = [];
let all_data = [];

const spiner = `
<div class="d-flex justify-content-center" id="spiner">
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>
</div>
`;

const dropdonw_base = `
<div class="dropdown">
<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
  Dropdown button
</button>
<ul class="dropdown-menu">
  <li><a class="dropdown-item" href="#">Action</a></li>
</ul>
</div>
`;

const options = `
<option selected>Open this select menu</option>
<option value="1">One</option>
<option value="2">Two</option>
<option value="3">Three</option>
`;

const precard = `
<div class="card" aria-hidden="true" style = "width: 18rem;">
<svg class="bd-placeholder-img card-img-top" width="100%" height="180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect></svg>
<div class="card-body">
  <div class="h5 card-title placeholder-glow">
    <span class="placeholder col-6"></span>
  </div>
  <p class="card-text placeholder-glow">
    <span class="placeholder col-7"></span>
    <span class="placeholder col-4"></span>
    <span class="placeholder col-4"></span>
    <span class="placeholder col-6"></span>
    <span class="placeholder col-8"></span>
  </p>
  <a class="btn btn-danger disabled placeholder col-4" aria-disabled="true"></a>
  <a class="btn btn-secondary disabled placeholder col-3" aria-disabled="true"></a>
  <a class="btn btn-primary disabled placeholder col-4" aria-disabled="true"></a>
</div>
</div>`;


async function getValue() {
    let url = document.getElementById("url");
    if (url != null){
        let request = {
        URL: url.value
    };
    let button = document.getElementById("download_button");
    if (button){
        button.remove()
    }

    document.body.insertAdjacentHTML('beforeend', spiner);

    let response = await fetch(`/get_names_songs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
    });
    let json = await response.json();
    console.log(json)
    preload(json.length)

    let request1 = {
        Names: json
    };

    let response1 = await fetch(`/get_urls_songs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request1)
    });
    let json1 = await response1.json();

    urls = []
    all_data = json1;

    json1.forEach(function(item, i, json1) {
        urls.push(item.slice(-1)[0])
      });

    
    draw_cards();

    }
    
}

function preload(count){
    id_element = "video"
    var videoContainer = document.getElementById(id_element);
    
    if (videoContainer) {
        videoContainer.remove();
    }

    const container = document.createElement("div");
    let classesName = ['container-xxl']
    console.log(count)
    classesName.forEach((ele) => {
        container.classList.add(ele)
    })

    container.id = id_element;
    let allPrecards = `<div class="row row-cols-1 row-cols-md-3 g-4">`;

    for (let i = 0; i < count; i++) {
        allPrecards = `${allPrecards}\n<div class="col">\n${precard}\n</div>`
    }
    allPrecards = `${allPrecards}\n</div>`
    container.innerHTML = allPrecards;

    document.getElementById("body").appendChild(container);
}

function add_url_on_site(url){
    const card = document.createElement('div');
    card.classList.add('card');
    card.style = "width: 18rem;";
    card.id = "download_button";

    // Add the card content
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Download Zip File</h5>
        <p class="card-text">Wait a few seconds for the Zip file to download. We will just make your Zip file the moment you click on the link.</p>
        <a onclick="document.getElementById('download_button').remove()" target="_blank" class="btn btn-secondary">Close</a>
        <a href="download_urls_songs/${url}" target="_blank" class="btn btn-success">Download</a>
      </div>
    `;

    const container = document.createElement("div");
    let classesName = ['container-xxl']

    classesName.forEach((ele) => {
        container.classList.add(ele)
    })

    container.id = "video";
    container.appendChild(card)

    document.getElementById("body").appendChild(container);
    
}

async function downloadSongs(){
    if (urls){
        spiner = `
        <div class="d-flex justify-content-center" id="spiner">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        </div>
        `;
        
        list_urls = []
        urls.forEach(function(item, i, urls) {
            list_urls.push(String(item["URL"]))
        });

        urls = []
        draw_cards()
        document.body.insertAdjacentHTML('beforeend', spiner);

        let request = {
            "URLs": list_urls
        }
        let response2 = await fetch(`/download_urls_songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(request)
        });

        var spiner = document.getElementById("spiner");
        if (spiner){
            spiner.remove()
        }
        
        let url = await response2.json()
        add_url_on_site(url)
    }
}


function draw_cards(){
    let id_element = "video"
    var videoContainer = document.getElementById(id_element);
    
    var spiner = document.getElementById("spiner");
    if (videoContainer) {
        videoContainer.remove();
    }
    if (spiner){
        spiner.remove()
    }

    const container = document.createElement("div");
    let classesName = ['container-xxl']

    classesName.forEach((ele) => {
        container.classList.add(ele)
    })

    container.id = id_element;

    let tmp_cards = ``;
    
    urls.forEach(function(item, i, urls) {
        let card = add_video_card(item, "video", i)
        tmp_cards = `${tmp_cards}\n<div class="col">\n${card.outerHTML}\n</div>`

      });

    container.innerHTML = `
    <div class="row row-cols-1 row-cols-md-3 g-4" id="cards">
      ${tmp_cards}
      <div class="col" id="plus">
        <button type="button" class="btn btn-secondary" onclick="ShowFormVideo()">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
        </button>
      </div>
    </div>
  `;

    document.getElementById("body").appendChild(container);

    /*
    const card = document.createElement('div');
    card.classList.add('card');
    card.style = "width: 18rem;";
    card.id = "song_url";*/
}

function removeById(id){
    let list = [];
    urls.forEach(function(item, i, urls) {
        if (i != id){
            list.push(item);
        }
    });
    urls = list;
    draw_cards();
}

function add_video_card(video_inf, id_element, id){
    var url_video = video_inf["URL"];
    var preview = video_inf["preview"];
    var similarity = video_inf["own_similarity"];
    var author = video_inf["author"];

    let border_color = "border-success";

    if (similarity >= 50){
        border_color = "border-success";
    } else{
        border_color = "border-danger";
    }

    const card = document.createElement('div');
    card.classList.add('card');
    card.style = "width: 18rem;"

    card.classList.add(border_color)

    // Add the card content
    card.innerHTML = `
      <img src="${preview}" class="card-img-top img-thumbnail" alt="...">
      <div class="card-body">
        <h5 class="card-title">${video_inf["title"]}</h5>
        <table class="table">
            <tbody>
                <tr>
                <th scope="row">similarity</th>
                <td>${similarity}</td>
                </tr>
                <tr>
                <th scope="row">author</th>
                <td>${author}</td>
                </tr>
            </tbody>
        </table>
        <a onclick="removeById(${id})" class="btn btn-danger">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
      </svg> Del</a>
        <a href="${url_video}" target="_blank" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
            </svg> YT
        </a>
        <button type="button" onclick="fillModalData(${id})" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#settings_card">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sliders2" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
        </svg>
         Settings</button>
      </div>
    `;

    return card
/*
    // Находим элемент на странице, где будет размещено видео
    var videoContainer = document.getElementById(id_element);

    // Добавляем iframe с видео в контейнер
    videoContainer.appendChild(card);*/
}

function fillModalData(id){
    let model = document.getElementById("selected_url");
    document.getElementById("card_id").innerText = id;
    
    all_data[id].forEach(function(item, i, urls) {
        const option = document.createElement("option");
        option.setAttribute("value", i) 
        option.innerText = item["title"];
        if (item["title"] == urls[id]["title"]){
            option.selected = true;
        }

        model.appendChild(option)
    });
    
}

function SaveChanges(){
    let model = document.getElementById("selected_url")
    id = document.getElementById("card_id").innerText

    let list = [];
    urls.forEach(function(item, i, urls) {
        if (i != id){
            list.push(item);
        }
        else{
            list.push(all_data[id][model.value])
        }
    });
    urls = list;
    draw_cards();
}

function ShowFormVideo(){
    conteiner = document.getElementById("cards");
    plus = document.getElementById("plus");

    const column = document.createElement('div');

    column.style = "width: 18rem;"
    classes = ['card', 'border-primary', 'mb-3']
    column.classList.add('col');
    
    column.innerHTML = `
    <div class="card border-primary mb-3" style="max-width: 18rem;">
        <div class="card-header">Add User Song URL</div>
        <div class="card-body text-primary">
        <label for="song_url" class="visually-hidden">https://www.youtube.com/</label>
        <input type="url" class="form-control" id="song_url" placeholder="https://www.youtube.com/">
        <a onclick="draw_cards()" class="btn btn-secondary">Cancel</a>
        <a onclick="AddCard()" class="btn btn-primary">conf</a>
    </div>
    `;
    if (conteiner){
        conteiner.appendChild(column)
    }
    if (plus){
        plus.remove()
    }
}

async function AddCard(){
    let url = document.getElementById("song_url");
    if (url != null){
        let request = {
        URL: url.value
    };

    let response = await fetch(`/get_inf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(request)
    });
    let inf = await response.json();
    urls.push(inf)
    all_data.push([inf])
    draw_cards(0);
}
}