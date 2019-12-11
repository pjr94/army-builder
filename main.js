// Squad Class
class SquadObj{
    constructor(u, p){
        this.unitsInSquad = u;
        this.unitPoints = p;
    }
    weaponPoints = 0;
    get totalSquadPoints(){
        return  (this.unitsInSquad * this.unitPoints) + this.weaponPoints;
    }
}

// Points
// let currentPoints = 0;
let maxPoints = 500;
document.getElementById("max-points").innerHTML = maxPoints;

function updateMaxPoints(){
    if (document.getElementById("maxInput").value != "" && !isNaN(document.getElementById("maxInput").value)){
        maxPoints = document.getElementById("maxInput").value;
        document.getElementById("max-points").innerHTML = maxPoints;
        document.getElementById("maxInput").value = "";
    }  
}

// Holds info on each squad (not each individual unit)
let selectedSquads = [];

function updatePoints(){
    let currentPoints = 0;
    for (let i  = 0; i < selectedSquads.length; i++){
        currentPoints += selectedSquads[i].totalSquadPoints;
    }
    //   currentPoints += par;
    document.getElementById("current-points").innerHTML =  "Current Points: " + currentPoints; 
    if (currentPoints > maxPoints){
        document.getElementById("current-points").style.color = "red";
    } else {
        document.getElementById("current-points").style.color = "initial";
    }
}

function createButton(text){
    let item = document.createElement("BUTTON");               
    item.innerText = text;
    
    return item;  
}

// Create links from array
function populateUnits(arr){
    for (let i = 0; i < arr.length; i++){
        // Create holding div
        let div = document.createElement("DIV");
        
        
        // Create button
        let divbutton = document.createElement("DIV");
        divbutton.classList.add('width140');
        divbutton.classList.add('inline');         
        let item = document.createElement("BUTTON");   
        item.classList.add('button');      
        item.innerText = arr[i].name;
        // When button is pressed call addItem (function like this so it doesn't automatically trigger)              
        item.onclick = function(){ addUnit(arr[i]); };
        divbutton.appendChild(item);
        div.appendChild(divbutton);
        
        // Create units
        let unitsSpan = document.createElement("P"); 
        unitsSpan.classList.add('column');   
        //  unitsSpan.setAttribute('class', 'column');
        let unitsInfo = document.createTextNode(arr[i].minUnits + " ");
        unitsSpan.appendChild(unitsInfo);
        div.appendChild(unitsSpan);
        
        // Create max units in squad
        let maxSquadSpan = document.createElement("P"); 
        maxSquadSpan.setAttribute('class', 'column');
        let maxInfo = document.createTextNode(arr[i].maxUnits + " ");
        maxSquadSpan.appendChild(maxInfo);
        div.appendChild(maxSquadSpan);
        
        // Create points
        let pointsSpan = document.createElement("P");
        pointsSpan.classList.add('column');   
        let pointsInfo = document.createTextNode(arr[i].points);
        pointsSpan.appendChild(pointsInfo);
        div.appendChild(pointsSpan);
        
        
        document.getElementById("hq-units").appendChild(div); 
        
    }
    
}

function populateWeaponList(arr){
    
    for (let i = 0; i < arr.length; i++){
        let p = document.createElement("P");
        p.classList.add('column');
        p.classList.add('width100');   
        p.innerText = arr[i].name
        let p2 = document.createElement("P");
        p2.classList.add('column');   
        p2.innerText = arr[i].points;
        document.getElementById("weapons-list-options").appendChild(p);
        document.getElementById("weapons-list-options").appendChild(p2);
    }

}

