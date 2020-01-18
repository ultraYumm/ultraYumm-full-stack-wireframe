'use strict';

    const apId = 'e701e874'
    
    const apiKey = 'da5d99bc6f1e9ed3387a6ee1be3a8a77'
    
    const remoteUser = 0
    
    const detailed = 'true'
    
    const getURL = 'https://trackapi.nutritionix.com/v2/search/instant'
    
    
    function formatQueryParams(params) {
      const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      return queryItems.join('&')
    }
    
    function displayResults(responseJson, maxResults) {
     // if there are previous results, remove them
         
    $('#results-list').empty() 
    $('#results-listB').empty() 

    if (responseJson.common.length == '0' && responseJson.branded.length == '0') {
   
    $("h2").text("Sorry, there are no results for this search term, try again!")
    }

    else {
    $("h3").text("See your highest energy results!")
    $("h2").text("")  
    } 


    console.log(responseJson.common.length)
      // remove duplicate results if any
     var dupArray = responseJson
      
      for (let i=0; i < responseJson.common.length; i++) {
      if (dupArray.common[i].tag_id == responseJson.common[i].tag_id) {
      responseJson.common.splice(i,1)
      }
    
      }
     // loop through table to append to data table for common foods
      for (let i = 0; i < responseJson.common.length & i<maxResults; i++) {
        var servingWeight =  responseJson.common[i].serving_weight_grams
                             responseJson.common[i].serving_weight_grams
        var calPerServing = (responseJson.common[i].full_nutrients[4].value)
        
        var calPer100g = Math.round((calPerServing/servingWeight)*100)

        if (!responseJson.common[i].serving_weight_grams) {
         responseJson.common.splice(i,1)
       }
        
      // append common food results  
        $('#results').append(
          `<tr class= "one whiteBackground black">
                 <td class= "imageH"><img class= "tableImage" src=${responseJson.common[i].photo.thumb}></td>
            
                  <td class= "itemH">${responseJson.common[i].food_name}</th>
            
                  <td class= "brandId">${Object.keys(responseJson)[0]}</th>
            
                  <td class= "servingH tooltip quant">${Math.round(responseJson.common[i].serving_qty)}<span class="tooltiptext">Serving Quantity</span></th>
            
                  <td class= "unitH">${responseJson.common[i].serving_unit}</td>
            
                  <td class= "weightH tooltip gram">${Math.round(responseJson.common[i].serving_weight_grams)}<span class="tooltiptext">Weight (grams)</span></td>
            
                  <td class= "caloriesH tooltip cal calS">${Math.round(responseJson.common[i].full_nutrients[4].value)}<span class="tooltiptext"><span><- cal per serving</span><span>&nbsp -> cal per 100g</span></span></td>
            
                  <td class= "caloriesH cal tooltip calG">${calPer100g}</tr>`
          )
              
        }
    
      // loop through table to append to data table for branded foods
      for (let j = 0; j < responseJson.branded.length & j<maxResults; j++) {
              
      // remove null values to prevent "infinity" result for calories per 100g calculation; this occurs with branded foods that have incomplete information
        if (
        !responseJson.branded[j].serving_weight_grams ||
        isNaN(responseJson.branded[j].serving_weight_grams) ||
        responseJson.branded[j].full_nutrients[3].value === 0 ||
        responseJson.branded[j].full_nutrients[3].value == 0 ||
        responseJson.branded[j].full_nutrients[3].value === "0" ||
        responseJson.branded[j].full_nutrients[3].value == "0"
        )
        
        {
        responseJson.branded.splice(j,1)}

      // calculate calories per 100g         
        var servingWeightB = Number(responseJson.branded[j].serving_weight_grams)
        var calPerServingB = Number((responseJson.branded[j].full_nutrients[3].value))
        let calPer100gB = (Math.round((calPerServingB/servingWeightB)*100))
    
      // append branded food results        
        $('#results').append(
          `<tr class= "one whiteBackground black">
                  <td class= "imageH"><img class= "tableImage" src=${responseJson.branded[j].photo.thumb} alt= "Item image"></td>
            
                  <td class= "itemH">${responseJson.branded[j].food_name}</th>
            
                  <td class= "brandId">${responseJson.branded[j].brand_name}</th>
            
                  <td class= "servingH tooltip quant">${Math.round(responseJson.branded[j].serving_qty)}<span class="tooltiptext">Serving Quantity</span></th>
            
                  <td class= "unitH">${responseJson.branded[j].serving_unit}</td>
            
                  <td class= "weightH tooltip gram">${Math.round(responseJson.branded[j].serving_weight_grams)}<span class="tooltiptext">Weight (grams)</span></td>
            
                  <td class= "caloriesH tooltip cal calS">${Math.round(responseJson.branded[j].full_nutrients[3].value)}<span class="tooltiptext"><span><- cal per serving</span><span>&nbsp -> cal per 100g</span></span></td>
            
                  <td class= "caloriesH cal tooltip calG">${calPer100gB}
            </tr>` 
        )

        // append branded food to brand only results table 
       $('#resultsB').append(
        `<tr class= "one whiteBackground black">
                  <td class= "imageH"><img class= "tableImage" src=${responseJson.branded[j].photo.thumb} alt= "Item image"></td>
  
                  <td class= "itemH">${responseJson.branded[j].food_name}</th>
  
                  <td class= "brandId">${responseJson.branded[j].brand_name}</th>
  
                  <td class= "servingH tooltip quant">${Math.round(responseJson.branded[j].serving_qty)}<span class="tooltiptext">Serving Quantity</span></th>
  
                  <td class= "unitH">${responseJson.branded[j].serving_unit}</td>
  
                  <td class= "weightH tooltip gram">${Math.round(responseJson.branded[j].serving_weight_grams)}<span class="tooltiptext">Weight (grams)</span></td>
  
                  <td class= "caloriesH tooltip cal calS">${Math.round(responseJson.branded[j].full_nutrients[3].value)}<span class="tooltiptext"><span><- cal per serving</span><span>&nbsp -> cal per 100g</span></span></td>
  
                <td class= "caloriesH cal tooltip calG">${calPer100gB}
        </tr>`)
            
      }

          
      //Sort cal per 100 results in descending order
    function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch
    table = document.getElementById("results")
    switching = true
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false
      rows = table.rows
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByClassName("calG")[0]

        y = rows[i + 1].getElementsByClassName("calG")[0]
        //check if the two rows should switch place:

        if (Number(x.innerHTML) < Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
          /*if (isNaN(x) == true) {
            shouldSwitch = false;
          }*/
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
        }
      }
    }
    
     //perform same sorting function for brand-only results table
    function sortTableB() {
    var table, rows, switching, i, x, y, shouldSwitch
    table = document.getElementById("resultsB")
    switching = true;
      /*Make a loop that will continue until
      no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false
        rows = table.rows
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
          //start by saying there should be no switching:
          shouldSwitch = false
          /*Get the two elements you want to compare,
          one from current row and one from the next:*/
          x = rows[i].getElementsByClassName("calG")[0]
          y = rows[i + 1].getElementsByClassName("calG")[0]
          //check if the two rows should switch place:
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true
            break
          }
        }
        if (shouldSwitch) {
          /*If a switch has been marked, make the switch
          and mark that a switch has been done:*/
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
          switching = true
        }
      }
    }
    
    sortTable()
    sortTableB()
    
    
      //display the results sections//
      $('#resultsTitle').removeClass('hidden')
      $('#resultsTitleB').removeClass('hidden')  
      $('#results').removeClass('hidden')
      $('#resultsB').removeClass('hidden')

      var infinity = document.getElementsByTagName("TR")
     
     //scroll to the results section//  
      $('html, body').animate({
                scrollTop: $("#top").offset().top
            }, 500)
      }
    
    // set up GET API request and fetch URL
    function getResults(query, maxResults) {
      
      const params = {
      query: query,
      detailed: detailed,
      }
    
      const queryString = formatQueryParams(params)
      const url = getURL + '?' + queryString
    
      const options = {
        headers: new Headers({
          'x-app-id': apId,
          'x-app-key': apiKey,
          'x-remote-user-id':remoteUser
          })
      }
      
      fetch(url, options)
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(response.statusText)
        })
        .then(responseJson => displayResults(responseJson, maxResults))
        .catch(err => {
          $('#js-error-message').text(`Ooops, something went wrong... ${err.message}`)
          $('#snowyOwl').remove()

          })
    }
    
    
    function watchForm() {
      $('#js-getForm').submit(event => {
        event.preventDefault()
        const searchTerm = $('#js-search-term').val()
        const maxResults = $('#js-max-results').val()/2
                
        $('#snowyOwl').append(
           `<img class= "snowyOwl" src="images/snowyOwl.GIF" alt="snowy owl waiting for results">`
        )
        getResults(searchTerm, maxResults)
      })
    }
    
    $(watchForm)

    // refresh form if "clear" button is clicked   
    $('#js-refreshForm').click(function() {
    location.reload()
    scrollTo(0,0) 
})

    $('#js-refreshFormB').click(function() {
    location.reload()
    scrollTo(0,0) 
})

  // refresh form if "print" button is clicked
    $('#js-Print').click(function() {
    window.print()
})

    $('#js-PrintB').click(function() {
    window.print()
})
