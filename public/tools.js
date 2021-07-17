function changeBackgroundColor() {
    var elements = document.getElementsByClassName("indicator")
    for (var i = 0; i < elements.length; i++) {
        var value = parseInt(elements[i].innerText)
        if (value > 0) {
            elements[i].parentElement.style.backgroundColor = '#cdfdc3';
        }
        else if (value < 0) {
            elements[i].parentElement.style.backgroundColor = '#ffbfbf';
        }
    }
}

function colorizeStochRSI   () {
    var elements = document.querySelectorAll(".stochRSI td")
    for (var i = 0; i < elements.length; i++) {
        var value = parseInt(elements[i].innerText)
        if (value <= 20) {
            
            elements[i].style.backgroundColor = '#cdfdc3';
            elements[i].style.color = '#178700';
        }
        else if (value >= 80) {
           

            elements[i].style.backgroundColor = '#ffbfbf';
            elements[i].style.color = '#ad0000';
        }
    }
}

function getPrices() {
    console.log("get prices")
    var symbolcells = document.getElementsByClassName("coin-data")
    for (let i = 0; i < symbolcells.length; i++) {
        const symbol = symbolcells[i].getElementsByClassName("dpsym");
        const pricecell = symbolcells[i].getElementsByClassName("coin-price")
        
        
        var url = 'https://api.binance.com/api/v3/ticker/price?symbol=' + symbol[0].textContent.trim();
        fetch(url).then(response => response.json())
        .then(commits =>{
            pricecell[0].innerText = parseFloat(commits.price)
            console.log(commits.symbol + " " +commits.price)});

    }

}

function tabletool() {
    var table = $('#dptable').DataTable({
        paging: false,
        aaSorting: [[0, 'desc']],
        // dom: 'Qlfrtip',
        stateSave: true,
        searchBuilder: true
        
    })
    table.searchBuilder.container().prependTo(table.table().container());
}