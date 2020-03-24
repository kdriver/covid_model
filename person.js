let person_id =0;
class Person {

    constructor() {
        this.healthy = true
        this.isolating = false
        this.available = true
        this.start_of_isolation = 0
        this.end_of_isolation = 0
        this.start_of_infection =0
        this.end_of_infection =0
        this.infected_now = false;
        this.id = person_id;
        person_id = person_id + 1
    }

    start_isolating(day,period,health){
		if ( this.isolating == false ) 
		{
		    this.start_of_isolation = day;
		    this.end_of_isolation = this.start_of_isolation + period;
		    this.healthy = health
		    this.isolating = true
		}
	}

    is_healthy(){
        return this.healthy
	}

    is_isolating() {
        return this.isolating
	}

    is_available() {
        return this.available
    }

    is_infected() {
        return this.infected_now;
    }

    update(day) {
        if ( this.isolating == true)
        {
                if  ((day >= this.end_of_isolation) &&  this.healthy == true )
                {
                    this.available = true
                    this.isolating = false
                    //console.log(day + " out of isol - avail true");
                }
        }
        if ( this.infected_now == true )
        {
            if ( day >= this.end_of_infection )
            {
                this.infected_now = false;
                this.healthy = true;
                this.available = true;
                this.isolating = false;
                //console.log(day + " recovered from infection")
            }


        }
    }

    infect(day) {

        if ( this.infected_now == false )
        {
            this.healthy = false
            this.available = false
            this.infected_now = true;
        
            this.start_of_isolation = day
            this.start_of_infection = day
            this.end_of_infection = day + recovery_period
            this.end_of_isolation = day + recovery_period
            //console.log(day + " infected for " + recovery_period);
        
            this.isolating = true
        }
    }
}
