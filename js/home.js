$(document).ready(function () {
    
    loadItems();

    addMoney();
  
    makePurchase();

    cancelTransaction();

});


function loadItems() {
    clearItems();
   
    
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/items',
        success: function(itemArray) {
            $.each(itemArray, function(index, item) {
                var addCard;    
                addCard =   '<div class="card border-secondary mb-3 col-3" id="item' + index +'" style="max-width: 18rem;">' +
                                '<div class="card-text" id="itemId' + index + '">'+
                                '</div>'+
                                '<div class="card-body text-dark">'+
                                    '<h5 class="card-title" id="itemName' + index + '"></h5>  '+
                                    '<p class="card-text" id="itemPrice' + index + '"></p> '+
                                    '<p class="card-text" id="itemInventory' + index + '"></p> '+
                                '</div> '+
                            '</div>';
                            
                if (index <=2){
                $('#cards-container0').append(addCard);
                }
                if (index > 2 && index <= 5){
                $('#cards-container1').append(addCard);
                }
                if (index > 5 && index <= 8){
                $('#cards-container2').append(addCard);
                }

                var itemId = '<p>';
                var itemName = '<p>';
                var itemPrice = '<p>';
                var itemInventory = '<p>';
                
                
                itemId += item.id + '</p><br/>';
                itemName += item.name + '</p><br/>';
                itemPrice += '$' + item.price + '</p><br/>';
                itemInventory += 'Quantity Left: ' +item.quantity + '</p><br/>';
                
                $('#itemId' + index).append(itemId);   
                $('#itemName' + index).append(itemName);   
                $('#itemPrice' + index).append(itemPrice);   
                $('#itemInventory' + index).append(itemInventory);   
                
                formatItems();
                itemToDisplay(index);
            });
        },
        error: function() {
            alert('Failure');
        }
    });
}


function formatItems() {

    for (var i = 0; i < 9; i++) {
    $('#item' + i).addClass('text-center');
    $('#itemId' + i).addClass('text-left');
    }
}


function addMoney() {
    
    
    var dollar = 1;
    var quarter = .25;
    var dime = .1;
    var nickel = .05;
    var currentMoney = 0;
    var decimals = 2;

    $('#add-dollar').click(function(){
        $('#add-coins').val(currentMoney += dollar)
    });

    $('#add-quarter').click(function(){
        $('#add-coins').val(currentMoney += quarter)
    });

    $('#add-dime').click(function(){
        currentMoney += dime;
        currentMoney = currentMoney.toFixed(2);
        currentMoney = parseFloat(currentMoney);
        $('#add-coins').val(currentMoney)
    });

    $('#add-nickle').click(function(){
        currentMoney += nickel;
        currentMoney = currentMoney.toFixed(2);
        currentMoney = parseFloat(currentMoney);
        $('#add-coins').val(currentMoney)
        
    });

    $('#make-purchase').click(function(event){
        currentMoney = 0;
    });

}

function itemToDisplay(indexPosition) {

    $('#item' + indexPosition).click(function() {
        getId(indexPosition);
    });
    
    function getId(indexPosition) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/items',
            success: function(itemArray) {
                $.each(itemArray, function(index, item) {
                    if (index == indexPosition) {
                        $('#item-display').val(item.id);
                    }
                });
            },
            error: function() {
                alert('Failure');
            }
        });
    }
    
}

function makePurchase() {
    var moneyInserted;
    $('#make-purchase').click(function(event){   //EVENT added but not sure WHY
        var itemRequested = $('#item-display').val();
        moneyInserted =  $('#add-coins').val();
        console.log('Item requested: ' + itemRequested + ' current Money: ' + moneyInserted)
        
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/money/' + moneyInserted + '/item/' + itemRequested,
            success: function(data, status) {
                
                    var coinsChange = 'Q: ' + data.quarters + ' D: ' + data.dimes + ' N: ' + data.nickels + ' P: ' + data.pennies;

                    $('#messages').val('Thank you!!!'); 
                    $('#give-change').val(coinsChange); 
                    
                },
            error: function( jqXHR, textStatus, errorThrown) {
                if (jqXHR.responseJSON.message === 'SOLD OUT!!!'){
                    $('#messages').val(jqXHR.responseJSON.message);
                } else {
                    $('#messages').val(jqXHR.responseJSON.message);
                    $('#add-coins').val(moneyInserted);
                }
                    
                }
            });
            $('#add-coins').val(0);
            $('#item-display').val('');
            
            // loadItems();
            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/items',
                success: function(itemArray) {
                    $.each(itemArray, function(index, item) {
                       
                        var itemInventory = '<p>' + 'Quantity Left: ' + item.quantity + '</p><br/>';
         
                        $('#itemInventory' + index).html(itemInventory);   
                        
                    });
                },
                error: function() {
                    alert('Failure');
                }
            });
        });
    }
    
    
    
    function clearItems() {
        for (var i = 0; i <= 8; i++) {
            $('#itemId' + i).empty();
            $('#itemName' + i).empty();
            $('#itemPrice' + i).empty();
            $('#itemInventory' + i).empty();
        }
        
    }
    
    function cancelTransaction() {
        
        var quartersChange = 0;
        var dimesChange = 0;
        var nickelsChange = 0;
        var penniesChange = 0;
        
        $('#cancel-transaction').click(function(){
            var moneyDeposited = $('#add-coins').val();
            moneyDeposited = moneyDeposited * 100;
            if (moneyDeposited >= 25) {
                quartersChange = Math.floor(moneyDeposited / 25);
                moneyDeposited %= 25;
            }
            if (moneyDeposited >= 10) {
                dimesChange = Math.floor(moneyDeposited / 10);
                moneyDeposited %= 10;
            }
            if (moneyDeposited >= 5) {
                nickelsChange = Math.floor(moneyDeposited / 5);
                moneyDeposited %= 5;
            }
            if (moneyDeposited >= 1) {
                penniesChange = moneyDeposited
            }
            $('#give-change').val('Q: ' + quartersChange + ' D: ' + dimesChange + ' N: ' + nickelsChange + ' P: ' + penniesChange);
            
            $('#add-coins').val(0);
            $('#item-display').val('');
            $('#messages').val('');
            
            
        });
    }
    
    
    