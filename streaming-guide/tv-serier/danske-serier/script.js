//TMDB 

const API_KEY = 'api_key=c6c0bb145b8f4b472b1d0358168f5f7c&with_watch_providers=8|337|119|443|70|77|383|118|350|&with_original_language=da&watch_region=DK';
const BASE_URL = 'https://api.themoviedb.org/3';
// ændre movie til tv for tvshows
const API_URL = BASE_URL + '/discover/tv?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/tv?'+API_KEY;
const providerLogo_URL = "https://image.tmdb.org/t/p/w500/";

//genre id api
const genres = [
    {
      "id": 10759,
      "name": "Action & Eventyr"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Komedie"
    },
    {
      "id": 80,
      "name": "Krimi"
    },
    {
      "id": 99,
      "name": "Dokumentar"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familie"
    },
    {
      "id": 10762,
      "name": "Børn"
    },
    {
      "id": 36,
      "name": "Historie"
    },
    {
      "id": 10764,
      "name": "Reality"
    },
    {
      "id": 10402,
      "name": "Musik"
    },
    {
      "id": 9648,
      "name": "Mysterie"
    },
    {
      "id": 10765,
      "name": "Sci-Fi & Fantasy"
    },
    {
      "id": 10767,
      "name": "Talk shows"
    },
    {
      "id": 10766,
      "name": "Soap"
    },
    {
      "id": 10768,
      "name": "Krig"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
//Her kalder vi på de ids fra vores index.html
const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')
//Her har vi indsast variablerne for vores pagination over api'ens sider
var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;
//Genre variablerne samt fuinktionerne som gør at genre knapperne virker
var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
            highlightSelection()
        })
        tagsEl.append(t);
    })
}
//function to highlight genres makes clear button function For at vi har muligheden for mere interaktion med knapperne, har vi her skabt highlights for at fortælle brugeren
//hvilke genre som er aktive. Udover dette har vi også en knap til at ryde alle tryk på genrene.
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

//Henter API URL'en med filmene fra TMDB
getMovies(API_URL);

//Funktion som placerer API'en i hiariket og tager API'ens URL som et parameter.
//fecth api data som gør det om til et json-data format
//Pagination af API'ens data
function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}

//funktion som får api'ens data fra getmovie-funktionen
//Hver film får tildelt en constant variabel som indeholder api data
function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {name, poster_path, vote_average, overview, id} = movie; console.log(movie.name)
        const movieEl = document.createElement('div');
        
        //Provider URL -> Går igen igennem alle ids 
        getProvider(`https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=fde5ddeba3b7dec3fc1f51852ca0fb95`);

        //Viser streamingtjenesternes navn og logo fra api'ens data, og laver dem om til json-format.
          function getProvider(url){

           fetch(url).then(res => res.json()).then(data => {

            
       
            var providerNameDK =  data.results.DK.flatrate[0].provider_name;

            
            var providerLogo =  data.results.DK.flatrate[0].logo_path;

        //Kalder på viarablerne i HTML og skaber vores frontend indhold
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${name}">

            <div class="movie-info">
               
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="tjenester"> 
            <img src="${providerLogo_URL + providerLogo}" class="streamikon" alt="${providerNameDK}">
            </div>

            <div class="overview">

                <h3 class="movietitle">${name}</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
  }
})
}

//Får overlay id fra index.html
//Funktion som får video data fra api'en og laver dem om til json-format
const overlayContent = document.getElementById('overlay-content');
//Åben når der klikkes på knappen
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/tv/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        var embed = [];
        var dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

            dots.push(`
              <span class="dot">${idx + 1}</span>
            `)
          }
        })
        
        var content = `
        <h1 class="no-results">${movie.name}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    }
  })
}

//Lukke overlay med "x"
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

var activeSlide = 0;
var totalVideos = 0;
//Funktion der fjerner forrige traileren når der klikkes på et pilene i overlayet og viser den anden
function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');
  

  totalVideos = embedClasses.length; 
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })


  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })


}

//Laver constant variabel for højre og venstre pil, og herefter skaber condition statements.
const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos()
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})

//Funktionen som ændrer på IMDB scoren (FARVER)
function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}
//Søgebar funktionen
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})
//pagination
prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})
//pagination
next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})
//Paginationen som kalder på API data når man tilgår en ny side  
function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}