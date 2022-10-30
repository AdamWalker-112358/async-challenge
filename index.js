import fetch from "node-fetch";
import dayjs from 'dayjs';

async function getCountryPopulation(country) {
    const url = `https://countriesnow.space/api/v0.1/countries/population`;
    const options = {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({country})
    };
    let response = await fetch(url, options);
    let json = await response.json()
    if (json?.data?.populationCounts)
        return ({
            country, population: json.data.populationCounts.at(-1).value
        });
    else
        // throw new Error(`My Error: no data for ${country}`)
        return ({
            country, population: 'Not Available'
        });
}



//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------

async function manual() {

    try {
        let population = await getCountryPopulation("France")
        console.log(`Population of France: ${population}`)
            
        population = await getCountryPopulation("Germany")
        console.log(`Population of Germany: ${population}`)
    }
    catch (error) {
        console.log('Error in manual: ', error.message)
    }



}
// manual()

//--------------------------------------------------------
//  Parallel processing 
//--------------------------------------------------------
const countries = ["France","Russia","Germany","United Kingdom","Portugal","Spain","Netherlands","Sweden","Greece","Czechia","Romania","Israel"];

async function parallel() {

    try {
        let promises = countries.map(country => getCountryPopulation(country))
        let populations = await Promise.allSettled(promises);
        console.log(`Got populations for ALL countries!`)
        populations.forEach((population, index) => {
            if (population.status == 'fulfilled')
                console.log(`Population of ${countries[index]}: ${population.value}`)
            else
                console.log(`${countries[index]} has no population`);
        })
        
    } catch (error) {
        console.log('Error in parallel: ', error.message)
    }

}

// parallel();



//------------------------------
//   Sequential processing 
//------------------------------
async function sequence() {

    let populations = new Object();

    for (let country of countries) {
        try {
            let population = await getCountryPopulation(country);
            populations[country] = population;
        } catch (error) {
            populations[country] = 'Not Available'
        }
    }

    for (let country in populations) {
        console.log(`Population of ${country}: ${populations[country]}`)
    }

    console.log(`Got population for ALL countries!`);
    console.log(`Countries: ${countries}`);
}
// sequence();

// A shorter way of  doing it. 
async function sequence2() {
    let promises = countries.map(country => getCountryPopulation(country));
    for await (let promise of promises) {
        console.log(`${promise.country}: ${promise.population}`)
    }
    console.log(`Got population for ALL countries!`);
    console.log(`Countries: ${countries}`);
}

sequence2();






