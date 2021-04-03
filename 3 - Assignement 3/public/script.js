//VARIABLES DEFINITION

const apiKey="dbe3286ef3754814bfd21bcd7e768db6"

var movie = document.getElementById("quiz");
var head = document.getElementById("top");

var question = 1;
var list_people=[];
var answers1=[];
var list_movies=[];
var answers2=["toy story"];
var j=0;
var key_search="key-search".concat(j);
var key_search2 = "key-search2".concat(j);
var score = 0;
var fail = 0;

let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;

//RULES

window.alert("Welcome to the MovieQuiz ! 😇 You will have to guess either an actor/director name or movie title. If you give a right answer within 3 chances, you gain 1 point but if you use more guesses, than you don't win any point. Don't worry, you can't lose any point that you already have 😉");

//INITIALIZATION

let getConfig = function () {
	let url = "".concat(baseURL, 'configuration?api_key=', apiKey, "&language=fr-FR"); 
	fetch(url)
	.then((result)=>{
		return result.json();
	})
	.then((data)=>{
		baseImageURL = data.images.secure_base_url;
		configData = data.images;
		runSearchMovie('Toy Story')
	})
	.catch(function(err){
		alert(err);
	});
}

//MOVIE SEARCH

let runSearchMovie = function (keyword) {
	let url = ''.concat(baseURL, 'search/movie?api_key=', apiKey, '&query=', keyword, "&language=fr-FR");
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		movie.innerHTML += "<p><strong> Question " + question + "</strong></p>";
		question += 1;
		movie.innerHTML += "<br> Title : <strong>" + data["results"][0]["original_title"] + "</strong>";
		movie.innerHTML += "<br> Release date : <strong>" + data["results"][0]["release_date"] + "</strong>";
		poster = `https://image.tmdb.org/t/p/w500/${data["results"][0]["poster_path"]}`
		movie.innerHTML += "<br> <br> <img style='border:4px solid;' src = " + poster + " width='200' height='300' />";
		movie.innerHTML += "<br><br> <input type='search' id='" + key_search.concat(j) + "' placeholder='Enter director/actor name...'>"
		movie.innerHTML += "<br> <br> <input type='button' onclick='search()' value='Submit'></button> ";
		// var f = document.getElementById("form");
		// f.submit(function(e){e.preventDefault()})
		id = data["results"][0]["id"];
		runCredits(id);   
	})
}

//CREDITS SEARCH TO GET ACTORS AND DIRECTORS

let runCredits = function (id) {
	let url = ''.concat(baseURL, 'movie/', id, '/credits?api_key=', apiKey, "&language=fr-FR");
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		for(i = 0; i < data["cast"].length; i++) { list_people.push(data["cast"][i]["name"].toLowerCase());}
		for(i = 0; i < data["crew"].length; i++) {list_people.push([data["crew"][i]["name"]][0].toLowerCase());}
	})
}

//PERSON NAME SEARCH TO GET ITS ID

let runName = function (name) {
	let url = ''.concat(baseURL, 'search/person?api_key=', apiKey, '&query=', name, "&language=fr-FR");
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		cast_id = data["results"][0]["id"];
		runSearchCast(cast_id);
	})
}

//PERSON INFO SEARCH

let runSearchCast = function (id) {
	let url = ''.concat(baseURL, 'person/', id, '?api_key=', apiKey, "&language=fr-FR");
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		movie.innerHTML += "<p><strong> Question " + question + "</strong></p>";
		question += 1;
		movie.innerHTML += "<br>" + data["name"];
		pic = `https://image.tmdb.org/t/p/w500/${data["profile_path"]}`
		movie.innerHTML += "<br> <br> <img style='border:4px solid;' src = " + pic + " width='200' height='300' />";
		movie.innerHTML += "<br><br> <input type='search' id='" + key_search2.concat(j) + "' placeholder='Enter movie name...'>";
		movie.innerHTML += "<br> <br> <input type='button' onclick='search2()' value='Submit'></button>";
		runMovies(id);
	})
}

//MOVIES IN WHICH A PERSON WORKED IN

let runMovies = function (id) {
	let url = ''.concat(baseURL, '/person/', id, '/combined_credits?api_key=', apiKey, "&language=fr-FR");
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		for(i = 0; i < data["cast"].length; i++) { if([data["cast"][i]["title"]][0] != undefined) { list_movies.push([data["cast"][i]["title"]][0].toLowerCase());}}
	console.log(list_movies);
	})
}

//CHECK IF ELEMENT IN LIST

function findValueInList(value,list){
  var result = false;
  for(var i=0; i<list.length; i++){
    var el = list[i];
    if(el == value){
      result = true;
      break;
    }
  }

  return result;
}

//ANSWERS ON PERSON SEARCH

function search(){
	var answer = document.getElementById(key_search.concat(j)).value;
	if (findValueInList(answer.toLowerCase(),list_people)){
		if(findValueInList(answer.toLowerCase(),answers1) == false){
			answers1.push(answer.toLowerCase());		
			movie.innerHTML += "<br><br><p style='color:green'> <u>Success !</u> " + answer.toUpperCase() + " is indeed part of this movie :) <br><br></p>";
			score += 1;
			head.innerHTML = "<p style='font-size: 26px;'> Your score : " + score + "</p>";
			list_people = [];
			runName(answer.toLowerCase());
		}
		else {
			movie.innerHTML += "<br><br> <p style='color:navy'> You already played with this actor/director before ! Try <u>another</u> name </p><br>";
		}
	}
	else { 
		movie.innerHTML += "<br><br><p style='color:red'> <u>Failure !</u> " + answer.toUpperCase() + " is not part of this movie :( Try again ! </p>";
		fail += 1;
		if(fail > 3 & fail <=4) { score = score - 1 };
		}
	if (fail > 4) { fail = 0; }
	return false;
}

//ANSWERS ON MOVIE SEARCH

function search2(){
	var answer2 = document.getElementById(key_search2.concat(j)).value;
	if (findValueInList(answer2.toLowerCase(),list_movies)){
		if(findValueInList(answer2.toLowerCase(),answers2) == false){
			answers2 += answer2.toLowerCase();
			movie.innerHTML += "<br><br><p style='color:green'> <u>Success !</u> He/She is indeed part of " + answer2.toUpperCase() + " :) <br><br></p>";
			score += 1;
			head.innerHTML = "<p style='font-size: 26px;'> Your score : " + score + "</p>";
			list_people = [];
			runSearchMovie(answer2.toLowerCase());
			j+=1;
		}
		else {
			movie.innerHTML += "<br><br> <p style='color:navy'> You already played with this movie before ! Try <u>another</u> name </p> <br>";
		}
	}
	else { 
		movie.innerHTML += "<br><br><p style='color:red'> <u>Failure !</u> He/She is not part of " + answer2.toUpperCase() + " :( Try again ! </p>";
		fail += 1;
		if(fail > 3 & fail <=4) { score = score - 1 };
		}
	if (fail > 4) { fail = 0; }
	return false;
}

document.addEventListener('DOMContentLoaded', getConfig);
		