// On click Add item (unit as in unit-type)
function addUnit(unitType){
    let squad = new SquadObj(unitType.minUnits, unitType.points);
    selectedSquads.push(squad);
    
    let div = document.createElement("DIV");

    let text = document.createElement("P");
    text.classList.add('column'); 
    text.classList.add('width140');
    let squadNameTextNode = document.createTextNode(unitType.name);
    text.appendChild(squadNameTextNode);

    let textUnits = document.createElement("P");
    textUnits.classList.add('column'); 
    let unitsInSquadTextNode = document.createTextNode(squad.unitsInSquad);
    textUnits.appendChild(unitsInSquadTextNode);

    let textSquadCost = document.createElement("P");
    textSquadCost.classList.add('column'); 
    let squadCostTextNode = document.createTextNode(squad.totalSquadPoints);
    textSquadCost.appendChild(squadCostTextNode);
    // + " " + squad.unitsInSquad +" " + squad.unitsInSquad);

    
    div.appendChild(text);
    div.appendChild(textUnits);
    div.appendChild(textSquadCost);
    
    // Plus unit
    let plus = createButton("+");
    // Has to be run outside onclick to account for already at maxUnits
    if (squad.unitsInSquad >= unitType.maxUnits){
        plus.disabled = "true";
    }
    plus.onclick = function(){
        incrementUnit(squad, 1);
        //    console.log(u.unitsInSquad);
        updatePoints();
        unitsInSquadTextNode.nodeValue =  squad.unitsInSquad;
        squadCostTextNode.nodeValue = squad.totalSquadPoints;

        if (squad.unitsInSquad >= unitType.maxUnits){
            plus.disabled = true;
        }
        minus.disabled = false;
    };
    div.appendChild(plus);
    
    // Minus unit
    let minus = createButton("-");
    // If squad size is at minimum
    if (squad.unitsInSquad <= unitType.minUnits){
        minus.disabled = true;
    }
    minus.onclick = function(){
        incrementUnit(squad, -1);
        //    console.log(u.unitsInSquad);
        if (squad.unitsInSquad <= unitType.minUnits){
            minus.disabled = true;
        }
        
        updatePoints();
        unitsInSquadTextNode.nodeValue = squad.unitsInSquad;
        squadCostTextNode.nodeValue = squad.totalSquadPoints;

        // If squad is less than max
        if (squad.unitsInSquad < unitType.maxUnits){
            plus.disabled = false;
        }
    };
    div.appendChild(minus);
    
    // Create weapons Options
    let weapons = addWeapon(squad, squadCostTextNode);
    weapons.onchange = function(){ 
        weaponSelect(this, squad); 
        squadCostTextNode.nodeValue = squad.totalSquadPoints
    };
    div.appendChild(weapons);
    
    // Create Close Button   
    let close = createButton("X");
    close.onclick = function(){ 
        removeSquad(this, squad.totalSquadPoints); 
        updatePoints();      
    };
    div.appendChild(close); 
    
    document.getElementById("army-hq").appendChild(div); 
    
    updatePoints();
}



function addWeapon(squad, squadCostTextNode){
    let options = document.createElement("SELECT");
    
    // Default
    let weapon = document.createElement("OPTION");
    let weaponText = document.createTextNode("No special weapon");
    
    weapon.appendChild(weaponText);
    options.appendChild(weapon);
    
    for (let i = 0; i < weapons.length; i++){
        let weapon = document.createElement("OPTION");
        let weaponText = document.createTextNode(weapons[i].name);
        //  + ": " + weapons[i].points
        weapon.appendChild(weaponText);
        options.appendChild(weapon);
    }
  
    return options; 
}

// t as in "this" option
function weaponSelect(t, squad){
    let index = findWithAttr(weapons, "name", t.value);

    if (index == -1){
        squad.weaponPoints = 0;
    } else {
        squad.weaponPoints = weapons[index].points;
  //      console.log(squad.unitPoints + " + " + weapons[index].name + " " + squad.weaponPoints + " + " + squad.totalSquadPoints);
    }
    updatePoints();
    
}

function incrementUnit(squad, x){
    squad.unitsInSquad = squad.unitsInSquad + x;
    // Times by x so it works for decrementing units too
    squad.totalSquadPoints = squad.totalSquadPoints + (x * squad.unitPoints);
}

// Pass e "this"
function removeSquad(e, squad){
    selectedSquads.splice(selectedSquads.indexOf(squad), 1);
    // Removes div
    e.parentNode.parentNode.removeChild(e.parentNode);
}

// This function from: https://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript/54015295
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

// Init
updatePoints(0);
populateUnits(unitList);
populateWeaponList(weapons);