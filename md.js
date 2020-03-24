
let i=0;
let people = [];
let    person_healthy = 0;
let    person_isolating = 0 ;
let    person_available = 0;
let    person_not_isolating = 0;
let    person_infected =0;
let    recovery_period = 20;
let    results = [];
let    xaxis = [];
let simulation = [];
let iterations=10;

let isolating_proportion_percent = 1.0;
let infecting_proportion_percent = 0.5;
var fortnight_isolation_percent = 0;
let initial_population = 500;
let avail = [] ;
let isolating = [];
let infected = [];
let simulation_length = 100;
let title = { text: 'Available people' , align : 'left' };

function initialise_people() {
    person_id = 0;
	people = [];
	for ( i = 0 ; i < initial_population; i++ )
	{
		var person = new Person();
		people.push(person);
	}
}
let mydata= [];

let Healthy = true;
let Ill = false;
let f=0;
let s=0;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function  update_people(day){
    for ( let person = 0 ; person < initial_population ; person++ ) {
        people[person].update(day);
        if ( getRndInteger(0,10000) < (Math.floor(isolating_proportion_percent*100)) ) 
        {
            if (getRndInteger(0,10000) < (Math.floor(fortnight_isolation_percent*100)))
            {
                people[person].start_isolating(day,14,Healthy);
                f++;
            }
            else
            {
                people[person].start_isolating(day,7,Healthy); 
                s++;
            }
        }
        if ( getRndInteger(0,10000) < (Math.floor(infecting_proportion_percent*100)))
            people[person].infect(day);
    }
}

function collect_results(day){
    person_healthy = 0;
    person_isolating = 0 ;
    person_available = 0;
    person_not_isolating = 0;
    person_infected = 0;
    
    for ( let i =0 ; i < initial_population;i++ ) {
        person = people[i];
        if ( person.is_healthy() )
            person_healthy = person_healthy + 1
        if (person.is_isolating())
            person_isolating = person_isolating + 1 ;
        else
            person_not_isolating = person_not_isolating + 1;
        if (person.is_available())
            person_available = person_available + 1;
        if ( person.is_infected() )
            person_infected = person_infected + 1;
    }

    avail.push(  person_available)
    isolating.push( person_isolating)
    infected.push( person_infected )

    //print("day {} , healthy {} , available {} , isolating {} ".format(day,person_healthy,person_available, person_isolating))
}

function whichRadioButton(){
    let buttons = document.getElementsByName("selection");
    for (let i = 0; i < buttons.length ; i++ )
    {
        if ( buttons[i].checked )
        {
            console.log(buttons[i].value)
            return buttons[i].value;
        }
    }
}
let minimum = [];
let maximum = [];
let averages = [];

function calculate_averages()
{
    minimum = [];
    maximum = [];
    averages = [];

    let average = 0;
    let total = 0;
    for ( let day = 0 ; day < simulation_length ; day++ ){
            let min = initial_population;
            let max = 0;
            let value=0;
            average =0;
            total = 0;
        for ( let i =0 ; i < iterations ; i++){
            value=results[i][day];
            if ( value > max )
                max = value;
            if ( value < min )
                min = value;
            total = total + value;
        }
        minimum.push(min);
        maximum.push(max);
        averages.push(total/iterations);
    }
    simulation = [
        { 'name': 'min', 'data' : minimum },
        { 'name': 'max', 'data' : maximum},
        { 'name': 'ave', 'data' : averages } ];
}
function run_sim(sim){
	for ( let day = 0 ; day< simulation_length ; day++ ) {
    		update_people(day);
            collect_results(day);
            xaxis.push(day);
    }
    values= new Array;
    switch( whichRadioButton() )
    {
        case 'avail':
            yaxis = avail;
            title = { text: 'Available people' , align : 'left' };
            break;
        case 'isol':
            yaxis = isolating;
            title = { text: 'Isolating people' , align : 'left' };
            break;
        case 'infect':
            yaxis = infected;
            title = { text: 'Infected people' , align : 'left' };
            break;
        default:
            yaxis = avail;

    }
    for ( let i = 0 ; i < yaxis.length ; i++ )
    {
        values.push(yaxis[i])
    }
    results.push(values);
}
let chart = null;

function updateChart() {
    if ( chart == null ) {
    let options = {
        series: simulation,
        chart: { height: 500, type: 'line', zoom: { enabled: false }},
      dataLabels: { enabled: false},
      stroke: { curve: 'straight'},
      title: { text: 'Available people', align: 'left' },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: { categories: xaxis, title: { text: 'Days', align: 'center' }}
      };

         chart = new ApexCharts(document.querySelector("#chart"), options);
         chart.render();
    }
    else   
    {
        chart.updateOptions( { title })
        if ( document.getElementById('aves_only').checked == true )
        {
            calculate_averages();
            chart.updateSeries(simulation);
        }
        else
        {
            chart.updateSeries(simulation);
        }
    }
}
function recalculate() {
    initial_population = parseInt(document.getElementById('population').value);
    xaxis=[];
    simulation = [];
    results = [];
    f=0;
    s=0;
    for ( let sim=0; sim < iterations ; sim++ ) {
        initialise_people();
        avail=[initial_population];
        isolating=[0];
        infected=[0];
        run_sim(sim);
    }

    for ( let sim=0 ; sim < iterations ; sim++ ) {
        simulation.push({ 'name': sim, 'data' : results[sim] })
    }
    
    updateChart();

}

