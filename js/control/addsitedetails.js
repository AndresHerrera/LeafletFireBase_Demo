var firebaseConfig = {
    apiKey: "AIzaSyCN5fEvDB7SGhX0dFjk7ZHag8e7m4mDb",
    authDomain: "geolocalizationandresh.firebaseapp.com",
    databaseURL: "https://geolocalizationandresh.firebaseio.com",
    projectId: "geolocalizationandresh",
    storageBucket: "geolocalizationandresh.appspot.com",
    messagingSenderId: "50070855071",
    appId: "1:500708550761:web:1747cb79d86b49d83a1a",
    measurementId: "G-QBSDYY5B"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const idsite = document.getElementById("idsite");
const nameDetail = document.getElementById("nameDetail");
const valueDetail= document.getElementById("valueDetail");
const registrarBtn= document.getElementById("registrarBtn");

const materiasContainer = document.getElementById("materiasContainer");
const database = firebase.database();
const storage = window.localStorage;

//get data
const idEst = storage.getItem("id");


//Read object
database.ref().child("reportesitios").child(idEst).on("value", function(snapshot)
{
    var estObj = snapshot.val();
    console.log(estObj.codesite);
	console.log(estObj.imgurl);
	
	var img = document.createElement("img");
	img.src = 'images/'+estObj.imgfilename;
	img.width = 36;
	
    idsite.innerHTML = "Detalles del sitio (" + estObj.codesite + ") : " + estObj.namesite;
	idsite.appendChild(img);
	
});


registrarBtn.addEventListener("click", function()
{
    var id = database.ref().child("reportesitios").child(idEst).child("details").push().key;
    //getting details
    
    var namedetail = nameDetail.value;
    var valuedetail = valueDetail.value;

    var sitedetail = new SiteDetail(id, namedetail, valuedetail);
	
	console.log(sitedetail);

    database.ref().child("reportesitios").child(idEst).child("details")
        .child(id).set(sitedetail);

});

//Read details for a site
database.ref().child("reportesitios").child(idEst).child("details")
    .on("child_added", function(snapshot){
        var detail = snapshot.val();
        var item = document.createElement("p");
        item.innerHTML = "* " + detail.name + " ("+detail.val+")";
        materiasContainer.appendChild(item);
    });
