var firebaseConfig = {
    apiKey: "AIzaSyCN5fEvDB7SGhX0dFjk7ZHag8e7m4mDb",
    authDomain: "geolocalizationandresh.firebaseapp.com",
    databaseURL: "https://geolocalizationandresh.firebaseio.com",
    projectId: "geolocalizationandresh",
    storageBucket: "geolocalizationandresh.appspot.com",
    messagingSenderId: "500708550761",
    appId: "1:500708550761:web:1747cb79d86b49d83a1a",
    measurementId: "G-QBSDYY5BSJ"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const codeSite = document.getElementById("codeSite");
const nameSite = document.getElementById("nameSite");
const descriptionSite = document.getElementById("descriptionSite");
const lonSite = document.getElementById("lonSite");
const latSite = document.getElementById("latSite");

const registerBtn = document.getElementById("registerBtn");
const contenedorBase = document.getElementById("contenedorBase");
const database = firebase.database();
const storage = window.localStorage;

var imgCategory = "";
var imgfilename = "";

registerBtn.addEventListener("click", registerSite);

function registerSite() 
{
    let codesite = codeSite.value;
    let namesite = nameSite.value;
    let descriptionsite = descriptionSite.value;
	let lonsite = lonSite.value;
	let latsite = latSite.value;
	
    let id = database.ref().child("reportesitios").push().key;

    let site = new Site(id, codesite, namesite, descriptionsite, imgCategory, imgfilename, lonsite, latsite);
    console.log(site);
    //Register new site in database
    database.ref().child("reportesitios").child(id).set(site);
	alert('Nuevo Sitio Registrado');
	clearFields();
}

//clear fields
function clearFields()
{
	codeSite.value="";
    nameSite.value="";
    descriptionSite.value="";
}

//read list
database.ref().child("reportesitios").on("child_added", function(snapshot)
{

  var estObj = snapshot.val();

  var item = document.createElement("li");

  var img = document.createElement("img");
  img.src = 'images/'+estObj.imgfilename;
  img.width = 36;

  var enlace = document.createElement("a");
  enlace.innerHTML = "[ "+estObj.codesite+" ]" + " "+estObj.namesite;
  enlace.href = "#";
  enlace.id = estObj.id;
  item.appendChild(img);
  item.appendChild(enlace);
  contenedorBase.appendChild(item);

  //Crear listener para el elemento:
  document.getElementById(estObj.id).addEventListener("click", function(event){
    event.preventDefault();
    storage.setItem("id", estObj.id);
    window.location.href = "sitedetails.html"
  });
  
  //get site details 
  var itemDetails=""
  database.ref().child("reportesitios").child(estObj.id).child("details")
    .on("child_added", function(snapshot){
        var detail = snapshot.val();
        var item = document.createElement("p");
        item= "* " + detail.name + " ("+detail.val+")<br>";
		console.log(item);
		itemDetails += item;
    });
	
   //add markers to map
	L.marker([estObj.latsite , estObj.lonsite ],{icon:L.icon(
	{
		iconSize: [27, 27],
		iconAnchor: [13, 27],
		popupAnchor:  [1, -24],
		iconUrl: 'images/'+estObj.imgfilename 
	})}).addTo(mymap).bindPopup("<b>[ "+estObj.codesite+" ]</b>" + " "+estObj.namesite+"<br><b>Descripci&oacute;n:</b><br>"+estObj.descriptionsite+"<br>"+"<b>Detalles:</b><br>"+itemDetails);

});

document.querySelectorAll(".category").forEach(
  item => {
    item.addEventListener("click", function(){
      restoreButtons();
      item.width = 40;
      imgCategory = item.src;
	  imgfilename = imgCategory.split(/[\\\/]/).pop();
      console.log(imgCategory);
	  console.log(imgfilename);
    }); 
  }
);

function restoreButtons(){
  document.querySelectorAll(".category").forEach(
    item => {
      item.width = 32;
    }
  );
}
