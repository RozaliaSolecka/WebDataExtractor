function performCalculations() {
    const mnId = "mn";
    const lhvId = "lhv";
    const inputData = generateInputData();
    const delay = 1; 
    const results = [];
    const circuits = inputData.length + 1;  

    function calculateLoop(i, circuits) {
        if (i === (circuits - 1)) {
            downloadResults(results, 'web_data.txt');
            return;
        }
        console.log("iteration " + i + " of " + circuits);
  
        const concentrations = inputData[i];
  
        applyConcentrations(concentrations);
        calculate();

        setTimeout(function () {
            const mn = parseFloat(document.getElementById(mnId).innerHTML);
            const lvh = parseFloat(document.getElementById(lhvId).innerHTML);

            const result = checkIfError() ?
            {
                'methaneNumber': NaN,
                'lowerHeatingValue': NaN
            }
            :
            {
                'methaneNumber': mn,
                'lowerHeatingValue': lvh
            };

            result['concentrations'] = concentrations;
            results.push(result);

            if (i < circuits) {
                calculateLoop(i + 1, circuits);
            }
        }, delay);
    }
    calculateLoop(0, circuits);
  
    return results;
}


function generateInputData() {
    const root = 'CH4'; //metan
    const inputs = [];
	
    let base_substances = {
    "C2H6": {'min': 5, 'max': 10, 'step': 1}, //etan
    "C3H8": {'min': 5, 'max': 10, 'step': 1}, //propan
    "CO2": {'min': 1, 'max': 10, 'step': 1}, //dwutlenek wegla
    };
    
    let substances = {
        "IC4H10": {'min': 0, 'max': 5, 'step': 1}, //iso-butan
        "NC4H10": {'min': 0, 'max': 5, 'step': 1}, //n-butan
        "IC5H12": {'min': 0, 'max': 5, 'step': 1},//iso-pentan
        "NC5H12": {'min': 0, 'max': 5, 'step': 1}, //n-pentan
        "N2": {'min': 0, 'max': 10, 'step': 1} //azot
      };
      
    //console.log(substances);
     
    let base_arr = Object.keys(base_substances); 
    let arr = Object.keys(substances);

    //console.log(arr);
   
    const combinationsF = ( collection, combinationLength ) => {
        let head, tail, result = [];
        if ( combinationLength > collection.length || combinationLength < 1 ) { return []; }
        if ( combinationLength === collection.length ) { return [ collection ]; }
        if ( combinationLength === 1 ) { return collection.map( element => [ element ] ); }
        for ( let i = 0; i < collection.length - combinationLength + 1; i++ ) {
          head = collection.slice( i, i + 1 );
          tail = combinationsF( collection.slice( i + 1 ), combinationLength - 1 );
          for ( let j = 0; j < tail.length; j++ ) { result.push( head.concat( tail[ j ] ) ); }
        }
        return result;
      }
      //const combinations = combinationsF( arr, 1 );
	  const combinations = arr;

      //console.log(combinations);
      //console.log(substances["C2H6"].min);
   
     let substance_1 = base_arr[0];
     let substance_2 = base_arr[1];
     let substance_3 = base_arr[2];
		
    for (var comb = 0; comb < combinations.length; comb++){
       
        let substance_4 = combinations[comb];
	
        //console.log(substance_1);
        //console.log(substance_2);
        //console.log(substance_3);
        //console.log(substance_4);
        //console.log(substance_5);
     
        let restKeys  = arr.filter(value => !combinations[comb].includes(value));  //list with rest keys
        //console.log(restKeys)

        for (let i = base_substances[substance_1].min; i <= base_substances[substance_1].max; i = i + base_substances[substance_1].step) {
            for (let j = base_substances[substance_2].min; j <= base_substances[substance_2].max; j = j + base_substances[substance_2].step) {
                for (let k = base_substances[substance_3].min; k <= base_substances[substance_3].max; k = k + base_substances[substance_3].step) {
                    for (let l = substances[substance_4].min; l <= substances[substance_4].max; l = l + substances[substance_4].step) {
                       
                            const concentrations = {};
                            concentrations[substance_1] = i;
                            concentrations[substance_2] = j;
                            concentrations[substance_3] = k;
                            concentrations[substance_4] = l;
                          
                            concentrations[root] = 100 - i - j - k - l;
                                
                            for (let restKey = 0; restKey < restKeys.length; restKey++) {
                                concentrations[restKeys[restKey]] = 0;
                            }
                            inputs.push(concentrations);
                        
                    }
                }
            }
        }
    }
    return inputs;   
    //console.log(inputs)
}

  window.alert = function () {
    //console.log("alert was blocked!");
  };
  
function applyConcentrations(concentrations) {
    for (let key in concentrations) {
       document.inputs[key].value = concentrations[key];
    }
}
  
function calculate() {
    determine_inputs();
    getResultsForMN();
}
  
function checkIfError() {
    const h2s = (arrConvertedInputs[13] * 10000);
    return h2s > 6 || arrConvertedInputs[18] > 0.0003 || arrConvertedInputs[19] > 0.001;
}
  
function downloadResults(content, fileName) {
    const contentType = 'text/plain';
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(content, null, 2)], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
