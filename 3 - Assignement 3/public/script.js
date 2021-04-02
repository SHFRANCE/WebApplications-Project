const apiKey="dbe3286ef3754814bfd21bcd7e768db6"

var movie = document.getElementById("quiz");
var head = document.getElementById("top");
var f = document.getElementById("form");

var q = 1;
var list1=[];
var answers1=[];
var list2=[];
var answers2=["toy story"];
var j=0;
var key_search="key-search".concat(j);
var key_search2 = "key-search2".concat(j);
var score = 0;
var fail = 0;

let baseURL = 'https://api.themoviedb.org/3/';
let configData = null;
let baseImageURL = null;

window.alert("Welcome to the MovieQuiz ! 😇 You will have to guess either an actor/director name or movie title. If you give a right answer within 3 chances, you gain 1 point but if you use more guesses, than you lose 1 point. Don't worry, your score can't be negative 😉");

let getConfig = function () {
	let url = "".concat(baseURL, 'configuration?api_key=', apiKey); 
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

let runSearchMovie = function (keyword) {
	let url = ''.concat(baseURL, 'search/movie?api_key=', apiKey, '&query=', keyword);
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		movie.innerHTML += "<p><strong> Question " + q + "</strong></p>";
		q += 1;
		movie.innerHTML += "<br>" + data["results"][0]["original_title"] ;
		movie.innerHTML += "<br>" + data["results"][0]["release_date"];
		poster = `https://image.tmdb.org/t/p/w500/${data["results"][0]["poster_path"]}`
		movie.innerHTML += "<br> <br> <img style='border:4px solid;' src = " + poster + " width='200' height='300' />";
		movie.innerHTML += "<br><br> <form><input type='search' id='" + key_search.concat(j) + "' placeholder='Enter director/actor name...'>"
		movie.innerHTML += "<br> <br> <button onclick='search()'>Submit</button> </form>";
		id = data["results"][0]["id"];
		runCredits(id);   
	})
}

let runCredits = function (id) {
	let url = ''.concat(baseURL, 'movie/', id, '/credits?api_key=', apiKey);
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		for(i = 0; i < data["cast"].length; i++) { list1.push(data["cast"][i]["name"].toLowerCase());}
		for(i = 0; i < data["crew"].length; i++) {list1.push([data["crew"][i]["name"]][0].toLowerCase());}
	})
}

let runName = function (name) {
	let url = ''.concat(baseURL, 'search/person?api_key=', apiKey, '&query=', name);
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		cast_id = data["results"][0]["id"];
		runSearchCast(cast_id);
	})
}

let runMovies = function (id) {
	let url = ''.concat(baseURL, '/person/', id, '/combined_credits?api_key=', apiKey);
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		for(i = 0; i < data["cast"].length; i++) { if([data["cast"][i]["title"]][0] != undefined) { list2.push([data["cast"][i]["title"]][0].toLowerCase());}}
	})
}

let runSearchCast = function (id) {
	let url = ''.concat(baseURL, 'person/', id, '?api_key=', apiKey);
	fetch(url)
	.then(response=>response.json())
	.then((data)=>{
		movie.innerHTML += "<p><strong> Question " + q + "</strong></p>";
		q += 1;
		movie.innerHTML += "<br>" + data["name"];
		pic = `https://image.tmdb.org/t/p/w500/${data["profile_path"]}`
		movie.innerHTML += "<br> <br> <img style='border:4px solid;' src = " + pic + " width='200' height='300' />";
		movie.innerHTML += "<br><br><form> <input type='search' id='" + key_search2.concat(j) + "' placeholder='Enter movie name...'>";
		movie.innerHTML += "<br> <br> <button onclick='search2()'>Submit</button> </form>";
		runMovies(id);
	})
}

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

function search(){
	var answer = document.getElementById(key_search.concat(j)).value;
	if (findValueInList(answer.toLowerCase(),list1)){
		if(findValueInList(answer.toLowerCase(),answers1) == false){
			answers1.push(answer.toLowerCase());		
			movie.innerHTML += "<br><br><p style='color:green'> <u> Success !</u> " + answer.toUpperCase() + " is indeed part of this movie :) <br><br></p>";
			score += 1;
			head.innerHTML = "<p style='font-size: 26px;'> Your score : " + score + "</p>";
			list1 = [];
			runName(answer.toLowerCase());
		}
		else {
			movie.innerHTML += "<br> <p style='color:navy'> You already played with this actor/director before ! Try another name </p><br>";
		}
	}
	else { 
		movie.innerHTML += "<br><br><p style='color:red'> <u> Failure !</u> " + answer.toUpperCase() + " is not part of this movie :( Try again ! </p>";
		fail += 1;
		if(fail > 3 & fail <=4) { score = score - 1 };
		}
	if (fail > 4) { fail = 0; }
	return false;
}

function search2(){
	var answer2 = document.getElementById(key_search2.concat(j)).value;
	if (findValueInList(answer2.toLowerCase(),list2)){
		if(findValueInList(answer2.toLowerCase(),answers2) == false){
			answers2 += answer2.toLowerCase();
			movie.innerHTML += "<br><br><p style='color:green'> <u> Success !</u> He/She is indeed part of " + answer2.toUpperCase() + " :) <br><br></p>";
			score += 1;
			head.innerHTML = "<p style='font-size: 26px;'> Your score : " + score + "</p>";
			list2 = [];
			runSearchMovie(answer2.toLowerCase());
			j+=1;
		}
		else {
			movie.innerHTML += "<br> You already played with this movie before ! Try another name <br>";
		}
	}
	else { 
		movie.innerHTML += "<br><br><p style='color:red'> <u> Failure !</u> He/She is not part of " + answer2.toUpperCase() + " :( Try again ! </p>";
		fail += 1;
		if(fail > 3 & fail <=4) { score = score - 1 };
		}
	if (fail > 4) { fail = 0; }
	return false;
}

document.addEventListener('DOMContentLoaded', getConfig);
	
