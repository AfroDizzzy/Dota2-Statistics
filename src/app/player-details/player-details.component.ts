import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { Location } from '@angular/common';

import {MatTableDataSource} from '@angular/material/table';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


class chart2 {
  barChartOptions;
  barChartLabels;
  barChartType;
  barChartLegend;
  barChartPlugins;
  barChartData;

  constructor (labels, Chartdata) {
    this.barChartOptions = {
      responsive: true
    } as ChartOptions,
    this.barChartLabels = labels as Label[],
    this.barChartType = 'bar' as ChartType,
    this.barChartLegend = true,
    this.barChartPlugins = [],
    this.barChartData = [
      {barPercentage: 1, data: Chartdata.winnerArray, label: 'Wins' },
      {data: Chartdata.loserArray, label: 'Loses'}
    ] as ChartDataSets[]
  }   
}


@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})

export class PlayerDetailsComponent implements OnInit {
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private location: Location) {}

   ngOnInit() {

    // on start up of the component it will search for the profile
    this.route.queryParams.subscribe(params => {
      this.playerId = params['playerIdentity'];
      this.getRouteId();
    });
    this.getHeroData();
  }

  // general variables
  playerId: string;
  playerResult: any;
  playerMatches: any;
  postInput: string = "";
  heroes: any;
  displayVersesStartTime = false;
  displayVersesDay = false;
  displayVersesTeam = false; 
  displayCustomGraph = false;
  display;
  displayGraph: any; 
  matchTimes = [];
  duration = [0,5,10,15,20,25,30,35,40,45,50,60]
  dataTypes = [this.duration]; 
  teams = ["Radient", "Dire"];
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    //variables used by angular mat table
    matchDataTable = [];
    matchSource: any; 
    matchTableColumns:any;

  gameModeID = {
    0: "Unknown",
    1: "All Pick",
    2: "Captains Mode",
    3: "Random Draft",
    4: "Single Draft",
    5: "All Random",
    6: "Intro",
    7: "Diretide",
    8: "Reverse Captain Mode",
    9: "Greeviling",
    10: "Tutorial",
    11: "Mid Only",
    12: "Least Played",
    13: "Limited Heroes",
    14: "Compendium Matchmaking",
    15: "Custom",
    16: "Captains Draft",
    17: "Balanced Draft",
    18: "Ability Draft",
    19: "Event",
    20: "All Random Death Match",
    21: "1v1 Mid",
    22: "All Pick",
    23: "Turbo",
    24: "mutation"
  }  

  getRouteId() {
    const routeId = +this.route.snapshot.paramMap.get('id');
    this.playerId = routeId.toString();

    //produces a defualt for the playerId and initalises the search for it
    if (this.playerId == "0") {
      this.playerId = "27204000";
      this.getPlayerData()
    }
    else {
      this.getPlayerData()
    }
  }

  //gets data of player and recentplayer matches
  getPlayerData() {
    //makes the page url for the page as /player-details/.
    this.location.go("/player-details/"+this.playerId);

    //makes a call to the server to retrieve profile data and syncs once it has it.
    this.http.get("https://api.opendota.com/api/players/" + this.playerId).subscribe((result) => {
      this.playerResult = result;  
      // takes the time last_login parameter and modifies it to be more readable
      this.playerResult.profile.convertedTime = (this.playerResult.profile.last_login.substring(0,10) + " at " + this.playerResult.profile.last_login.slice(11,19) + " UTC+0"  )
  });

    //retrives my recent matchs from my profile
    this.http.get("https://api.opendota.com/api/players/" + this.playerId + "/recentMatches").subscribe((pMatches) => {
      this.playerMatches = pMatches;
      //initialises the array to be used in the table
      this.matchToArray(this.playerMatches);
    });
  }

  //Retrives data on all current heroes in dota2 from the api
  getHeroData() {
    this.http.get("https://api.opendota.com/api/heroes").subscribe((result) => {
      this.heroes = result;
    });
  }

  //mmr badge display function
  //checks the players solo skill rating and displays the corresponding badge img from the https://pages.firstblood.io/pages/blog/dota-2/dota-2-ranking-system/
  //switch case would look much neater
  getMMRBadge(mmr) {
    //is herald
    if (mmr < 720) {
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/archive/8/87/20190212051846%21Emoticon_Ranked_Herald.png?version=f0ffc7e5964cc3a3572e1c8f6c115a2e" ;
    }
    // is gardian
    if (mmr > 720 && mmr < 1560) {
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/archive/4/43/20190212051852%21Emoticon_Ranked_Guardian.png?version=4073549e073f1c6def0a9da8f7901182" ;
    }
    // is crusader
    if (mmr > 1560 && mmr < 2400) {
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/archive/2/2d/20190212051912%21Emoticon_Ranked_Crusader.png?version=86a88741a12a739c543d747ab20c7e9b" ;
    }
    //is archon
    if (mmr > 2400 && mmr < 3240) {
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/1/13/Emoticon_Ranked_Archon.png?version=59243715c0695d71caaf91939da44aac" ;
    }
    //is legend
    if (mmr > 3240 && mmr < 4080){
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/1/18/Emoticon_Ranked_Legend.png?version=2ccd2da9015862ec53ec43f310edcfbc" ;
    }
    // is ancient
    if (mmr > 4080 && mmr < 4920){
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/d/d8/Emoticon_Ranked_Ancient.png?version=90092ba3f3cd4041a794f5bf8d161ef9" ;
    }
    //is divine
    if (mmr > 5040 && mmr < 5760 ){
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/6/6d/Emoticon_Ranked_Divine.png?version=0902d4e7824688f941bc8fe9e1cacc1e" ;
    }

    if (mmr > 5760){
      return "https://gamepedia.cursecdn.com/dota2_gamepedia/3/3e/Emoticon_Ranked_Immortal.png?version=8f0421bd63b89bf77c317001a90c2381" ;
    }
    }

  //takes the hero id and matches it to the name of the hero
  convertHeroId(matchDataTableArray) {
    for (let i = 0; i < this.heroes.length; i ++){
      for(let x = 0; x < matchDataTableArray.length; x ++){
        if (this.heroes[i].id == matchDataTableArray[x].hero_id) {
          matchDataTableArray[x].hero_name = this.heroes[i].localized_name;
        }
      }
    }
  }

  //used to get the hero name for any given hero ID
  getHeroId(matchHeroId) {
    for (let i = 0; i < this.heroes.length; i ++){
      if (this.heroes[i].id == matchHeroId) {
         return this.heroes[i].localized_name;
      }
    }
  }

  //takes all of the matchs and then puts it in an array that can be read by MatTable.
  //also uses the functions to display the time and hero ID correctly. 
  matchToArray(data) {
    
    for (var x = 0; x < data.length; x ++){
      //converts time to usauble units
      let xDate = new Date(data[x].start_time * 1000); //the time before processing is in the unix Epoch Time format, this converts it to UTC
      let dateAndTime = this.formatDate(xDate);
      let gameTime = Math.floor(data[x].duration / 60) + ":" + ((data[x].duration % 60) < 10? "0" + data[x].duration % 60 : data[x].duration % 60);

      //data for displaying player side and winner
      let side;
      let won = "Loser";

      if (data[x].player_slot  >= 0 && data[x].player_slot <= 127){
        side = "Radiant";
      } else if (data[x].player_slot >= 128) {
        side = "Dire";
      }

      if (data[x].radiant_win == true && side == "Radiant"){
        won = "Winner";
      } 
      if (data[x].radiant_win == false && side == "Dire") {
        won = "Winner";
      }

      let matchProperties = {
        match_id: data[x].match_id,
        game_mode: this.gameModeID[(data[x].game_mode)],
        player_side: side,
        winner: won,
        hero_id: data[x].hero_id, 
        start_time: dateAndTime, 
        duration: gameTime, //converted from seconds to minutes
        kills: data[x].kills, 
        assists: data[x].assists, 
        deaths: data[x].deaths
      };

      //takes the object names assings it to the output table column names variables
      this.matchTableColumns = Object.getOwnPropertyNames(matchProperties);
      this.matchDataTable.push(matchProperties);
      this.matchTimes.push(xDate);
    }

  this.convertHeroId(this.matchDataTable);
  this.matchSource = new MatTableDataSource(this.matchDataTable);
  }
  
  //function from angular material tables page on filtering tables
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matchSource.filter = filterValue.trim().toLowerCase();
  }

  numberToDay(number){
    switch (number) {
      case 0:
        return "Sunday";

      case 1:
        return "Monday";
        
      case 2:
         return "Tuesday";

      case 3:
        return "Wednesday";
        
      case 4:
        return "Thursday";
               
      case 5:
        return "Friday";
        
      case 6:
        return "Saturday";
    }
  }

  //function to output the date in a readable format. Nice use of trinary conditionals as well if I may say so myself!
  formatDate(date){ 
    let formatedMinutes = (date.getMinutes() < 10) ?
     "0" + date.getMinutes() : date.getMinutes(); 

    let formatedHours = (date.getHours() < 10)? 
      "0" + date.getHours() : date.getHours(); 

     
    let formatedDate = (date.getDate() < 10)? 
      "0" + date.getDate() : date.getDate(); 
    
    let day = this.numberToDay(date.getDay());

    return day + " - " + formatedDate + "/" + 
    (date.getMonth() + 1) + "/" + 
    date.getFullYear() + "   -   " + 
    formatedHours + ':' + 
    formatedMinutes;
  }

  //returns a html color based on game winner or loser
  getWinnerColor(match){
    if (match== "Winner"){
      return "lightgreen";
    } 
    if (match == "Loser") {
        return "crimson";
    }
  }

  //toggles the respective tables and loads the table data 
  versesStartTimeToggle(){
    this.displayVersesDay = false;  
    this.displayVersesTeam = false;
    this.displayCustomGraph = false;
    this.displayVersesStartTime = !this.displayVersesStartTime; 
    this.displayGraph = new chart2(this.starttime(), this.chartStartTimeData(this.matchDataTable));
  }

  //toggles the respective tables and loads the table data 
  versesDayToggle(){
    this.displayVersesStartTime = false; 
    this.displayVersesTeam = false; 
    this.displayCustomGraph = false;
    this.displayVersesDay = !this.displayVersesDay;
    this.displayGraph = new chart2(this.daysOfWeek, this.chartDayData(this.matchDataTable));
  }

  //toggles the respective tables and loads the table data 
  versesTeamToggle(){
    this.displayVersesStartTime = false; 
    this.displayVersesDay = false;  
    this.displayCustomGraph = false;
    this.displayVersesTeam = !this.displayVersesTeam;  
    this.displayGraph = new chart2(this.teams, this.chartTeam(this.matchDataTable)); 
  }
  
  //toggles the checklist (to be added)
  customGraphToggle(){
    this.displayVersesStartTime = false; 
    this.displayVersesDay = false;
    this.displayVersesTeam = false; 
    this.displayCustomGraph = !this.displayCustomGraph;
  }

  //builds array for time
  starttime(){
    let time = [];
    for(let i = 0; i < 24; i++){
      time.push(i < 10? "0" + i + ":00": i + ":00")
    }
    return time;
  }
  
  //what time you won your matches in the day
  chartStartTimeData(matchdatatable){
    let winnerArray = [];
    let loserArray = [];

    for (let i = 0; i < matchdatatable.length; i ++){
      for (let t = 0; t < 24; t ++){
        if((matchdatatable[i].winner == "Winner") && (this.matchTimes[i].getHours() == t)){
          winnerArray[t] =+ 1;
         
         }
        if((matchdatatable[i].winner == "Loser") && (this.matchTimes[i].getHours() == t)){
          loserArray[t] =- 1;
        
        }
      }
    }
    return {winnerArray, loserArray};
  }
  
  //which day you won the match one
  chartDayData(matchdatatable){
    let winnerArray = [];
    let loserArray = [];

    for(let t = 0; t < 7; t++){  
      let positive = 0;
      let negative = 0;

      for(let i = 0; i < matchdatatable.length; i ++ ){ 
        let gameTime = matchdatatable[i].start_time;
         if((matchdatatable[i].winner == "Winner") && (gameTime.includes(this.numberToDay(t)))){
          positive ++;
         }
         if((matchdatatable[i].winner == "Loser") && (gameTime.includes(this.numberToDay(t)))){
          negative --;
        }
      }
      winnerArray[t] = positive;
      loserArray[t] = negative; 
      continue
    }
    return {winnerArray, loserArray};
  }
  
  //checks if radiant won
  teamCheckRadiant(matchdatatable){

    let outcomeRadiant = {winner: 0, loser: 0} ;

    for(let i = 0; i < matchdatatable.length; i ++ ){ 
      if((matchdatatable[i].winner == "Winner") && (matchdatatable[i].player_side == "Radiant")){
        outcomeRadiant.winner ++;
      }
      if((matchdatatable[i].winner == "Loser") && (matchdatatable[i].player_side == "Radiant")){
        outcomeRadiant.loser --;
      }
    }

    return outcomeRadiant;
  }
  
  //checks if dire won
  teamCheckDire(matchdatatable){
    let outcomeDire = {winner: 0, loser: 0};

    for(let i = 0; i < matchdatatable.length; i ++ ){ 
      if((matchdatatable[i].winner == "Winner") && (matchdatatable[i].player_side == "Dire")){
       outcomeDire.winner ++;
      }
      if((matchdatatable[i].winner == "Loser") && (matchdatatable[i].player_side == "Dire")){
        outcomeDire.loser --;
      }
    }
    return outcomeDire;
  }
  
  //gets which team one of the match
  chartTeam(matchdatatable){
    let radiantData = this.teamCheckRadiant(matchdatatable);
    let direData = this.teamCheckDire(matchdatatable); 
    let winnerArray = [radiantData.winner, direData.winner];
    let loserArray = [radiantData.loser, direData.loser];
    return {winnerArray, loserArray};
  }
}
