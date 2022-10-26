
function getCountryPopulation(country){
    return new Promise((resolve,reject)=> {
        const url = `https://countriesnow.space/api/v0.1/countries/population`;
        const options = {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({country})
        };
        fetch(url,options)
            .then(res => res.json())
            .then(json => {
                if (json?.data?.populationCounts) resolve(json.data.populationCounts.at(-1).value);
                else reject(new Error(`My Error: no data for ${country}`)) //app logic error message
            })
            .catch(reject) // network error like server is down for example...
            // .catch(err => reject(err)) // same same, only longer...
    })
}


//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------

function manual() {
    getCountryPopulation("France")
        .then( population => {
            console.log(`population of France is ${population}`);
            return getCountryPopulation("Germany")
        })
        .then( population => console.log(`population of Germany is ${population}`))
        .catch(err=> console.log('Error in manual: ',err.message));
}
// manual()
//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

function parallel() {

    Promise.map(countries, (country) => {
        return getCountryPopulation(country)
                    // .then(population => {
                    //     console.log(`population of ${country} is ${population}`);
                    // })
                    .catch(err => console.error(`${country} failed: ${err.message}`))
    })
    .then(populations => {
        console.log(`Got populations for ALL countries!`);
        // console.log(`countries: ${populations}`);
        populations.forEach((population,i)=> console.log(`population of ${countries[i]} is ${population}`));
    })
    .catch(err=> console.log('Error in sequence: ',err.message));

}
// parallel();
//------------------------------
//   Sequential processing 
//------------------------------
function sequence() {

    Promise.each(countries, (country) => {
        return getCountryPopulation(country)
                    .then(population => {
                        console.log(`population of ${country} is ${population}`);
                    })
                    .catch(err => console.error(`${country} failed: ${err.message}`))
        
    })
    .then(countries => {
        console.log(`Got population for ALL countries!`);
        console.log(`countries: ${countries}`);
    })
    .catch(err=> console.log('Error in sequence: ',err.message));

}
sequence();